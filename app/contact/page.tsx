import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Accordion } from "@/components/ui/Accordion";
import { ContactForm } from "@/components/forms/ContactForm";
import { getPiece } from "@/data/portfolio";
import { site } from "@/data/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Say hi, or tell me about your dream pair of hand-painted sneakers or a custom graduation cap. DM me on Instagram, write an email, or use the short form.",
  path: "/contact",
});


/** The questions people actually ask, short and honest. */
const faq = [
  {
    question: "How does it work?",
    answer:
      "You tell me the idea (here, by email or in a DM) and we chat about it: the shoes, the colours, the timing. Then I sketch the design onto the shoe, paint it by hand and seal it. Graduation caps work the same way, just planned around the big day.",
  },
  {
    question: "Can I send my own shoes?",
    answer:
      "Yes! A pair you already own is a lovely canvas, even a well-loved one. If you don't have them yet, we can figure out which shoes to get together.",
  },
  {
    question: "Are they actually wearable?",
    answer:
      "Yes. I use leather paints made for shoes, in thin flexible layers, and seal every pair with a finisher. The One Piece pair has been worn through a year of rain, long walks and driving, and still looks great. They're water-resistant, not waterproof, though: treat them like a leather jacket, not a rain boot.",
  },
  {
    question: "How do I take care of them?",
    answer:
      "Wipe them gently with a soft, damp cloth and keep them out of strong sun. No machine washing, soaking or harsh solvents, and avoid deep mud. If something ever needs a touch-up, just message me.",
  },
  {
    question: "Can it be a gift?",
    answer:
      "Absolutely, most of my pairs so far were gifts! Tell me about the person and what they love, and we can keep it a secret until the big day.",
  },
];

const channels = [
  {
    label: "Instagram",
    value: site.instagramHandle,
    href: site.instagram,
    note: "DMs open, come say hi",
  },
  {
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
    note: "for longer ideas and moodboards",
  },
];

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  // "Dream up one like this" links arrive as /contact?ref=<project slug>
  const { ref } = await searchParams;
  const refPiece = ref ? getPiece(ref) : undefined;
  const isCap = refPiece?.category === "graduation-caps";
  const initialIdea = refPiece
    ? `I saw "${refPiece.title}" in your projects and I'd love something in that direction, but made mine. `
    : "";

  return (
    <div className="gutter mx-auto max-w-[90rem] pt-36 pb-20 max-sm:[--gutter:1.25rem]">
      <SectionHeading
        as="h1"
        eyebrow="Contact"
        title={
          <>
            Tell me what refuses to{" "}
            <span className="display-italic text-rose-2">leave your brain.</span>
          </>
        }
        lede="A dream pair, a cap idea, a question, or just hi. Send me a DM, write an email, or use the little form here. No pressure, I love hearing ideas."
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Channels */}
        <div className="space-y-4">
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group block rounded-blob border border-line bg-coal p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-rose/40"
            >
              <p className="eyebrow">{c.label}</p>
              <p className="mt-2 text-lg text-cream transition-colors group-hover:text-rose-2">
                {c.value}
              </p>
              <p className="mt-1 text-sm text-muted">{c.note}</p>
            </a>
          ))}
        </div>

        {/* Form */}
        <div className="grain rounded-blob border border-line bg-coal p-6 sm:p-8">
          <h2 className="display text-2xl text-cream">Or write to me right here</h2>
          <p className="mt-2 mb-7 text-sm text-muted">
            Just a few quick questions. It lands straight in my inbox, and
            I&apos;ll write back by email or on Instagram.
          </p>
          <ContactForm
            defaultPaint={isCap ? "cap" : "sneakers"}
            initialIdea={initialIdea}
            refSlug={refPiece?.slug}
            refTitle={refPiece?.title}
          />
        </div>
      </div>

      {/* FAQ */}
      <section aria-label="Questions" className="mx-auto mt-24 max-w-3xl">
        <SectionHeading
          eyebrow="Little questions"
          title={
            <>
              Things people{" "}
              <span className="display-italic text-rose-2">often ask.</span>
            </>
          }
          lede="If yours isn't here, just ask. There are no silly questions about painted shoes."
        />
        <div className="mt-10">
          <Accordion items={faq} />
        </div>
      </section>
    </div>
  );
}
