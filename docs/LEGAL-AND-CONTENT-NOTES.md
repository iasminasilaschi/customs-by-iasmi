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
- Done (Nov 2026): `/privacy` is live (who runs the site, no server storage,
  form drafts only in the visitor's browser with 30-day expiry and a
  "clear saved draft" link, Vercel Web Analytics, email/DM data, GDPR
  rights, ANSPDCP). Linked from the footer, the FAQ note and the form.
- No cookie banner needed: no cookies are set; Vercel Web Analytics is
  cookieless. Revisit if any cookie-based tool is ever added.
- Design Lab state (colours, uploaded photos, lettering) also lives in
  localStorage with no expiry; the privacy page says so. Consider an expiry
  like the form draft's.
- Before adding a real backend (API route/Resend/Supabase): update the
  privacy page, add consent language to the form, define retention, and
  list the new processor (e.g. the email service).

## Testimonials & claims
- All testimonials are mock data flagged `isSample: true` and badged
  "sample" in the UI. Never remove the badge without replacing content
  with real, permissioned quotes.
- Lead times, slot counts, prices and contact details are placeholders in
  `data/site.ts` / `data/starters.ts` — confirm before launch.

## Pre-launch checklist
- [ ] Replace placeholder email/phone/socials in `data/site.ts`
- [ ] Real pricing ranges + lead times
- [x] Privacy page (`/privacy`, Nov 2026); update its "last updated" date on changes
- [ ] Terms of sale + business details (legal form, CUI/registration, address)
      — wait until paid orders open; required before taking money
- [ ] Replace sample testimonials or keep badges
- [ ] Review FAQ policy wording with a professional
- [x] Real domain metadata check (OG image, favicon): canonicals, per-page
      OG tags, icons, manifest, robots.txt and sitemap.xml are in (Nov 2026)
