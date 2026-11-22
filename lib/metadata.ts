import type { Metadata } from "next";
import { localePath, locales, ogLocale, type Locale } from "@/lib/i18n";

export const SITE_URL = "https://iasmi.ro";
export const SITE_NAME = "Customs by Iasmi";
export const DEFAULT_OG_IMAGE = "/work/one-piece-sneakers/04.jpg";

/**
 * Canonical URL for this page in this language, plus hreflang links to the
 * same page in every language (x-default = English), so search engines show
 * Romanian visitors the Romanian page and nobody sees "duplicate content".
 */
export function languageAlternates(locale: Locale, path: string): Metadata["alternates"] {
  return {
    canonical: localePath(locale, path),
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, localePath(l, path)])),
      "x-default": localePath("en", path),
    },
  };
}

/**
 * Per-page metadata: title, description, canonical + language links, and
 * Open Graph tags that point at this page (a page's own `openGraph` replaces
 * the root one, so without this every page would share the homepage's og:url
 * and title). Twitter/X reads the og: tags; the root layout only sets the card type.
 */
export function pageMetadata({
  locale,
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
}: {
  locale: Locale;
  title: string;
  description: string;
  /** e.g. "/projects" — the English path; Romanian gets /ro in front */
  path: string;
  image?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: languageAlternates(locale, path),
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url: localePath(locale, path),
      locale: ogLocale[locale],
      title: `${title} · ${SITE_NAME}`,
      description,
      images: [image],
    },
  };
}
