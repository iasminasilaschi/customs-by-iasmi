# Tattoo cats sneakers

Birthday gift for another best friend (from a few friends together): white
Nike Air Force 1s, the edition with the Nike Air heel logo upside down. Eight
fine-line cat tattoos (front + back panel on each side) and a cat paw on each
heel. Painted in one night, 18 November 2023, 1:48 to 5:02 a.m. Website page:
`/projects/tattoo-cats` (text in `data/portfolio.ts`, site photos in
`public/work/tattoo-cats/`). Also in the homepage hero rotation
(`heroShowcase` in `data/media.ts`).

This folder is the **archive of originals**.

| Site file | Original |
| --- | --- |
| `cover-side-2.webp` (project cover + hero) | `finished-right-outer.jpeg`, cut out (rembg, BiRefNet). Her thumb covered the sole's heel corner: only that spot was filled in with AI inpainting (LaMa) and colour-matched to the sole, nothing else on the shoe was changed; the shoe behind, where it runs out of the top of the frame, fades out softly. (An earlier cover was cut from `finished-both-from-heels.jpeg`.) |
| `01.jpg` | `finished-right-outer.jpeg` |
| `02.jpg` | `finished-left-inner.jpeg` |
| `03.jpg` | `finished-left-outer.jpeg` |
| `04.jpg` | `finished-right-inner.jpeg` |
| `05.jpg` | `finished-heel.jpeg` |
| `making-01.jpg` | `clean-nike-shoe-before.jpeg`, turned upright (the original lies sideways) |
| `making-02.jpg` | `left-shoe-inner-panel-with-printed-inspo.jpeg` |
| `making-03.jpg` | `left-shoe-outer-panel-with-printed-inspo.jpeg` |
| `making-04.jpg` | `right-shoe-inner-panel-with-printed-inspo.jpeg` |
| `making-05.jpg` | `right-shoe-outer-panel-with-printed-inspo.jpeg` |

`finished-heel-another-pic.jpeg` is a near-duplicate of `finished-heel.jpeg`,
kept here only.

## Notes

- Brief: simple, classy, subtle. She likes classy, minimalist, cute things and
  loves cats.
- The designs come from cat tattoos found online. They were printed at home,
  sized to the panels, cut out and placed on the shoes as a paper mockup, only
  to ask the friends giving the gift whether they liked it. The final
  placements changed a little from the mockup.
- Old paints (not Angelus) and rushed coats. She has machine washed them at
  least twice: the lines are still there, a bit faded in places.
- Tattoo designs most likely from Pinterest; artists unknown (she's OK showing the mockups).
- Painted with a thin brush (no markers); deglazed with acetone and cotton balls.

## Cutouts

`cutouts/` has a transparent PNG of every photo above, same file names, full
resolution (BiRefNet for the edges, SAM to tell the shoe apart from hands and
the other shoe). Sideways photos are turned upright; where a shoe runs out of
the frame, that edge fades out softly.

- `finished-right-outer.png`: her hand is removed. The heel corner her thumb
  covered reuses the same filled-in spot as the site cover (`cover-side-2.webp`),
  so nothing new was invented.
- `finished-left-inner.png`, `finished-left-outer.png`, `finished-right-inner.png`:
  her hand covers too much of the sole and heel to fill in honestly (on the
  inner side, the thumb sits on the AIR logo), so these are "shoe in hand"
  cutouts. The arm fades out where it leaves the frame.
- Everything else is the photo's own pixels with the background removed.
