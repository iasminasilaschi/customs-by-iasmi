# iasmi.ro — a personal creative studio & mosaic of a life

Custom hand-painted sneakers as the hero offer, graduation caps as an
emerging seasonal service, tiny websites as a future collaborative branch —
wrapped in a personal "life mosaic" identity.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion ·
React Three Fiber + Drei (Design Lab 3D studio) · Zustand ·
React Hook Form + Zod. One small route handler (`/api/contact`) sends the contact form through Resend; no database.

## Routes

| Route | What it is |
| --- | --- |
| `/` | Homepage: hero (rotating pairs), featured work, Instagram grid, about teaser, a gentle contact section |
| `/projects` | Every real project (sneakers and graduation caps) |
| `/projects/[slug]` | One project: story, process steps, materials, before/after, galleries, Instagram links |
| `/about` | Who I am, the life mosaic, and how I paint in 4 steps |
| `/contact` | Channels, the short contact form (`?ref=<project slug>` prefills it), and a short FAQ |
| `/privacy` | Plain-language privacy page |
| `/design-lab` | Private 3D sneaker studio, for me only (password-protected, not linked, `noindex`) |
| `/design-lab/planner` | Private Photo planner: plan a pair on real photos, one canvas per side of each shoe, plus live "together" views (same password) |

`/process` and `/faq` were retired: they permanently redirect to `/about` and `/contact` (see `next.config.ts`).

## Where things live

- `data/` — all mock content (portfolio, starters, FAQ, testimonials, mosaic tiles, site config). Editing content never touches components.
- `components/` — `layout/`, `sections/`, `cards/`, `forms/`, `ui/`, `mosaic/`, `design-lab/`, `archive/`
- `lib/validation.ts` — Zod schema for the smart inquiry form
- `docs/ROADMAP.md` — phases 1–5 (through AI/3D lab)
- `docs/LEGAL-AND-CONTENT-NOTES.md` — **read before launch** (returns, IP, GDPR, placeholder checklist)

## Photo planner (`/design-lab/planner`)

Plans a pair on real cut-out photos. Code in `components/design-lab/planner/`,
pair data in `data/planner.ts`, cut-outs in `public/design-lab/pairs/<pair>/`
(served under `/design-lab`, so the same password protects them).

- **Views:** Left/Right × outer, inner, heel, toe. Each has its own canvas and art layers.
  Side views follow one rule: toe pointing **left** = left outer / right inner,
  toe pointing **right** = right outer / left inner.
- **Together views** are read-only, live composites of the side views. Tap a shoe to edit that view.
  - *The pair* (home screen) shows all eight views.
  - *Outer sides* puts the toes pointing away from each other.
  - *Inner sides* has a "feet together" toggle that slides them until they touch. It has two
    layouts: soles together (both folded open, toes up) or toe to toe.
  - Each together view exports as PNG.
- **Editing:** library (her uploads plus a few starter shapes), drag, pinch or the corner handle,
  paint look (multiply), clip to shoe, crop, layers, autosave to IndexedDB, plan export/import as JSON.
- **Approximate views** are marked in `data/planner.ts` (`approximate: "approximate, retake photo"`)
  and badged in the UI. For the Japan pair, *Right outer* and *Right inner* are mirrored copies
  of the left shoe's photos.

### Add a pair

1. **Photos:** for the best result, take **4 photos of a single shoe at a time, straight from the side**:
   outer and inner for each shoe. Then add **each heel and each toe from straight on**.
   One shoe per photo, nothing touching it (no stacking, no hand), plain background, camera at
   shoe height. Real photos for all four sides mean no mirrored, approximate views.
2. **Cut-outs:** `scripts/cutouts/cutout.py` (BiRefNet matte + SAM2 point prompts; `--level` for side views)
   and `smooth_bottom.py` (only for soles that touched another shoe). Run them in a throwaway venv:
   `python3 -m venv venv && venv/bin/pip install "rembg[cpu]" ultralytics opencv-python-headless scipy`,
   then `venv/bin/python -I scripts/cutouts/cutout.py photo.jpeg out.png --level --pos x,y … --neg x,y …`.
   They only remove the background and never change the shoe's pixels. Check the result on magenta (`--debug`).
3. Save web copies as `public/design-lab/pairs/<pair>/<left|right>-<outer|inner|heel|toe>.webp`,
   and keep the lossless PNG masters in `assets/sneakers/<pair>/cutouts/`.
4. Add the pair to `data/planner.ts` with each view's size and source photo, and an
   `approximate` note for any mirrored view.

## Key decisions & assumptions

- **The contact form really sends.** `components/forms/ContactForm.tsx` posts to `app/api/contact/route.ts`, which re-validates with the same zod schema (`lib/validation.ts`), checks a hidden honeypot field and a best-effort in-memory rate limit (5 per IP per hour, per server instance), then emails me through Resend (`lib/contact-email.ts`) with reply-to set to the visitor. Nothing is stored.
- **Environment variables** (see `.env.example`; set them in Vercel, never commit them): `DESIGN_LAB_PASSWORD` (the private `/design-lab`, locked if missing), `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, optional `CONTACT_FROM_EMAIL`.
- **Placeholder art is generative, not grey boxes.** `ArtPlaceholder` paints layered gradients + grain from each project's real palette; `VideoPlaceholder` mimics reel cards. Replacing them with real media is a per-item data change.
- **The Design Lab shoe is a procedural 3D model** ("Studio Low 01" — a generic low-top built from per-part meshes in `components/design-lab/studio/`, deliberately unbranded, abstract twin-bar side mark instead of any logo). Zero heavy assets, every panel clickable/paintable; a scanned GLTF can replace it later by mapping mesh names onto the same `data/shoe.ts` part keys. The 2D `SneakerPreview` SVG remains as the homepage teaser and the no-WebGL fallback.
- **Nav stays tight**: Home, Projects, About, Contact. Calls to action stay gentle ("say hi", "tell me about your dream pair"); orders aren't being pushed yet.
- **All contact details, prices, lead times and testimonials are placeholders**, flagged in code comments and `docs/LEGAL-AND-CONTENT-NOTES.md`.
- Accessibility: skip link, focus-visible styles, aria states on all toggles, `prefers-reduced-motion` respected globally and in Framer Motion.
