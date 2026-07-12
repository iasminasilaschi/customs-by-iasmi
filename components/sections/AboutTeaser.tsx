import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { MosaicTile } from "@/components/ui/MosaicTile";
import { lifeMosaic } from "@/data/mosaic";

export function AboutTeaser() {
  const tiles = lifeMosaic.slice(0, 4);
  return (
    <section className="mx-auto max-w-[90rem] px-4 py-24 sm:px-6 md:py-32 lg:px-12 xl:px-20">
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div className="grid grid-cols-2 gap-4">
            {tiles.map((t, i) => (
              <MosaicTile
                key={t.id}
                colors={t.colors}
                label={t.label}
                className={i % 2 === 1 ? "aspect-[3/4] translate-y-6" : "aspect-[3/4]"}
              />
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="max-w-xl">
            <SectionHeading
              eyebrow="The person behind the paint"
              title={
                <>
                  A studio grown from{" "}
                  <span className="display-italic text-rose-2">a life of obsessions.</span>
                </>
              }
              lede="Painting, sneakers, caps, nail art and press-ons, tiny digital experiments, style, travel, gaming, food, a soft spot for Japan — a mosaic of the things I love, slowly turning into a studio."
            />
            <Link
              href="/about"
              className="group mt-8 inline-flex items-center gap-2 font-medium text-olive"
            >
              Meet me properly
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
