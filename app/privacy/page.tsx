import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/data/site";

export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  description:
    "What this site keeps about you (almost nothing), how contact form messages reach me, how long I keep them, and your rights under the GDPR.",
  path: "/privacy",
});

const LAST_UPDATED = "15 November 2026";

const h2 = "display mt-14 text-[1.75rem] leading-tight text-cream";
const p = "mt-4 text-base leading-relaxed text-cream/85";
const a = "text-olive underline underline-offset-2 hover:text-deep";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-36 pb-20 sm:px-6">
      <p className="eyebrow mb-4">Privacy</p>
      <h1 className="display text-[clamp(2.5rem,1.4rem+3.2vw,3.75rem)]">
        The short, honest{" "}
        <span className="display-italic text-rose-2">version.</span>
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-muted">
        This is a small, one-person site. I don&apos;t want your data, I want
        to paint your shoes. Here&apos;s exactly what happens when you visit.
      </p>

      <h2 className={h2}>Who runs this site</h2>
      <p className={p}>
        Me, Iasmina Silaschi, in Romania. If anything on this page worries you,
        or you want to use one of your rights below, write to me at{" "}
        <a href={`mailto:${site.email}`} className={`${a} [overflow-wrap:anywhere]`}>
          {site.email}
        </a>
        .
      </p>

      <h2 className={h2}>No accounts, no database</h2>
      <p className={p}>
        There are no accounts and no logins here, and there is no database:
        the site doesn&apos;t keep what you type. No advertising or tracking
        cookies either. The fonts are served from this site, so your browser
        doesn&apos;t contact Google to load them.
      </p>
      <p className={p}>
        Like any website, the site is delivered by a hosting company (Vercel),
        which briefly handles technical details such as your IP address so it
        can send you the pages and keep the site safe.
      </p>

      <h2 className={h2}>The contact form</h2>
      <p className={p}>
        While you type, your answers are saved as a draft in your own browser
        (localStorage), so you can come back and finish later. That draft
        never leaves your device on its own. It&apos;s deleted when you send
        the form, after 30 days without changes, or whenever you press
        &ldquo;clear draft&rdquo;.
      </p>
      <p className={p}>
        When you press send, your message travels from your browser to this
        site&apos;s server (run by Vercel), which hands it to Resend, an email
        delivery service, and Resend delivers it to my email inbox. What&apos;s
        sent: your name, your email and/or Instagram handle, what you&apos;d
        love painted, your idea, the inspiration link if you added one, and the
        project you came from if you used a &ldquo;dream up one like
        this&rdquo; link. Nothing is saved on the site itself. Resend keeps a
        delivery log of sent emails for a limited time, as email services do.
      </p>
      <p className={p}>
        Why: so I can read your idea and write back to you. That&apos;s the
        only thing I use it for. To keep spam out, the server briefly
        remembers how many messages came from an IP address in the last hour;
        that count lives only in memory and is never stored or linked to your
        message.
      </p>

      <h2 className={h2}>Visitor counts (Vercel Web Analytics)</h2>
      <p className={p}>
        I use Vercel Web Analytics to see how many people visit and which pages
        they like. It uses no cookies and doesn&apos;t build a profile of you.
        It looks at things like the page, the site you came from, your browser,
        device type and country, and I only ever see totals, never a person.
      </p>

      <h2 className={h2}>When you write to me</h2>
      <p className={p}>
        Whether you use the form, email me or send a DM, I get what you choose
        to send: your name, how to reach you, your idea and any photos or
        links. I use it only to reply and, if we make something together, to
        plan and paint it. I never sell it or share it, except what&apos;s
        truly needed to make your piece happen (for example, a courier needs
        an address).
      </p>
      <p className={p}>
        How long I keep it: until our conversation is done (and, if I painted
        something for you, a while after, in case it ever needs a touch-up).
        Ask me any time and I&apos;ll delete it sooner. Instagram, TikTok,
        Resend and your email provider are their own services, with their own
        privacy rules.
      </p>

      <h2 className={h2}>Your rights</h2>
      <p className={p}>
        Under the GDPR you can ask me what I have about you, get a copy,
        correct it, have it deleted, limit or object to how I use it, and take
        it elsewhere. Just email me, no special form needed. I&apos;ll answer
        within a month, usually much sooner.
      </p>
      <p className={p}>
        If you think I&apos;ve handled your data badly, you can also complain to
        the Romanian data protection authority, ANSPDCP (
        <a href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer" className={a}>
          dataprotection.ro
        </a>
        ). I&apos;d love the chance to fix it first, though.
      </p>

      <p className="mt-14 border-t border-line pt-6 text-sm text-muted">
        Last updated: {LAST_UPDATED}. If anything here changes, this page
        changes first.
      </p>
      <p className="mt-6">
        <Link href="/contact" className={a}>
          ← Back to contact
        </Link>
      </p>
    </div>
  );
}
