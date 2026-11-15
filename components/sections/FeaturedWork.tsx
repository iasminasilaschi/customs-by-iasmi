import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { featuredPieces } from "@/data/portfolio";

export function FeaturedWork() {
  const pieces = featuredPieces.slice(0, 3);
  if (pieces.length === 0) return null;
  return (
    <section className="gutter mx-auto max-w-[90rem] py-24 md:py-32">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            eyebrow="Selected projects"
            title={
              <>
                Every piece starts with{" "}
                <span className="display-italic text-rose-2">a story.</span>
              </>
            }
            lede="A reference photo, a few words that matter, an obsession — then hours of paint."
          />
          <Link
            href="/projects"
            className="inline-flex min-h-11 items-center font-medium text-brown transition-colors hover:text-olive"
          >
            Explore my projects →
          </Link>
        </div>
      </Reveal>
      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
        {pieces.map((piece, i) => (
          <Reveal key={piece.slug} delay={i * 0.1}>
            <ProjectCard piece={piece} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
