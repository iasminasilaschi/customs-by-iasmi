import type { Metadata } from "next";

export const SITE_URL = "https://iasmi.ro";
export const SITE_NAME = "Customs by Iasmi";
export const DEFAULT_OG_IMAGE = "/work/one-piece-sneakers/04.jpg";

/**
 * Per-page metadata: title, description, a canonical URL, and Open Graph tags
 * that point at this page (a page's own `openGraph` replaces the root one, so
 * without this every page would share the homepage's og:url and title).
 * Twitter/X reads the og: tags; the root layout only sets the card type.
 */
export function pageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
}: {
  title: string;
  description: string;
  /** e.g. "/projects" — resolved against metadataBase */
  path: string;
  image?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url: path,
      title: `${title} · ${SITE_NAME}`,
      description,
      images: [image],
    },
  };
}
