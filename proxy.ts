import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE } from "@/lib/i18n";

/**
 * Runs before every page. Two jobs:
 *
 * 1. Languages. English lives at the plain URLs (/projects), Romanian under
 *    /ro (/ro/projects). Every page really lives in app/[lang]/, so a plain
 *    URL is quietly served from /en/… (a rewrite: the address bar doesn't
 *    change). /en/… itself redirects to the plain URL, so each page has one
 *    English address. Someone who picked Romanian (the `lang` cookie, set by
 *    the language card or the EN | RO switch) is sent from a plain URL to the
 *    /ro one. Search engines carry no cookie, so they see both as they are.
 *
 * 2. The Design Lab is a private tool: /design-lab asks for a password
 *    (HTTP Basic Auth; any username works, only the password is checked).
 *    The password lives in the DESIGN_LAB_PASSWORD environment variable (set
 *    in Vercel, never committed). If it's missing or empty, the page stays
 *    locked for everyone: failing closed, never open. English only.
 *
 * Proxy runs on the Node.js runtime in Next 16, so node:crypto is available.
 */

const REALM = 'Basic realm="Design Lab", charset="UTF-8"';

/** Compares through fixed-length hashes, so neither content nor length leaks through timing. */
function samePassword(given: string, expected: string): boolean {
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

function passwordFrom(header: string | null): string | null {
  if (!header?.startsWith("Basic ")) return null;
  try {
    const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
    const colon = decoded.indexOf(":");
    return colon === -1 ? null : decoded.slice(colon + 1);
  } catch {
    return null;
  }
}

function locked() {
  return new NextResponse("This room is private.", {
    status: 401,
    headers: {
      "WWW-Authenticate": REALM,
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "no-store",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

function privateHeaders(res: NextResponse) {
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}

const LAB = /^\/design-lab(?:\/|$)/;
const LOCALIZED_LAB = /^\/(?:en|ro)(\/design-lab(?:\/.*)?)$/;
const HAS_EXTENSION = /\.[a-z0-9]+$/i;

export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const { pathname } = url;

  // ---- the Design Lab (pages and its photos): password first ----
  const localizedLab = pathname.match(LOCALIZED_LAB);
  if (LAB.test(pathname) || localizedLab) {
    const expected = process.env.DESIGN_LAB_PASSWORD;
    const given = passwordFrom(request.headers.get("authorization"));
    if (!(expected && given !== null && samePassword(given, expected))) return locked();
    if (localizedLab) {
      url.pathname = localizedLab[1]; // English only: /ro/design-lab → /design-lab
      return privateHeaders(NextResponse.redirect(url));
    }
    if (HAS_EXTENSION.test(pathname)) return privateHeaders(NextResponse.next()); // a file in public/design-lab
    url.pathname = `/en${pathname}`;
    return privateHeaders(NextResponse.rewrite(url));
  }

  // ---- /en/… → the plain English URL ----
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  // ---- /ro/… is already Romanian ----
  if (pathname === "/ro" || pathname.startsWith("/ro/")) return NextResponse.next();

  // ---- plain URL: Romanian if they chose it, otherwise English ----
  if (request.cookies.get(LOCALE_COOKIE)?.value === "ro") {
    url.pathname = pathname === "/" ? "/ro" : `/ro${pathname}`;
    return NextResponse.redirect(url, 307);
  }
  url.pathname = pathname === "/" ? "/en" : `/en${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    // the Design Lab, files included (its photos are private too)
    "/design-lab/:path*",
    // every page: not Next's own files, analytics, the API, or files like /robots.txt and /icon.png
    "/((?!_next/|_vercel/|api/|.*\\.[A-Za-z0-9]+$).*)",
  ],
};
