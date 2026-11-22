import { instagramHandle, paintLabel, type ContactValues } from "@/lib/validation";
import { SITE_URL } from "@/lib/metadata";
import { localePath } from "@/lib/i18n";

/**
 * The email I get when someone sends the contact form: a short subject, a
 * tidy HTML body and a plain-text twin. Everything the visitor typed is
 * escaped; links are only built from values the schema already checked.
 */

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** Subjects are one line: no newlines, no runaway length. */
const oneLine = (s: string, max = 60) => {
  const flat = s.replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat;
};

const withProtocol = (link: string) => (/^https?:\/\//i.test(link) ? link : `https://${link}`);

export interface ContactEmail {
  subject: string;
  html: string;
  text: string;
}

export function buildContactEmail(v: ContactValues, refPiece?: { slug: string; title: string }): ContactEmail {
  const handle = v.instagram ? instagramHandle(v.instagram) : "";
  const igUrl = handle ? `https://instagram.com/${handle}` : "";
  const inspo = v.inspo ? withProtocol(v.inspo) : "";
  const lang = v.lang ?? "en";
  const refUrl = refPiece ? `${SITE_URL}${localePath(lang, `/projects/${refPiece.slug}`)}` : "";
  const what = paintLabel(v.paint);
  // they wrote from the Romanian site: worth replying in Romanian
  const language = lang === "ro" ? "Romanian (they used the Romanian site)" : "";

  const subject = `New hello from ${oneLine(v.name, 40)} · ${what}${lang === "ro" ? " · RO" : ""}`;

  const replyHint = v.email
    ? `Just hit reply to answer ${v.name} by email.`
    : `No email this time: reply on Instagram, @${handle}.`;

  // ---- plain text ----
  const textLines = [
    `Someone said hi on iasmi.ro!`,
    ``,
    `Name: ${v.name}`,
    v.email ? `Email: ${v.email}` : null,
    handle ? `Instagram: @${handle} (${igUrl})` : null,
    `Would love painted: ${what}`,
    language ? `Language: ${language}` : null,
    refPiece ? `Came from the project: ${refPiece.title} (${refUrl})` : null,
    inspo ? `Inspo link: ${inspo}` : null,
    ``,
    `Their idea:`,
    v.idea,
    ``,
    `—`,
    replyHint,
  ].filter((l) => l !== null);
  const text = textLines.join("\n");

  // ---- HTML ----
  const row = (label: string, value: string) => `
        <tr>
          <td style="padding:6px 16px 6px 0;color:#7a6a58;font-size:13px;text-transform:uppercase;letter-spacing:0.08em;vertical-align:top;white-space:nowrap">${label}</td>
          <td style="padding:6px 0;color:#2f3a2f;font-size:16px">${value}</td>
        </tr>`;
  const link = (href: string, label: string) =>
    `<a href="${esc(href)}" style="color:#5d6b4f;text-decoration:underline">${esc(label)}</a>`;

  const rows = [
    row("Name", esc(v.name)),
    v.email ? row("Email", link(`mailto:${v.email}`, v.email)) : "",
    handle ? row("Instagram", link(igUrl, `@${handle}`)) : "",
    row("Would love", esc(what)),
    language ? row("Language", esc(language)) : "",
    refPiece ? row("Came from", link(refUrl, refPiece.title)) : "",
    inspo ? row("Inspo", link(inspo, v.inspo ?? inspo)) : "",
  ].join("");

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f4efe4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
    <div style="max-width:560px;margin:0 auto;background:#fffaf1;border:1px solid #e3d9c6;border-radius:20px;padding:28px">
      <p style="margin:0;color:#a0705a;font-size:15px;font-style:italic">someone said hi on iasmi.ro ✿</p>
      <h1 style="margin:8px 0 20px;color:#2f3a2f;font-size:24px;font-weight:600">${esc(v.name)} would love: ${esc(what.toLowerCase())}</h1>
      <table role="presentation" style="border-collapse:collapse">${rows}
      </table>
      <h2 style="margin:24px 0 8px;color:#2f3a2f;font-size:17px;font-weight:600">Their idea</h2>
      <div style="white-space:pre-wrap;color:#2f3a2f;font-size:16px;line-height:1.55;background:#f4efe4;border-radius:14px;padding:14px 16px">${esc(v.idea)}</div>
      <p style="margin:24px 0 0;color:#7a6a58;font-size:14px">${esc(replyHint)}</p>
    </div>
  </body>
</html>`;

  return { subject, html, text };
}
