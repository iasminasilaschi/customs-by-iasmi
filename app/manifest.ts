import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Customs by Iasmi",
    short_name: "Iasmi",
    description: "Custom sneakers and graduation caps, painted by hand in Romania.",
    start_url: "/",
    display: "browser",
    background_color: "#f5f0e6",
    theme_color: "#f5f0e6",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
