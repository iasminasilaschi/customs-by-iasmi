"""Paint-zone maps for the Photo planner: which pixel of a cut-out belongs to
which part of the shoe (side panel, front panel, toe, collar, heel, laces,
sole, inside). One grey PNG per view: value = zone id * 28, 0 = not shoe.

How a map is made (per view, config in zones_config.json):
  1. the cut-out's alpha = the shoe
  2. SAM2 (point prompts) for parts with clear edges: sole, laces, lining
  3. seam lines traced by hand (polylines, image px) split the leather panels
  4. seed points name each region; leftover pixels join the nearest zone

usage: python -I zones.py zones_config.json OUT_DIR [--only view] [--debug]
"""
import argparse
import json
import os

import cv2
import numpy as np
from PIL import Image

ZONES = {"side": 1, "front": 2, "toe": 3, "collar": 4, "heel": 5, "laces": 6, "sole": 7, "inside": 8}
STEP = 28
COLORS = {1: (110, 200, 90), 2: (230, 80, 70), 3: (240, 170, 60), 4: (90, 160, 230), 5: (150, 90, 40),
          6: (250, 230, 90), 7: (190, 120, 230), 8: (80, 200, 200)}

ap = argparse.ArgumentParser()
ap.add_argument("config")
ap.add_argument("out")
ap.add_argument("--only", default=None)
ap.add_argument("--debug", action="store_true")
a = ap.parse_args()
cfg = json.load(open(a.config))
base = os.path.dirname(os.path.abspath(a.config))
os.makedirs(a.out, exist_ok=True)

_sam = None


def sam():
    global _sam
    if _sam is None:
        from ultralytics import SAM
        _sam = SAM("sam2.1_l.pt")
    return _sam


def sam_mask(img_path, pos, neg, shape):
    pts = [list(p) for p in pos] + [list(p) for p in neg]
    labels = [1] * len(pos) + [0] * len(neg)
    r = sam()(img_path, points=[pts], labels=[labels], verbose=False)[0]
    if r.masks is None or len(r.masks.data) == 0:
        return np.zeros(shape, bool)  # SAM found nothing for this prompt
    m = r.masks.data.cpu().numpy().astype(bool)[0]
    if m.shape != shape:
        m = cv2.resize(m.astype(np.uint8), (shape[1], shape[0]), interpolation=cv2.INTER_NEAREST).astype(bool)
    return m


for name, v in cfg["views"].items():
    if a.only and name != a.only:
        continue
    src = os.path.join(base, v["src"]) if not os.path.isabs(v["src"]) else v["src"]
    rgba = np.array(Image.open(src).convert("RGBA"))
    H, W = rgba.shape[:2]
    shoe = rgba[:, :, 3] > 8
    # SAM sees the shoe on white (no magenta halo confusing it)
    flat = rgba[:, :, :3].astype(np.float32) * (rgba[:, :, 3:4] / 255) + 255 * (1 - rgba[:, :, 3:4] / 255)
    tmp = os.path.join(a.out, f"_{name}_flat.png")
    Image.fromarray(flat.astype(np.uint8)).save(tmp)

    label = np.zeros((H, W), np.uint8)
    # 2. SAM parts, in order (later ones win where they overlap)
    for part in v.get("sam", []):
        if part.get("each"):
            # one prompt per point (e.g. each lace loop); drop masks too big to be one
            m = np.zeros((H, W), bool)
            for p in part["pos"]:
                one = sam_mask(tmp, [p], part.get("neg", []), (H, W))
                if one.sum() <= part.get("max_area", 6000):
                    m |= one
                else:
                    print(f"  ~ {name}: {part['zone']} prompt {p} too big ({int(one.sum())}px), skipped")
        else:
            m = sam_mask(tmp, part["pos"], part.get("neg", []), (H, W))
        if part.get("smooth"):
            k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (part["smooth"], part["smooth"]))
            m = cv2.morphologyEx(cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_CLOSE, k), cv2.MORPH_OPEN, k).astype(bool)
        if part.get("dilate"):
            m = cv2.dilate(m.astype(np.uint8), np.ones((3, 3), np.uint8), iterations=part["dilate"]).astype(bool)
        label[m & shoe] = ZONES[part["zone"]]

    # 2a. the sole's raised rim and its underside belong to the sole too: per
    #     column, the leather ends at the dark shadow line a little above where
    #     SAM's (textured) sole starts; everything below that line is sole
    if v.get("rim"):
        lo, hi = v["rim"]
        gray = cv2.GaussianBlur(cv2.cvtColor(flat.astype(np.uint8), cv2.COLOR_RGB2GRAY).astype(np.float32), (0, 0), 1.5)
        sole = label == ZONES["sole"]
        cols = np.nonzero(sole.any(axis=0))[0]
        tops = np.array([np.nonzero(sole[:, c])[0].min() for c in cols], float)
        from scipy.ndimage import median_filter, uniform_filter1d
        tops = median_filter(tops, size=41, mode="nearest")
        edge = []
        for c, t in zip(cols, tops):
            y0, y1 = int(max(0, t - hi)), int(max(1, t - lo))
            seg = gray[y0:y1, c]
            edge.append(y0 + int(np.argmin(seg)) if len(seg) else t)
        edge = uniform_filter1d(median_filter(np.array(edge, float), size=31, mode="nearest"), 9, mode="nearest")
        rim = np.zeros((H, W), bool)
        yy = np.arange(H)[:, None]
        rim[:, cols] = yy >= edge[None, :]
        label[rim & shoe] = ZONES["sole"]
        if a.debug:
            np.save(os.path.join(a.out, f"_{name}_rim.npy"), np.stack([cols, edge]))

    # 2b. hand-drawn polygons for parts SAM can't see (optional)
    for poly in v.get("polygons", []):
        mk = np.zeros((H, W), np.uint8)
        cv2.fillPoly(mk, [np.array(poly["points"], np.int32)], 1)
        label[(mk > 0) & shoe & ((label == 0) | poly.get("over", False))] = ZONES[poly["zone"]]

    # 3. seams split what's left of the leather
    leather = shoe & (label == 0)
    cut = np.zeros((H, W), np.uint8)
    for line in v.get("seams", []):
        cv2.polylines(cut, [np.array(line, np.int32)], False, 1, thickness=3, lineType=cv2.LINE_8)
    free = (leather & (cut == 0)).astype(np.uint8)
    n, comp = cv2.connectedComponents(free, connectivity=4)
    # 4. seeds name regions
    for zone, seeds in v["seeds"].items():
        for x, y in seeds:
            c = comp[int(y), int(x)]
            if c == 0:
                print(f"  ! {name}: seed {zone} {x},{y} is not on free leather")
                continue
            label[(comp == c)] = ZONES[zone]
    # specks: islands smaller than min_island px join whatever surrounds them
    min_island = v.get("min_island", 300)
    for i in range(1, max(ZONES.values()) + 1):
        n_i, comp_i, st_i, _ = cv2.connectedComponentsWithStats((label == i).astype(np.uint8), 8)
        for j in range(1, n_i):
            if st_i[j, cv2.CC_STAT_AREA] < min_island:
                label[comp_i == j] = 0
    # leftovers (seam pixels, unnamed specks) take the nearest zone
    todo = shoe & (label == 0)
    if todo.any():
        known = (label > 0).astype(np.uint8)
        _, _, idx = None, None, None
        dist, ind = cv2.distanceTransformWithLabels((1 - known).astype(np.uint8), cv2.DIST_L2, 5, labelType=cv2.DIST_LABEL_PIXEL)
        ys, xs = np.nonzero(known)
        lut = np.zeros(ind.max() + 1, np.uint8)
        lut[ind[ys, xs]] = label[ys, xs]
        label[todo] = lut[ind[todo]]
    label[~shoe] = 0

    out = os.path.join(a.out, f"{name}.png")
    Image.fromarray((label * STEP).astype(np.uint8), "L").save(out, optimize=True)
    areas = {z: int((label == i).sum()) for z, i in ZONES.items() if (label == i).any()}
    print(name, areas)

    if a.debug:
        over = rgba[:, :, :3].astype(np.float32)
        for i, col in COLORS.items():
            m = label == i
            over[m] = over[m] * 0.45 + np.array(col) * 0.55
        over[~shoe] = (40, 40, 40)
        edges = cv2.Canny(label, 1, 1) > 0
        over[edges] = (20, 20, 20)
        Image.fromarray(over.astype(np.uint8)).save(os.path.join(a.out, f"dbg-{name}.jpg"), quality=88)
    os.remove(tmp)
