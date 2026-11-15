import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    // the Design Lab is private (password-protected, see proxy.ts)
    rules: { userAgent: "*", allow: "/", disallow: "/design-lab" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
