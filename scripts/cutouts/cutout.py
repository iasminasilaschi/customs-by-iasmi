"""Cut ONE shoe out of a photo: BiRefNet matte, gated and filled by a SAM2 mask.

Never retouches the shoe: output RGB == source RGB, only alpha is computed.
--level rotates RGB and alpha once (bicubic, separately so transparent pixels
keep their colour) so the sole's bottom edge is horizontal.

Used for the Photo planner views (public/design-lab/pairs/<pair>/). Setup and
the full recipe: README.md, "Add a pair to the Photo planner".

usage:
  python -I cutout.py SRC OUT.png --pos x,y [x,y ...] --neg x,y [...] [--level] [--debug dbg.jpg]
  --pos  points ON the shoe you want (laces, sole, heel, toe…)
  --neg  points on what must go (the other shoe, a hand, the box…)
"""
import argparse
import json

import cv2
import numpy as np
from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument("src")
ap.add_argument("out")
ap.add_argument("--pos", nargs="+", default=[])
ap.add_argument("--neg", nargs="+", default=[])
ap.add_argument("--box", default=None, help="optional x0,y0,x1,y1 box prompt")
ap.add_argument("--level", action="store_true", help="rotate so the sole is horizontal (side views)")
ap.add_argument("--debug", default=None, help="write a magenta preview + SAM overlay")
ap.add_argument("--hole-max", type=int, default=4000, help="fill enclosed holes up to this many px")
a = ap.parse_args()

pt = lambda s: [float(v) for v in s.split(",")]
src = Image.open(a.src).convert("RGB")
rgb = np.array(src)
H, W = rgb.shape[:2]

# 1. BiRefNet soft matte of everything in the photo
from rembg import new_session, remove

sess = new_session("birefnet-general")
matte = np.array(remove(src, session=sess, only_mask=True, post_process_mask=False)).astype(np.float32) / 255.0

# 2. SAM2 mask of the one shoe we want
from ultralytics import SAM

sam = SAM("sam2.1_l.pt")
points = [pt(p) for p in a.pos] + [pt(p) for p in a.neg]
labels = [1] * len(a.pos) + [0] * len(a.neg)
kw = dict(points=[points], labels=[labels], verbose=False)
if a.box:
    kw["bboxes"] = [pt(a.box)]
res = sam(a.src, **kw)[0]
m = res.masks.data.cpu().numpy().astype(bool)[0]
# keep the largest component (specks of the other shoe go)
n, lab, stats, _ = cv2.connectedComponentsWithStats(m.astype(np.uint8), 8)
if n > 2:
    m = lab == 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])

# fill small holes in SAM's mask (specks inside the leather); real gaps stay
inv = (~m).astype(np.uint8)
n2, lab2, st2, _ = cv2.connectedComponentsWithStats(inv, 4)
for i in range(1, n2):
    x, y, w, h, area = st2[i]
    if area < 600 and not (x == 0 or y == 0 or x + w >= W or y + h >= H):
        m[lab2 == i] = True

k = lambda r: cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1))
mu8 = m.astype(np.uint8)
inner = cv2.erode(mu8, k(3)).astype(bool)  # surely shoe

# 3. alpha: BiRefNet's fine edges, limited by a feathered SAM gate (~1-2 px):
#    where the shoe touches the OTHER shoe the matte is 1 on both sides, so the
#    edge follows SAM there. SAM fills what BiRefNet drops (white soles on
#    white tables, shaded heels).
gate = cv2.GaussianBlur(cv2.dilate(mu8, k(1)).astype(np.float32), (0, 0), 1.2)
alpha = matte * gate
alpha = np.where(inner, np.maximum(alpha, 1.0), alpha)

# 4. fill small enclosed holes, keep big real gaps
solid = (alpha > 0.5).astype(np.uint8)
n, lab, stats, _ = cv2.connectedComponentsWithStats(1 - solid, 4)
filled = 0
for i in range(1, n):
    x, y, w, h, area = stats[i]
    if x == 0 or y == 0 or x + w >= W or y + h >= H:
        continue
    if area <= a.hole_max:
        alpha[lab == i] = 1.0
        filled += area

a8 = np.clip(alpha * 255 + 0.5, 0, 255).astype(np.uint8)
rgba = np.dstack([rgb, a8])
info = {"filled_px": int(filled)}

# 5. levelling: fit the sole's bottom edge, rotate so it's horizontal
if a.level:
    ys, xs = np.nonzero(a8 > 128)
    x0, x1 = xs.min(), xs.max()
    cols = np.arange(int(x0 + 0.18 * (x1 - x0)), int(x0 + 0.82 * (x1 - x0)))
    bottoms = np.array([np.nonzero(a8[:, c] > 128)[0].max() for c in cols])
    p = np.polyfit(cols, bottoms, 1)
    for _ in range(3):  # the ground line is the max-y envelope
        r = bottoms - np.polyval(p, cols)
        keep = r > np.percentile(r, 30)
        p = np.polyfit(cols[keep], bottoms[keep], 1)
    angle = float(np.degrees(np.arctan(p[0])))
    info["angle"] = angle
    # rotate RGB and alpha separately: Pillow premultiplies RGBA, which would
    # zero the colour of transparent pixels (smooth_bottom.py needs them)
    r_ = np.array(Image.fromarray(rgb).rotate(angle, resample=Image.BICUBIC, expand=True))
    a_ = np.array(Image.fromarray(a8).rotate(angle, resample=Image.BICUBIC, expand=True))
    rgba = np.dstack([r_, a_])

# 6. crop to the shoe + a small margin
al = rgba[:, :, 3]
ys, xs = np.nonzero(al > 3)
pad = int(0.02 * max(xs.max() - xs.min(), ys.max() - ys.min()))
y0, y1 = max(0, ys.min() - pad), min(al.shape[0], ys.max() + pad + 1)
x0, x1 = max(0, xs.min() - pad), min(al.shape[1], xs.max() + pad + 1)
rgba = rgba[y0:y1, x0:x1]
info["size"] = [int(rgba.shape[1]), int(rgba.shape[0])]
Image.fromarray(rgba, "RGBA").save(a.out)

if a.debug:
    bg = np.zeros_like(rgba[:, :, :3])
    bg[:] = (255, 0, 200)  # magenta shows holes and halos
    al = rgba[:, :, 3:4].astype(np.float32) / 255
    Image.fromarray((rgba[:, :, :3] * al + bg * (1 - al)).astype(np.uint8)).save(a.debug, quality=88)
    ov = rgb.copy()
    ov[m] = (ov[m] * 0.5 + np.array([0, 255, 0]) * 0.5).astype(np.uint8)
    for p_, l_ in zip(points, labels):
        cv2.circle(ov, (int(p_[0]), int(p_[1])), 14, (0, 0, 255) if l_ else (255, 0, 0), -1)
    Image.fromarray(ov).save(a.debug.replace(".jpg", "-sam.jpg"), quality=80)
print(json.dumps(info))
