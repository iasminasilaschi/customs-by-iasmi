/**
 * Content in the visitor's language. English is the source (portfolio.ts,
 * media.ts, instagram.ts); Romanian comes from data/i18n/ro.ts, field by
 * field, falling back to English wherever a translation is missing.
 */
import type { Locale } from "@/lib/i18n";
import type { PhotoData, ShowcaseSlide } from "@/data/media";
import { heroShowcase } from "@/data/media";
import { instagramPosts, type InstagramPost } from "@/data/instagram";
import { portfolio, type PortfolioPiece } from "@/data/portfolio";
import { roHero, roInstagram, roInstagramLabels, roPieces, roTags, type PhotoText } from "@/data/i18n/ro";

const withText = (photo: PhotoData, text?: PhotoText): PhotoData =>
  text ? { ...photo, alt: text.alt, caption: text.caption ?? photo.caption } : photo;

function toRomanian(p: PortfolioPiece): PortfolioPiece {
  const t = roPieces[p.slug];
  if (!t) return { ...p, tags: p.tags?.map((tag) => roTags[tag] ?? tag) };
  const photo = (ph: PhotoData) => withText(ph, t.photos?.[ph.src]);
  return {
    ...p,
    title: t.title ?? p.title,
    subtitle: t.subtitle ?? p.subtitle,
    story: t.story ?? p.story,
    processSteps: t.processSteps ?? p.processSteps,
    materials: t.materials ?? p.materials,
    time: t.time ?? p.time,
    learned: t.learned ?? p.learned,
    processNote: t.processNote ?? p.processNote,
    tags: p.tags?.map((tag) => roTags[tag] ?? tag),
    instagram: p.instagram?.map((l) => ({ ...l, label: roInstagramLabels[l.label] ?? l.label })),
    cover: withText(p.cover, t.cover),
    before: p.before && withText(p.before, t.before),
    after: p.after && withText(p.after, t.after),
    gallery: p.gallery?.map(photo),
    processPhotos: p.processPhotos?.map(photo),
    chapters: p.chapters?.map((c, i) => ({
      ...c,
      title: t.chapters?.[i]?.title ?? c.title,
      note: t.chapters?.[i]?.note ?? c.note,
      photos: c.photos.map(photo),
    })),
  };
}

const cache = new Map<Locale, PortfolioPiece[]>();

/** Every project, newest first, in this language. */
export function portfolioFor(locale: Locale): PortfolioPiece[] {
  if (locale === "en") return portfolio;
  let list = cache.get(locale);
  if (!list) {
    list = portfolio.map(toRomanian);
    cache.set(locale, list);
  }
  return list;
}

export const getPieceFor = (slug: string, locale: Locale) => portfolioFor(locale).find((p) => p.slug === slug);

export const featuredFor = (locale: Locale) => portfolioFor(locale).filter((p) => p.featured);

/** Homepage hero rotation in this language. */
export function heroShowcaseFor(locale: Locale): ShowcaseSlide[] {
  if (locale === "en") return heroShowcase;
  return heroShowcase.map((s) => {
    const t = roHero[s.slug];
    return t ? { ...s, caption: t.caption, photo: { ...s.photo, alt: t.alt } } : s;
  });
}

/** Instagram tiles in this language. */
export function instagramPostsFor(locale: Locale): InstagramPost[] {
  if (locale === "en") return instagramPosts;
  return instagramPosts.map((p) => {
    const t = roInstagram[p.url];
    return t ? { ...p, caption: t.caption, image: { ...p.image, alt: t.alt } } : p;
  });
}
