import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { featuredPieces } from "@/data/portfolio";

export function FeaturedWork() {
  const pieces = featuredPieces.slice(0, 3);
  if (pieces.length === 0) return null;
  return (
    <section className="mx-auto max-w-[90rem] px-4 py-24 sm:px-6 md:py-32 lg:px-12 xl:px-20">
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
          <Button href="/projects" variant="ghost">
            Explore my projects →
          </Button>
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
