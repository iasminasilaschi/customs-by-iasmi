import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectsGrid } from "@/components/projects/ProjectsGrid";
import { portfolioFor } from "@/data/localized";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/projects">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang).projects;
  return pageMetadata({ locale: lang, title: t.metaTitle, description: t.metaDescription, path: "/projects" });
}

export default async function ArchivePage({ params }: PageProps<"/[lang]/projects">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return null;
  const d = getDictionary(lang);
  const t = d.projects;
  return (
    <div className="gutter mx-auto max-w-[90rem] pt-36 pb-20 max-sm:[--gutter:1.25rem]">
      <SectionHeading
        as="h1"
        wide
        eyebrow={t.eyebrow}
        title={
          <>
            {t.titleA}{" "}
            <span className="display-italic text-rose-2">{t.titleEm}</span>
          </>
        }
        lede={t.lede}
      />
      <div className="mt-16 lg:mt-20">
        <ProjectsGrid
          pieces={portfolioFor(lang)}
          locale={lang}
          t={{ projects: d.projects, card: d.card, categories: d.categories }}
        />
      </div>
    </div>
  );
}
