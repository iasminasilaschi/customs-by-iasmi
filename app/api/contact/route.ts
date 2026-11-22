import { NextResponse } from "next/server";
import { makeContactSchema } from "@/lib/validation";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale } from "@/lib/i18n";
import { buildContactEmail } from "@/lib/contact-email";
import { getPiece } from "@/data/portfolio";

/**
 * POST /api/contact — the contact form's real delivery.
 *
 * 1. size guard + JSON parse
 * 2. rate limit (a few messages per IP per hour)
 * 3. honeypot: a hidden "website" field humans never fill. Bots that fill it
 *    get a normal-looking success and nothing is sent.
 * 4. the same zod schema the form uses, with messages in the form's language
 * 5. send through Resend (RESEND_API_KEY) to CONTACT_TO_EMAIL, reply-to = visitor
 *
 * Nothing is stored here: the message goes straight to my inbox.
 */

const MAX_BODY_CHARS = 10_000;
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const RESEND_URL = "https://api.resend.com/emails";
/** Resend's shared test sender works before a domain is verified (it only delivers to the account owner). */
const DEFAULT_FROM = "Customs by Iasmi <onboarding@resend.dev>";

/**
 * Attempts per IP, kept in memory. Simple and good enough against casual
 * spam; on Vercel each running instance keeps its own count, so treat it as
 * best-effort, not a hard guarantee.
 */
const attempts = new Map<string, number[]>();

function rateLimited(ip: string, now = Date.now()): boolean {
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  attempts.set(ip, recent);
  // keep the map small: forget IPs whose window has passed
  if (attempts.size > 5000) {
    for (const [key, times] of attempts) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) attempts.delete(key);
    }
  }
  return recent.length > RATE_LIMIT;
}

function clientIp(request: Request): string {
  // Vercel sets x-forwarded-for itself (the first entry is the visitor)
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

const json = (body: unknown, status = 200, headers?: HeadersInit) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY_CHARS) return json({ error: "too_large" }, 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: "invalid" }, 400);
  }
  if (typeof body !== "object" || body === null) return json({ error: "invalid" }, 400);

  if (rateLimited(clientIp(request))) {
    return json({ error: "rate_limited" }, 429, { "Retry-After": String(RATE_WINDOW_MS / 1000) });
  }

  const honeypot = (body as Record<string, unknown>).website;
  if (typeof honeypot === "string" && honeypot.trim() !== "") return json({ ok: true });

  const bodyLang = (body as Record<string, unknown>).lang;
  const lang = typeof bodyLang === "string" && hasLocale(bodyLang) ? bodyLang : "en";
  const parsed = makeContactSchema(getDictionary(lang).validation).safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fields[key] ??= issue.message;
    }
    return json({ error: "invalid", fields }, 400);
  }
  const values = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("contact form: RESEND_API_KEY or CONTACT_TO_EMAIL is not set");
    return json({ error: "unavailable" }, 503);
  }

  const piece = values.ref ? getPiece(values.ref) : undefined;
  const email = buildContactEmail(values, piece && { slug: piece.slug, title: piece.title });

  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM,
        to: [to],
        subject: email.subject,
        html: email.html,
        text: email.text,
        ...(values.email ? { reply_to: values.email } : {}),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      // Resend's error body says what's wrong (bad key, unverified sender…), never the message itself
      console.error("contact form: Resend refused", res.status, (await res.text()).slice(0, 500));
      return json({ error: "send_failed" }, 502);
    }
  } catch (err) {
    console.error("contact form: could not reach Resend", err instanceof Error ? err.message : err);
    return json({ error: "send_failed" }, 502);
  }

  return json({ ok: true });
}
