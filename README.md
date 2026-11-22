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

Every public page also exists in Romanian under `/ro` (e.g. `/ro/projects/sushi-cats`); see **Languages** below.

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

## Languages (English + Romanian)

- **URLs:** English stays at the plain URLs (`/projects`), Romanian lives under `/ro` (`/ro/projects`). Pages are in `app/[lang]/`; `proxy.ts` serves plain URLs from `/en/…` behind the scenes, redirects `/en/…` to the plain URL, and sends visitors who picked Romanian (the `lang` cookie) to the `/ro` page. Search engines get both, linked with hreflang tags and in the sitemap.
- **Choosing:** first visit shows a small two-language card (`components/layout/LanguagePrompt.tsx`), the browser's preferred language first; the EN | RO switch in the header (`LanguageSwitch.tsx`) changes it any time, staying on the same page. The choice is one functional cookie (`lang=en|ro`, a year), mentioned on the privacy page.
- **Interface text:** `lib/dictionaries/en.ts` and `ro.ts` (same shape, TypeScript checks nothing is missing).
- **Content:** English stays the source in `data/portfolio.ts`, `data/media.ts`, `data/instagram.ts`; Romanian is in `data/i18n/ro.ts` (stories, steps, materials, lessons, photo descriptions and captions by photo path, hero and Instagram captions). Missing Romanian falls back to English. **Adding a project or photo: add its Romanian text there too.**
- **Privacy page:** written out in full in both languages in `app/[lang]/privacy/page.tsx`; change both together.
- The contact form answers in the page's language, and the email I get says when someone wrote from the Romanian site (subject ends in "· RO").
- The Design Lab stays English-only (`/ro/design-lab` redirects to `/design-lab`).
- Fonts load the `latin-ext` subset so ă, ș, ț render in the site's own fonts.

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

### Paint zones

Each view is split into the shoe's real panels: **side panel, front panel, toe, collar, heel, laces & tongue, sole**, plus **inside** (the lining) on the top views. An image only shows on the parts it's assigned to:
- A new image gets the part under where it's dropped.
- The Adjust tab lists every part as a button, and hovering one highlights it on the shoe.
- When an image reaches into parts it isn't on, the planner offers "It also reaches the front panel and the sole. Let it paint there too?"
- While an image is selected, the cut-off part shows faintly.
- Turning off "Crop to its parts" lets an image spill anywhere, as before.

The zones come from one grey PNG per view in `public/design-lab/pairs/<pair>/zones/` (value = zone id × 28), made by `scripts/cutouts/zones.py` from `scripts/cutouts/zones-<pair>.json`:
- SAM point prompts find the parts with clear edges: sole, laces, lining.
- Seam lines traced by hand on the cut-out (pixel coordinates) split the leather panels.
- Seed points name each region.
- Leftover pixels join the nearest zone.

Debug overlays (`--debug`) show each zone in colour, for checking. Mirrored views get mirrored maps. Rebuild with `venv/bin/python -I scripts/cutouts/zones.py scripts/cutouts/zones-japan.json OUT --debug` (same venv as the cut-outs, minus rembg), then copy `OUT/*.png` into the zones folder.

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
