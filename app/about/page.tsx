import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { Tag } from "@/components/ui/Tag";
import { lifeMosaic } from "@/data/mosaic";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "The person behind Customs by Iasmi, and how I paint custom sneakers and graduation caps by hand, in four steps.",
  path: "/about",
});

const sizeClasses = {
  sm: "col-span-1 row-span-1 aspect-square",
  md: "col-span-1 row-span-1 aspect-[3/4] sm:col-span-1",
  lg: "col-span-2 row-span-1 aspect-[16/10]",
} as const;

/** The real routine behind every pair (see the process steps in data/portfolio.ts). */
const steps = [
  {
    n: "01",
    title: "Prep the leather",
    text: "I take the factory finish off with acetone and sand the surface lightly, so the paint really grips.",
  },
  {
    n: "02",
    title: "Sketch it on",
    text: "The design goes straight onto the shoe in pencil or crayon, and I nudge it until it sits just right.",
  },
  {
    n: "03",
    title: "Paint in thin layers",
    text: "Leather paints, many very thin coats, drying in between. Details and fine lines come last.",
  },
  {
    n: "04",
    title: "Seal it for real life",
    text: "A finisher on top, so it survives rain, long walks and daily wear. One pair has been worn hard for a year and still looks fresh.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[90rem] px-5 pt-36 pb-20 sm:px-6 lg:px-12 xl:px-20">
      {/* Intro */}
      <div className="max-w-2xl">
        <p className="eyebrow mb-4">hi, I&apos;m Iasmi</p>
        <h1 className="display text-[clamp(2.75rem,1.65rem+3.6vw,4.5rem)]">
          I collect obsessions and{" "}
          <span className="display-italic text-rose-2">paint them on things.</span>
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted">
          This is where I collect the things I make, try, paint, design,
          obsess over — and slowly turn into a studio. Right now the main
          canvas is sneakers. The second canvas is graduation caps,
          and I never run out of ideas for what to paint next.
        </p>
        <p className="hand mt-5 rotate-[-1deg] text-2xl text-lilac">
          this whole site is one big moodboard, honestly
        </p>
      </div>

      {/* Life mosaic — only when real photos exist */}
      {lifeMosaic.length > 0 && (
        <Reveal>
          <section aria-label="Things I love" className="mt-16">
            <SectionHeading eyebrow="The mosaic" title="Things I love, in tiles." />
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {lifeMosaic.map((tile, i) => (
                <div key={tile.id} className={cn("relative", sizeClasses[tile.size])}>
                  <div
                    className={cn(
                      "relative h-full w-full overflow-hidden rounded-2xl border border-line",
                      i % 3 === 1 && "rotate-[0.6deg]",
                      i % 4 === 2 && "-rotate-[0.6deg]",
                    )}
                  >
                    <Photo photo={tile.photo} sizes="(min-width: 640px) 25vw, 50vw" />
                  </div>
                  {tile.note && (
                    <span className="hand absolute -top-2 right-2 rotate-[3deg] rounded-lg bg-champagne px-2 py-0.5 text-sm text-deep shadow-soft">
                      {tile.note}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {/* How I paint */}
      <section aria-label="How I paint" className="mt-20">
        <Reveal>
          <SectionHeading
            eyebrow="How I paint"
            title={
              <>
                Four steps,{" "}
                <span className="display-italic text-rose-2">lots of patience.</span>
              </>
            }
            lede="Every pair goes through the same slow routine, from bare leather to the last coat of sealer."
          />
        </Reveal>
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.n}>
              <Reveal delay={i * 0.08} className="h-full">
                <div className="glass grain h-full rounded-blob p-7">
                  <span className="display-italic text-4xl text-rose">{s.n}</span>
                  <h3 className="display mt-3 text-xl text-cream">{s.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-muted">{s.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal>
          <div className="mt-10 max-w-2xl">
            <p className="hand rotate-[-1deg] text-2xl text-lilac">painted by hand, not factory perfect</p>
            <p className="mt-3 text-base leading-relaxed text-muted">
              Tiny brush textures, slight asymmetries, layered depth: that&apos;s
              not a flaw, that&apos;s the point. A printed shoe is a copy; a
              painted shoe is an original.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Tag tone="rose">hand-painted</Tag>
              <Tag tone="lilac">sealed & wearable</Tag>
              <Tag tone="gold">authentic base shoes only</Tag>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              Base shoes are always authentic, bought new or supplied by you.
              The customization is my own, independent work and isn&apos;t
              affiliated with or endorsed by the shoe brands.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Socials */}
      <div className="mt-16 text-center">
        <p className="hand text-2xl text-lilac">come say hi where I actually live:</p>
        <div className="mt-5 flex flex-wrap justify-center gap-4">
          <Button href={site.instagram} variant="outline">Instagram</Button>
          <Button href="/contact">Say hi</Button>
        </div>
      </div>
    </div>
  );
}
