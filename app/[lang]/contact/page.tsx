import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Accordion } from "@/components/ui/Accordion";
import { ContactForm } from "@/components/forms/ContactForm";
import { getPieceFor } from "@/data/localized";
import { site } from "@/data/site";
import { getDictionary } from "@/lib/dictionaries";
import { fmt } from "@/lib/i18n-format";
import { hasLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang).contact;
  return pageMetadata({ locale: lang, title: t.metaTitle, description: t.metaDescription, path: "/contact" });
}

export default async function ContactPage({ params, searchParams }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = getDictionary(lang);
  const t = d.contact;
  // "Dream up one like this" links arrive as /contact?ref=<project slug>
  const { ref } = await searchParams;
  const refPiece = typeof ref === "string" ? getPieceFor(ref, lang) : undefined;
  const isCap = refPiece?.category === "graduation-caps";
  const initialIdea = refPiece ? fmt(t.refIdea, { title: refPiece.title }) : "";

  const channels = [
    { label: "Instagram", value: site.instagramHandle, href: site.instagram, note: t.instagramNote },
    { label: t.emailLabel, value: site.email, href: `mailto:${site.email}`, note: t.emailNote },
  ];

  return (
    <div className="gutter mx-auto max-w-[90rem] pt-36 pb-20 max-sm:[--gutter:1.25rem]">
      <SectionHeading
        as="h1"
        eyebrow={t.eyebrow}
        title={
          <>
            {t.titleA}{" "}
            <span className="display-italic text-rose-2">{t.titleEm}</span>
          </>
        }
        lede={t.lede}
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
          <h2 className="display text-2xl text-cream">{t.formTitle}</h2>
          <p className="mt-2 mb-7 text-sm text-muted">{t.formIntro}</p>
          <ContactForm
            locale={lang}
            t={d.form}
            messages={d.validation}
            defaultPaint={isCap ? "cap" : "sneakers"}
            initialIdea={initialIdea}
            refSlug={refPiece?.slug}
            refTitle={refPiece?.title}
          />
        </div>
      </div>

      {/* FAQ */}
      <section aria-label={t.faqLabel} className="mx-auto mt-24 max-w-3xl">
        <SectionHeading
          eyebrow={t.faqEyebrow}
          title={
            <>
              {t.faqTitleA}{" "}
              <span className="display-italic text-rose-2">{t.faqTitleEm}</span>
            </>
          }
          lede={t.faqLede}
        />
        <div className="mt-10">
          <Accordion items={t.faq} />
        </div>
      </section>
    </div>
  );
}
