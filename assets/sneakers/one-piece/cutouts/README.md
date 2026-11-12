# One Piece cutouts

Transparent PNGs for the Instagram carousel, same base name as the source photo, full
resolution of the source. `contact-sheet.jpg` shows all of them on a light background.

Method, same as the tattoo cats and cherry blossoms cutouts: BiRefNet (full
`birefnet-general` model) for the edges, SAM 2.1 (large) to drop hands, the other shoe and
props. **Every visible pixel is the photo's own pixel** (checked: 0 difference from the
source in every file). Nothing was inpainted, recoloured, enhanced or redrawn. Sideways
photos are turned upright. Where a shoe runs out of the frame, that edge fades out softly.

None of these are cut from the `*-ai-background.jpeg` files. The newly-painted ones are
re-cut from the iPhone `newly-painted-*-no-background.jpeg` originals.

Right shoe = Zoro + wanted poster, One Piece logo on the heel. Left shoe = Luffy + dragon,
R·M·A initials on the heel.

| File | Source | Shoe + side | What's visible | Frame edges faded |
| --- | --- | --- | --- | --- |
| `result-both-outer-zoro-on-top-on-puzzle.png` | `newer/result-both-outer-zoro-on-top-on-puzzle.jpeg` | both, outer sides (right on top) | Zoro + wanted poster above, Luffy + dragon below, laces of the lower shoe in the gap | none |
| `result-both-outer-zoro-on-top-on-puzzle-with-puzzle.png` | same | both, outer sides + the puzzle box | as above, standing on the One Piece puzzle box | bottom (the box runs out of the frame) |
| `result-both-outer-luffy-on-top.png` | `newer/result-both-outer-luffy-on-top.jpeg` | both, outer sides (left on top) | Luffy + dragon above, Zoro + wanted poster below | left, right |
| `result-right-zoro-outer-closeup.png` | `newer/result-right-zoro-outer-closeup.jpeg` | right, outer side (close-up) | Zoro with both swords, laces | bottom, left, right |
| `result-left-luffy-outer-dragon-heel.png` | `newer/result-left-luffy-outer-dragon-heel.jpeg` | left, outer side + heel | Luffy, the dragon, edge of the R·M·A heel | left |
| `result-left-luffy-outer-closeup.png` | `newer/result-left-luffy-outer-closeup.jpeg` | left, outer side (close-up) | Luffy's face and hat, part of the dragon | bottom, left, right |
| `result-left-luffy-heel-rma-closeup.png` | `newer/result-left-luffy-heel-rma-closeup.jpeg` | left, heel | R·M·A initials | bottom |
| `result-right-zoro-heel-one-piece-logo-closeup.png` | `newer/result-right-zoro-heel-one-piece-logo-closeup.jpeg` | right, heel | One Piece logo | bottom |
| `result-right-zoro-wanted-poster-closeup.png` | `newer/result-right-zoro-wanted-poster-closeup.jpeg` | right, outer side near the heel (close-up) | wanted poster, Zoro's sword hand, edge of the heel logo | bottom, left, right |
| `result-right-zoro-outer-wanted-poster.png` | `newer/result-right-zoro-outer-wanted-poster.jpeg` | right, outer side | Zoro + wanted poster | bottom, right |
| `process-picture-1.png` | `process-picture-1.jpeg` (turned upright) | right, outer side + heel | process: heel logo and wanted poster painted, Zoro still a pencil sketch, masking tape on | bottom, left |
| `process-picture-2.png` | `process-picture-2.jpeg` (turned upright) | right, outer side | same stage, whole side with the Zoro sketch | left |
| `process-picture-3.png` | `process-picture-3.jpeg` (turned upright) | right, outer side + heel | same stage (near-duplicate of 1) | bottom, left |
| `process-picture-4.png` | `process-picture-4.jpeg` (turned upright) | right, heel + wanted poster | same stage, closer | bottom, left |
| `worn-after-1-year-nice-full-studio-picture.png` | `worn-after-1-year-nice-full-studio-picture.jpeg` | both, outer sides (right on top) | Zoro + wanted poster, Luffy + dragon, after a year of wear | none |
| `worn-after-1-year-nice-studio-picture-no-background.png` | `worn-after-1-year-nice-studio-picture-no-background.jpeg` | both, outer sides (right on top) | same pose, from the iPhone cutout (tighter crop) | top, left, right |
| `newly-painted-back-of-shoes-no-background.png` | `newly-painted-back-of-shoes-no-background.jpeg` | both, heels | R·M·A (left) and One Piece logo (right), newly painted | top, bottom, left |
| `newly-painted-wearing-them-no-background-left-shoe.png` | `newly-painted-wearing-them-no-background-left-shoe.jpeg` | left, outer side, worn | Luffy + dragon, R·M·A on the heel, newly painted | top, bottom, left |
| `newly-painted-wearing-them-no-background-right-shoe.png` | `newly-painted-wearing-them-no-background-right-shoe.jpeg` | right, outer side, worn | Zoro + wanted poster, One Piece logo on the heel, newly painted | right |

## Notes per file

- **Puzzle shot:** the poster seen through the gap between the two shoes is removed and
  the laces of the lower shoe are kept. In the `-with-puzzle` version the box is cut along
  its straight edges, including its black skull-pattern border.
- **Luffy on top:** the Thousand Sunny figurehead in the poster behind the heel collar is
  removed.
- **Luffy + dragon + heel:** the Zoro shoe underneath is removed. Its lace tips touched the
  sole, so the sole's bottom edge follows the line between them. The heel's shaded bottom
  edge comes from SAM, because BiRefNet half-dropped it. These are the photo's own sole
  pixels.
- **Zoro close-up:** BiRefNet's matte is used as it is, except for the blurry white sole
  at the bottom, which it half-dropped. The sole comes from SAM.
- **Process pictures:** the other shoe (Luffy colour blocks) and the white things around
  them are removed. The yellow masking tape stays because it's on the shoe. In 3 and 4,
  BiRefNet lost the white sole against the white background, so the sole comes from SAM.
- **Wearing them:** the trousers (and the knee in the right-shoe photo) are removed. The
  sock fades out above the shoe, like the arm in the tattoo cats cutouts.

## Not made

- **`-with-cup`:** the One Piece cup is only in two video clips
  (`newer/setup-with-one-piece-cup*.mp4`), never in a photo. A cutout from a video frame
  would only be 576×1024 and soft.
- **The other new photos:** `result-both-outer-zoro-on-top-closeup`, `-medium` and
  `result-both-outer-luffy-on-top-closer` repeat the two stacked poses above but crop a
  heel or the wanted poster. The setup photos and the `unused/` near-duplicates are left
  out too. The reel uses some of them (`../reel-setup-vs-results/`).
