"""Regularise the sole's bottom edge of a LEVELLED side cut-out (alpha only).

For stacked-shoe photos: where the top shoe's sole rested on the other shoe,
SAM's edge zig-zags into the gaps between the other shoe's laces. The real
sole edge is a smooth curve, so cut alpha along a running median of the
bottom contour. RGB is untouched (needs cutout.py's separate-channel
rotation so re-opened edge pixels keep their real colour).

usage: python -I smooth_bottom.py IN.png OUT.png [--from 0.08] [--to 0.94] [--off 1.0]
"""
import argparse

import numpy as np
from PIL import Image
from scipy.ndimage import median_filter

ap = argparse.ArgumentParser()
ap.add_argument("inp")
ap.add_argument("out")
ap.add_argument("--from", dest="f", type=float, default=0.08, help="start, fraction of width")
ap.add_argument("--to", dest="t", type=float, default=0.94, help="end, fraction of width")
ap.add_argument("--win", type=int, default=61, help="median window (px)")
ap.add_argument("--fill", type=int, default=8, help="max px re-opened above the edge")
ap.add_argument("--off", type=float, default=1.0, help="pull the edge up by this many px")
a = ap.parse_args()

im = np.array(Image.open(a.inp))
src_alpha = im[:, :, 3].copy()
al = im[:, :, 3].astype(np.float32) / 255
H, W = al.shape
bot = np.array([(np.nonzero(al[:, c] > 0.5)[0].max() if (al[:, c] > 0.5).any() else -1) for c in range(W)], float)
c0, c1 = int(a.f * W), int(a.t * W)
med = median_filter(bot[c0:c1], size=a.win, mode="nearest")
sm = np.convolve(np.pad(med, 7, mode="edge"), np.ones(15) / 15, mode="valid")

ys = np.arange(H)
for j, c in enumerate(range(c0, c1)):
    e = sm[j] - a.off
    col = al[:, c]
    edge = np.clip(e - ys + 0.5, 0, 1)  # 1 above the edge, anti-aliased at it, 0 below
    near = ys > e - a.fill
    col = np.where(near, np.where(ys <= e, np.maximum(col, edge), 0.0), col)
    col = np.minimum(col, np.where(ys > e + 0.5, 0, 1))
    al[:, c] = col

im[:, :, 3] = np.clip(al * 255 + 0.5, 0, 255).astype(np.uint8)
Image.fromarray(im).save(a.out)
print("changed px:", int((np.abs(src_alpha.astype(int) - im[:, :, 3]) > 8).sum()))
