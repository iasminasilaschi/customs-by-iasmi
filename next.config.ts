import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Content Security Policy, fitted to what the site really loads:
 * - scripts: our own bundles + Next's inline bootstrap scripts ('unsafe-inline';
 *   nonces would force every static page to render per request).
 *   'wasm-unsafe-eval' lets the 3D sneaker's meshopt decoder (bundled WebAssembly) run.
 *   Vercel Analytics is same-origin (/_vercel/insights) in production; only the
 *   dev build pulls its debug script from va.vercel-scripts.com.
 * - styles: our CSS + inline style attributes (framer-motion, palette washes).
 * - images: our own files, plus blob:/data: for the 3D model's textures and the
 *   photos/lettering people place on the shoe in the Design Lab.
 * - fonts: self-hosted by next/font, so 'self' only.
 * - connect: analytics beacons, the GLB model, blob:/data: texture reads, and
 *   the contact form's POST to /api/contact. All same-origin, so 'self' covers
 *   them; Resend is called from the server, never from the browser, so it
 *   needs no entry here.
 *
 * CSP_ENFORCE: false sends it as Content-Security-Policy-Report-Only (violations
 * show in the browser console, nothing is blocked). Flip to true once the live
 * site has been checked with the console open.
 */
const CSP_ENFORCE = false;

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'${isDev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  `connect-src 'self' blob: data:${isDev ? " ws: https://va.vercel-scripts.com" : ""}`,
  "media-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  {
    key: CSP_ENFORCE ? "Content-Security-Policy" : "Content-Security-Policy-Report-Only",
    value: csp,
  },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  // retired pages: their content now lives on /about and /contact
  async redirects() {
    return [
      { source: "/process", destination: "/about", permanent: true },
      { source: "/faq", destination: "/contact", permanent: true },
    ];
  },
};

export default nextConfig;
