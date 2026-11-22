# Japan-inspired pair: Photo planner cut-outs

Lossless masters of the Photo planner views (`/design-lab/planner`). Web copies
(WebP) live in `public/design-lab/pairs/japan/`, password-protected with the
rest of the Design Lab. Only the background was removed: the shoe's pixels
are untouched. The four straight-on cut-outs were checked against the source
photo (max colour difference 0). The two side views were rotated once (bicubic)
so the sole is level.

| View | Master | Source photo | Notes |
| --- | --- | --- | --- |
| Left outer | `left-outer.png` | `clean/clean-side-2.jpeg`, top shoe (toe left) | levelled 21.6° |
| Left inner | `left-inner.png` | `clean/clean-side-1.jpeg`, top shoe (toe right) | levelled −22.0° |
| Right outer | none (web copy only) | mirrored `left-outer` | **approximate, retake photo** |
| Right inner | none (web copy only) | mirrored `left-inner` | **approximate, retake photo** |
| Left heel | `left-heel.png` | `clean/clean-heels.jpeg`, left shoe | |
| Right heel | `right-heel.png` | `clean/clean-heels.jpeg`, right shoe | |
| Left toe | `left-toe.png` | `clean/clean-front-top-view-table.jpeg`, right of the photo | toes point down (seen from the front) |
| Right toe | `right-toe.png` | `clean/clean-front-top-view-table.jpeg`, left of the photo | |

## Assumptions

- The side photos show the two shoes stacked, and the top shoe in both is the
  same physical shoe seen from either side. That shoe is treated as the
  **left** shoe. The clues disagree (the Zara tag sits on different shoes in
  different photos), so this is a best guess. Inner and outer look almost the
  same, so it doesn't matter for planning.
- Where the top shoe's sole rested on the bottom shoe, the sole's lower edge
  was smoothed along its real curve (`scripts/cutouts/smooth_bottom.py`, alpha
  only).

## Prompts used (`scripts/cutouts/cutout.py`)

```
clean-side-1  --level --pos 300,650 600,560 900,560 150,800 550,455 1000,590 200,930 --neg 500,1100 900,1050 1080,800 650,850 300,1050
clean-side-2  --level --pos 400,580 700,620 1000,700 1120,800 600,465 250,620 1100,930 --neg 400,1050 800,1080 130,850 600,900 1000,1100
  then smooth_bottom.py --from 0.08 --to 0.94 --off 1.0
heels L       --pos 300,700 250,1050 250,1250 450,900 150,1200 --neg 850,800 850,1200 650,1150 1000,1100
heels R       --pos 850,800 850,1200 650,1150 1000,1100 700,900 --neg 300,700 250,1050 250,1250 450,900
top (L toe)   --pos 850,700 850,1150 750,400 950,1300 850,250 658,650 653,800 --neg 300,1150 450,700 280,400 250,1300 585,700 622,780
top (R toe)   --pos 300,1150 450,700 280,400 250,1300 500,1000 400,250 --neg 850,700 850,1150 750,400 950,1300
```
