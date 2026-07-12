# iasmi.ro — Roadmap

The site is built so each phase adds on top of the last without a redesign.

## Phase 1 — Creative identity website ✅ (this build)
- Personal creative studio homepage (sneakers = hero offer)
- Archive with categories (sneakers, caps, process, sketches, digital, life)
- Process page, About mosaic, FAQ, Contact
- Smart inquiry form with conditional fields per project type (no backend yet — mailto handoff)
- Design Lab v1 shell: starters, mood tags, palette-driven concept sneaker preview
- Graduation caps presented as emerging/limited service
- Digital projects presented as future/collaboration area

## Phase 2 — Real portfolio growth
- Replace `ArtPlaceholder`/`VideoPlaceholder` with real photos & reels
  (drop files in `/public`, add paths to `data/portfolio.ts` — component swap is localized)
- Add the two September graduation caps as full case studies
- Before/after case studies with real images
- Real testimonials (with permission) — remove `isSample` flag rendering
- Clearer pricing ranges in `data/starters.ts`
- Real inbox: API route + Resend (or a form service) replacing the mailto handoff
- Media storage: Cloudinary or `/public` + next/image

## Phase 3 — Design Lab v2
- Moodboard uploads (needs storage — Cloudinary/Supabase)
- Save & share concepts (needs DB — Supabase/Postgres)
- Palette extraction from uploaded images (client-side canvas is enough)
- Richer starters, zone-level colour choices on the SVG sneaker

## Phase 4 — More services
- `/custom-caps` dedicated route (archive category + contact type already exist)
- `/digital-studio` route with small case studies
- Collaboration page
- Deposits via Stripe (env-var configured, never hardcoded)

## Phase 5 — Advanced AI/3D
- AI-assisted concept generation (Vercel AI SDK + image APIs)
- Zone-aware sneaker mockups
- 3D customizer (React Three Fiber + Drei), AR preview
- Customer dashboard, drops

## Integration seams already in place
- `data/site.ts` — single place for contact details, slots, lead time
- `lib/validation.ts` — inquiry schema ready to POST to an API route
- `InquiryForm.deliver` comment marks where the real submission goes
- `SneakerPreview` zones map 1:1 to future interactive zone controls
- All mock data typed and isolated in `/data`
