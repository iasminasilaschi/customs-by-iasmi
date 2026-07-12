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
React Hook Form + Zod. No backend, no paid services — by design for v1.

## Routes

| Route | What it is |
| --- | --- |
| `/` | Cinematic homepage: hero, featured work, Design Lab teaser, "Beyond sneakers", process, social proof, about teaser, contact CTA |
| `/archive` | Filterable portfolio grid (sneakers, caps, process, sketches, digital, life) |
| `/archive/[slug]` | Case study: story, process steps, materials, palette, before/after, gallery, CTA |
| `/design-lab` | Design Lab v2: interactive 3D shoe studio — rotate, click parts, paint per-part colours, preset colourways, concept summary → commission form; roadmap below |
| `/process` | How commissions work, expectations, materials & care |
| `/about` | The life mosaic: tiles, timeline, future digital studio |
| `/faq` | Trust page — ordering, wear & care, design rights, policies |
| `/contact` | Channels + the smart inquiry form (`?type=cap` etc. preselects) |

## Where things live

- `data/` — all mock content (portfolio, starters, FAQ, testimonials, mosaic tiles, site config). Editing content never touches components.
- `components/` — `layout/`, `sections/`, `cards/`, `forms/`, `ui/`, `mosaic/`, `design-lab/`, `archive/`
- `lib/validation.ts` — Zod schema for the smart inquiry form
- `docs/ROADMAP.md` — phases 1–5 (through AI/3D lab)
- `docs/LEGAL-AND-CONTENT-NOTES.md` — **read before launch** (returns, IP, GDPR, placeholder checklist)

## Key decisions & assumptions

- **No fake backend.** The form validates client-side, then hands the visitor a pre-filled `mailto:` and an Instagram DM link. Swap for an API route + Resend in Phase 2 (seam is marked in `InquiryForm`).
- **Placeholder art is generative, not grey boxes.** `ArtPlaceholder` paints layered gradients + grain from each project's real palette; `VideoPlaceholder` mimics reel cards. Replacing them with real media is a per-item data change.
- **The Design Lab shoe is a procedural 3D model** ("Studio Low 01" — a generic low-top built from per-part meshes in `components/design-lab/studio/`, deliberately unbranded, abstract twin-bar side mark instead of any logo). Zero heavy assets, every panel clickable/paintable; a scanned GLTF can replace it later by mapping mesh names onto the same `data/shoe.ts` part keys. The 2D `SneakerPreview` SVG remains as the homepage teaser and the no-WebGL fallback.
- **Nav stays tight** (Archive, Design Lab, Process, About, Contact + CTA). A separate "Sneakers" tab was skipped in v1 because the homepage *is* the sneaker page; `/custom-caps` and `/digital-studio` are reserved for later phases (FAQ lives in the footer).
- **All contact details, prices, lead times and testimonials are placeholders**, flagged in code comments and `docs/LEGAL-AND-CONTENT-NOTES.md`.
- Accessibility: skip link, focus-visible styles, aria states on all toggles, `prefers-reduced-motion` respected globally and in Framer Motion.
