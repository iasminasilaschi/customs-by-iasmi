import type { MetadataRoute } from "next";
import { portfolio } from "@/data/portfolio";
import { SITE_URL } from "@/lib/metadata";

/** Every static page, plus one entry per project in data/portfolio.ts. */
const staticPaths = ["/", "/projects", "/design-lab", "/process", "/about", "/faq", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticPaths.map((path) => ({ url: `${SITE_URL}${path === "/" ? "" : path}` })),
    ...portfolio.map((p) => ({ url: `${SITE_URL}/projects/${p.slug}` })),
  ];
}
