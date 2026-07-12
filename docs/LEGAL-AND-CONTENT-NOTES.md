# Internal legal & content notes (read before launch)

These are working notes, not legal advice. Have final policy text reviewed
by a professional before accepting paid orders.

## Copyright / IP
- Customer-uploaded inspiration images may be copyrighted. The studio's
  position (already reflected in FAQ copy): **inspired-by, not copied** —
  no 1:1 reproduction of copyrighted characters, artworks or logos.
- Anime/cartoon/brand-inspired requests are accepted as *interpretations*.
- Keep this stance in all marketing copy and social captions.

## Branded base shoes
- Base shoes are authentic, sourced at retail or client-supplied.
- The site must never imply affiliation with or endorsement by Nike, Vans,
  Adidas, etc. Current copy on /process includes an independence note —
  keep it when rewriting.
- Avoid using brand logos in site imagery; photograph customs so the
  artwork, not the brand mark, is the subject.

## Returns / consumer rights (EU/Romania)
- Personalised, made-to-order goods are generally exempt from the 14-day
  withdrawal right (EU Consumer Rights Directive art. 16(c)) — but this
  must be stated clearly *before* purchase to apply.
- Statutory conformity rights for faulty products always apply and must
  never be disclaimed. FAQ copy already reflects both points softly.
- Before paid orders: publish full Terms, a return/repair policy, and an
  order confirmation flow that records agreement.

## Privacy / GDPR
- The current form sends data via the visitor's own email client (mailto) —
  no data is stored by the site, so exposure is minimal in v1.
- Before adding a real backend (API route/Resend/Supabase): publish a
  privacy policy, add consent language to the form, define retention, and
  add a cookie notice only if analytics/cookies are introduced.

## Testimonials & claims
- All testimonials are mock data flagged `isSample: true` and badged
  "sample" in the UI. Never remove the badge without replacing content
  with real, permissioned quotes.
- Lead times, slot counts, prices and contact details are placeholders in
  `data/site.ts` / `data/starters.ts` — confirm before launch.

## Pre-launch checklist
- [ ] Replace placeholder email/phone/socials in `data/site.ts`
- [ ] Real pricing ranges + lead times
- [ ] Terms & privacy pages
- [ ] Replace sample testimonials or keep badges
- [ ] Review FAQ policy wording with a professional
- [ ] Real domain metadata check (OG image, favicon)
