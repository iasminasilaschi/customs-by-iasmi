import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { featuredFor } from "@/data/localized";
import { localePath } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n-server";

export async function FeaturedWork() {
  const { locale, t } = await getI18n();
  const pieces = featuredFor(locale).slice(0, 3);
  if (pieces.length === 0) return null;
  return (
    <section className="gutter mx-auto max-w-[90rem] py-24 md:py-32">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            eyebrow={t.featured.eyebrow}
            title={
              <>
                {t.featured.titleA}{" "}
                <span className="display-italic text-rose-2">{t.featured.titleEm}</span>
              </>
            }
            lede={t.featured.lede}
          />
          <Link
            href={localePath(locale, "/projects")}
            className="inline-flex min-h-11 items-center font-medium text-brown transition-colors hover:text-olive"
          >
            {t.featured.explore}
          </Link>
        </div>
      </Reveal>
      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
        {pieces.map((piece, i) => (
          <Reveal key={piece.slug} delay={i * 0.1}>
            <ProjectCard piece={piece} locale={locale} t={t.card} categories={t.categories} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
