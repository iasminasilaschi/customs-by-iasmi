import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { EditorialCard } from "@/components/ui/EditorialCard";
import { Photo } from "@/components/ui/Photo";
import { beyondPhotos, type PhotoData } from "@/data/media";
import { Tag } from "@/components/ui/Tag";

/**
 * Graduation caps — the second canvas. Quieter than the sneaker sections.
 */
export function BeyondSneakers() {
  return (
    <section className="mx-auto max-w-[90rem] px-4 py-24 sm:px-6 md:py-32 lg:px-12 xl:px-20">
      <Reveal>
        <SectionHeading
          eyebrow="Beyond sneakers"
          title={
            <>
              A second canvas:{" "}
              <span className="display-italic text-rose-2">graduation caps.</span>
            </>
          }
          lede="Sneakers are the main canvas, but a cap is a small square one for a very big day."
        />
      </Reveal>

      <div className="mt-14 grid max-w-2xl gap-8 lg:mt-16">
        <Reveal delay={0.05}>
          <EditorialCard
            href="/contact?type=cap"
            eyebrow={<Tag tone="lilac">emerging · seasonal</Tag>}
            title="Custom graduation caps"
            description="A small square canvas for a very big day. Hand-painted caps for graduates, friends and gifts — personal, photogenic, made to be kept."
            cta="Ask about a cap"
            media={beyondPhotos.caps && <BeyondImage photo={beyondPhotos.caps} />}
          />
        </Reveal>

      </div>
    </section>
  );
}

function BeyondImage({ photo }: { photo: PhotoData }) {
  return (
    <div className="relative aspect-[16/10]">
      <Photo photo={photo} sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw" />
    </div>
  );
}
