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
| `/` | Homepage: hero (rotating pairs), featured work, Instagram grid, about teaser, a gentle contact section |
| `/projects` | Every real project (sneakers and graduation caps) |
| `/projects/[slug]` | One project: story, process steps, materials, before/after, galleries, Instagram links |
| `/about` | Who I am, the life mosaic, and how I paint in 4 steps |
| `/contact` | Channels, the short contact form (`?ref=<project slug>` prefills it), and a short FAQ |
| `/privacy` | Plain-language privacy page |
| `/design-lab` | Private 3D sneaker studio, for me only (password-protected, not linked, `noindex`) |

`/process` and `/faq` were retired: they permanently redirect to `/about` and `/contact` (see `next.config.ts`).

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
- **Nav stays tight**: Home, Projects, About, Contact. Calls to action stay gentle ("say hi", "tell me about your dream pair"); orders aren't being pushed yet.
- **All contact details, prices, lead times and testimonials are placeholders**, flagged in code comments and `docs/LEGAL-AND-CONTENT-NOTES.md`.
- Accessibility: skip link, focus-visible styles, aria states on all toggles, `prefers-reduced-motion` respected globally and in Framer Motion.
