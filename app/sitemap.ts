import type { MetadataRoute } from "next";
import { portfolio } from "@/data/portfolio";
import { localePath, locales } from "@/lib/i18n";
import { SITE_URL } from "@/lib/metadata";

/** Every page in every language, each listing its translations (hreflang). */
const staticPaths = ["/", "/projects", "/about", "/contact", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...staticPaths, ...portfolio.map((p) => `/projects/${p.slug}`)];
  const abs = (locale: (typeof locales)[number], path: string) => `${SITE_URL}${localePath(locale, path) === "/" ? "" : localePath(locale, path)}`;
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: abs(locale, path),
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, abs(l, path)])) },
    })),
  );
}
