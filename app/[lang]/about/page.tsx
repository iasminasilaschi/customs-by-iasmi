import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { Tag } from "@/components/ui/Tag";
import { lifeMosaic } from "@/data/mosaic";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale, localePath } from "@/lib/i18n";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang).about;
  return pageMetadata({ locale: lang, title: t.metaTitle, description: t.metaDescription, path: "/about" });
}

const sizeClasses = {
  sm: "col-span-1 row-span-1 aspect-square",
  md: "col-span-1 row-span-1 aspect-[3/4] sm:col-span-1",
  lg: "col-span-2 row-span-1 aspect-[16/10]",
} as const;

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang).about;
  return (
    <div className="gutter mx-auto max-w-[90rem] pt-36 pb-20 max-sm:[--gutter:1.25rem]">
      {/* Intro */}
      <div className="max-w-2xl">
        <p className="eyebrow mb-4">{t.eyebrow}</p>
        <h1 className="display text-[clamp(2.75rem,1.65rem+3.6vw,4.5rem)]">
          {t.titleA}{" "}
          <span className="display-italic text-rose-2">{t.titleEm}</span>
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted">{t.intro}</p>
        <p className="hand mt-5 rotate-[-1deg] text-2xl text-lilac">{t.moodboard}</p>
      </div>

      {/* Life mosaic — only when real photos exist */}
      {lifeMosaic.length > 0 && (
        <Reveal>
          <section aria-label={t.mosaicLabel} className="mt-16">
            <SectionHeading eyebrow={t.mosaicEyebrow} title={t.mosaicTitle} />
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {lifeMosaic.map((tile, i) => (
                <div key={tile.id} className={cn("relative", sizeClasses[tile.size])}>
                  <div
                    className={cn(
                      "relative h-full w-full overflow-hidden rounded-2xl border border-line",
                      i % 3 === 1 && "rotate-[0.6deg]",
                      i % 4 === 2 && "-rotate-[0.6deg]",
                    )}
                  >
                    <Photo photo={tile.photo} sizes="(min-width: 640px) 25vw, 50vw" />
                  </div>
                  {tile.note && (
                    <span className="hand absolute -top-2 right-2 rotate-[3deg] rounded-lg bg-champagne px-2 py-0.5 text-sm text-deep shadow-soft">
                      {tile.note}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {/* How I paint */}
      <section aria-label={t.howLabel} className="mt-20">
        <Reveal>
          <SectionHeading
            eyebrow={t.howEyebrow}
            title={
              <>
                {t.howTitleA}{" "}
                <span className="display-italic text-rose-2">{t.howTitleEm}</span>
              </>
            }
            lede={t.howLede}
          />
        </Reveal>
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.steps.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={i * 0.08} className="h-full">
                <div className="glass grain h-full rounded-blob p-7">
                  <span className="display-italic text-4xl text-rose">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="display mt-3 text-xl text-cream">{s.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-muted">{s.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal>
          <div className="mt-10 max-w-2xl">
            <p className="hand rotate-[-1deg] text-2xl text-lilac">{t.handmade}</p>
            <p className="mt-3 text-base leading-relaxed text-muted">{t.handmadeText}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Tag tone="rose">{t.tags[0]}</Tag>
              <Tag tone="lilac">{t.tags[1]}</Tag>
              <Tag tone="gold">{t.tags[2]}</Tag>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted">{t.authentic}</p>
          </div>
        </Reveal>
      </section>

      {/* Socials */}
      <div className="mt-16 text-center">
        <p className="hand text-2xl text-lilac">{t.socials}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-4">
          <Button href={site.instagram} variant="outline">{t.instagram}</Button>
          <Button href={localePath(lang, "/contact")}>{t.sayHi}</Button>
        </div>
      </div>
    </div>
  );
}
