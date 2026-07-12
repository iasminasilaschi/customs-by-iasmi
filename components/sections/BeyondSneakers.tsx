import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { EditorialCard } from "@/components/ui/EditorialCard";
import { ArtPlaceholder } from "@/components/mosaic/ArtPlaceholder";
import { Tag } from "@/components/ui/Tag";

/**
 * Secondary creative branches: graduation caps (emerging), nail art &
 * press-ons (just beginning) and small digital experiments (future).
 * Deliberately quieter than the sneaker sections — sneakers stay dominant.
 */
export function BeyondSneakers() {
  return (
    <section className="mx-auto max-w-[90rem] px-4 py-24 sm:px-6 md:py-32 lg:px-12 xl:px-20">
      <Reveal>
        <SectionHeading
          eyebrow="Beyond sneakers"
          title={
            <>
              Other little worlds{" "}
              <span className="display-italic text-rose-2">I&apos;m building.</span>
            </>
          }
          lede="Sneakers are the main canvas. These grow quietly beside them, in their own time."
        />
      </Reveal>

      <div className="mt-14 grid gap-8 md:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-10">
        <Reveal delay={0.05}>
          <EditorialCard
            href="/contact?type=cap"
            eyebrow={<Tag tone="lilac">emerging · seasonal</Tag>}
            title="Custom graduation caps"
            description="A small square canvas for a very big day. Hand-painted caps for graduates, friends and gifts — personal, photogenic, made to be kept."
            cta="Ask about a cap"
            media={
              <ArtPlaceholder
                colors={["#8f9b82", "#d8c69a", "#7a5c45", "#c3ccb4"]}
                label="Graduation caps — first two in progress"
                showLabel={false}
                className="aspect-[16/10]"
              />
            }
          />
        </Reveal>

        <Reveal delay={0.12}>
          <EditorialCard
            href="/contact?type=nails"
            eyebrow={<Tag tone="lilac">just beginning</Tag>}
            title="Nail art & press-ons"
            description="Custom nail art and press-ons — another tiny canvas I'm beginning to explore. The same detail as a sneaker, shrunk to a fingernail."
            cta="Ask about a set"
            media={
              <ArtPlaceholder
                colors={["#f5f0e6", "#8f9b82", "#a56a44", "#d8c69a"]}
                label="Hand-painted press-on sets"
                showLabel={false}
                className="aspect-[16/10]"
              />
            }
          />
        </Reveal>

        <Reveal delay={0.19}>
          <EditorialCard
            href="/contact?type=web"
            eyebrow={<Tag tone="gold">future · collaborations</Tag>}
            title="Websites & tiny experiments"
            description="Sometimes the canvas is a webpage. Small presentation sites and gentle digital experiments, built slowly with care — this site is the first."
            cta="Start a conversation"
            media={
              <ArtPlaceholder
                colors={["#5f6f52", "#a4863f", "#c3ccb4", "#7a5c45"]}
                label="Small websites & digital experiments"
                showLabel={false}
                className="aspect-[16/10]"
              />
            }
          />
        </Reveal>
      </div>
    </section>
  );
}
