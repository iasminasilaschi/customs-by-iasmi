import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

/**
 * The Design Lab is a private tool: /design-lab asks for a password
 * (HTTP Basic Auth; any username works, only the password is checked).
 *
 * The password lives in the DESIGN_LAB_PASSWORD environment variable (set in
 * Vercel, never committed). If it's missing or empty, the page stays locked
 * for everyone: failing closed, never open.
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

export function proxy(request: NextRequest) {
  const expected = process.env.DESIGN_LAB_PASSWORD;
  const given = passwordFrom(request.headers.get("authorization"));

  if (expected && given !== null && samePassword(given, expected)) {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    res.headers.set("Cache-Control", "private, no-store");
    return res;
  }

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

export const config = {
  matcher: ["/design-lab", "/design-lab/:path*"],
};
