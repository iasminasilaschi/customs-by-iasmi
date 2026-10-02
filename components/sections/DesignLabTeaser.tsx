import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SneakerPreview } from "@/components/design-lab/SneakerPreview";
import { Tag } from "@/components/ui/Tag";

export function DesignLabTeaser() {
  return (
    <section className="mx-auto max-w-[90rem] px-4 py-24 sm:px-6 md:py-32 lg:px-12 xl:px-20">
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-blob bg-deep p-8 shadow-lift sm:p-12">
            <div
              aria-hidden
              className="glow-gold pointer-events-none absolute -top-16 -right-10 h-64 w-64"
            />
            <span className="relative inline-flex items-center rounded-full border border-champagne/30 px-3 py-1 text-[0.8rem] tracking-wide text-champagne">
              design lab · now in 3D
            </span>
            <SneakerPreview
              palette={["#c3ccb4", "#8f9b82", "#d8c69a", "#7a5c45"]}
              className="relative mt-8 w-full"
              annotated
              tone="dark"
            />
            <p className="relative mt-4 text-center text-sm text-paper/70">
              a first sketch of your concept, before a single brushstroke
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="max-w-xl">
            <SectionHeading
              eyebrow="The design lab"
              title={
                <>
                  Your moodboard,{" "}
                  <span className="display-italic text-rose-2">on a shoe.</span>
                </>
              }
              lede="Spin a real 3D sneaker, paint every panel, put your photos and initials on it, and send it as a real request. The AI side of the lab is still on its way — but the 3D room is open."
            />
            <div className="mt-7 flex flex-wrap gap-2">
              <Tag tone="lilac">3D shoe — live</Tag>
              <Tag tone="lilac">per-part colours</Tag>
              <Tag tone="gold">AI concepts — later</Tag>
            </div>
            <div className="mt-9">
              <Button href="/design-lab" size="lg">
                Open the Design Lab
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
