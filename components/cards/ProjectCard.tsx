import Link from "next/link";
import { ArtPlaceholder } from "@/components/mosaic/ArtPlaceholder";
import { Tag } from "@/components/ui/Tag";
import { categoryLabels, type PortfolioPiece } from "@/data/portfolio";

export function ProjectCard({ piece }: { piece: PortfolioPiece }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-blob border border-line bg-cream-soft shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
      <Link
        href={`/projects/${piece.slug}`}
        className="absolute inset-0 z-10"
        aria-label={`${piece.title} — view project`}
      />
      <div className="relative aspect-[4/5] overflow-hidden">
        <ArtPlaceholder
          colors={piece.colors}
          label={piece.images[0]}
          className="h-full w-full transition-transform duration-700 group-hover:scale-[1.04]"
        />
        {piece.hasVideo && (
          <span className="absolute right-3 top-3 rounded-full bg-deep/55 px-2.5 py-1 text-[0.78rem] uppercase tracking-widest text-paper/90 backdrop-blur-sm">
            ▶ process
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-7 lg:p-8">
        <p className="eyebrow mb-2">
          {categoryLabels[piece.category]} · {piece.year}
        </p>
        <h3 className="display text-2xl text-cream transition-colors group-hover:text-olive lg:text-[1.75rem]">
          {piece.title}
        </h3>
        <p className="mt-2.5 line-clamp-2 text-[0.98rem] leading-relaxed text-muted">{piece.subtitle}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {piece.tags.slice(0, 3).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
        <span className="relative z-20 mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-olive">
          <Link href={`/design-lab?ref=${piece.slug}`} className="hover:underline">
            Request something like this
          </Link>
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </span>
      </div>
    </article>
  );
}
