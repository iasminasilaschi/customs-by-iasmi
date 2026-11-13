import Link from "next/link";
import { Photo } from "@/components/ui/Photo";
import { Tag } from "@/components/ui/Tag";
import { categoryLabels, requestHref, type PortfolioPiece } from "@/data/portfolio";

export function ProjectCard({
  piece,
  headingLevel = 3,
}: {
  piece: PortfolioPiece;
  /** 2 when the cards sit right under the page's h1 (the Projects page). */
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-blob border border-line bg-cream-soft shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
      <Link
        href={`/projects/${piece.slug}`}
        className="absolute inset-0 z-10"
        aria-label={`${piece.title} — view project`}
      />
      <div className="relative aspect-[4/5] overflow-hidden">
        <Photo photo={piece.cover} className="transition-transform duration-700 group-hover:scale-[1.04]" />
        {piece.video && (
          <span className="absolute right-3 top-3 rounded-full bg-deep/80 px-2.5 py-1 text-[0.78rem] uppercase tracking-widest text-paper/90 backdrop-blur-sm">
            ▶ process
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-7 lg:p-8">
        <p className="eyebrow mb-2">
          {categoryLabels[piece.category]} · {piece.year}
        </p>
        <Heading className="display text-2xl text-cream transition-colors group-hover:text-olive lg:text-[1.75rem]">
          {piece.title}
        </Heading>
        <p className="mt-2.5 line-clamp-2 text-[0.98rem] leading-relaxed text-muted">{piece.subtitle}</p>
        {piece.tags && piece.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {piece.tags.slice(0, 3).map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        )}
        <span className="relative z-20 mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-olive">
          <Link href={requestHref(piece)} className="-my-1.5 inline-block py-1.5 hover:underline">
            Request something like this
          </Link>
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </span>
      </div>
    </article>
  );
}
