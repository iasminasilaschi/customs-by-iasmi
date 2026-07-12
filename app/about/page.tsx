import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ArtPlaceholder } from "@/components/mosaic/ArtPlaceholder";
import { VideoPlaceholder } from "@/components/mosaic/VideoPlaceholder";
import { Tag } from "@/components/ui/Tag";
import { lifeMosaic } from "@/data/mosaic";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description:
    "The person behind Customs by Iasmi — a mosaic of sneakers, paint, nail art, travel, tiny websites, and everything in between.",
};

const chapters = [
  { year: "first", label: "One ruined pair of white sneakers, painted out of stubbornness." },
  { year: "then", label: "Friends started asking. Sketchbooks filled up. It got serious." },
  { year: "now", label: "The studio opens: commissions, process videos, two graduation caps due in September." },
  { year: "next", label: "Design Lab, more canvases, and slowly — a real studio." },
];

const sizeClasses = {
  sm: "col-span-1 row-span-1 aspect-square",
  md: "col-span-1 row-span-1 aspect-[3/4] sm:col-span-1",
  lg: "col-span-2 row-span-1 aspect-[16/10]",
} as const;

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
          canvas is sneakers. Soon it may be graduation caps, nail art,
          tiny websites, or whatever idea refuses to leave my brain.
        </p>
        <p className="hand mt-5 rotate-[-1deg] text-2xl text-lilac">
          this whole site is one big moodboard, honestly
        </p>
      </div>

      {/* Life mosaic */}
      <Reveal>
        <section aria-label="Things I love" className="mt-16">
          <SectionHeading eyebrow="The mosaic" title="Things I love, in tiles." />
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {lifeMosaic.map((tile, i) =>
              tile.kind === "video" ? (
                <VideoPlaceholder
                  key={tile.id}
                  colors={tile.colors}
                  label={tile.label}
                  className={cn(sizeClasses[tile.size])}
                />
              ) : (
                <div key={tile.id} className={cn("relative", sizeClasses[tile.size])}>
                  <ArtPlaceholder
                    colors={tile.colors}
                    label={tile.label}
                    className={cn(
                      "h-full w-full rounded-2xl border border-line",
                      i % 3 === 1 && "rotate-[0.6deg]",
                      i % 4 === 2 && "-rotate-[0.6deg]",
                    )}
                  />
                  {tile.note && (
                    <span className="hand absolute -top-2 right-2 rotate-[3deg] rounded-lg bg-champagne px-2 py-0.5 text-sm text-deep shadow-soft">
                      {tile.note}
                    </span>
                  )}
                </div>
              ),
            )}
          </div>
          <p className="mt-4 text-sm text-muted">
            (placeholder tiles — real photos and clips take their places as the
            mosaic grows)
          </p>
        </section>
      </Reveal>

      {/* Timeline */}
      <Reveal>
        <section className="mt-20 max-w-2xl">
          <SectionHeading eyebrow="How it started" title="A short timeline." />
          <ol className="mt-8 space-y-0 border-l border-line pl-6">
            {chapters.map((c) => (
              <li key={c.year} className="relative pb-8 last:pb-0">
                <span aria-hidden className="absolute -left-[1.85rem] top-1 h-3 w-3 rounded-full border-2 border-ink bg-rose" />
                <p className="display-italic text-lg text-rose-2">{c.year}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{c.label}</p>
              </li>
            ))}
          </ol>
        </section>
      </Reveal>

      {/* Future studio */}
      <Reveal>
        <section className="glass grain mt-20 rounded-blob p-8 sm:p-12">
          <div className="max-w-2xl">
            <div className="flex flex-wrap gap-2">
              <Tag tone="gold">future studio</Tag>
              <Tag tone="neutral">experiments in progress</Tag>
            </div>
            <h2 className="display mt-5 text-3xl text-cream">
              Sometimes the canvas is a sneaker.{" "}
              <span className="display-italic text-lilac">Sometimes it&apos;s a webpage.</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              I&apos;m slowly building a digital corner of the studio together
              with my boyfriend — small presentation websites, visual web
              experiments, tiny apps for friends and small projects. Built with
              care and curiosity, not agency promises. This site is the first
              one.
            </p>
            <div className="mt-6">
              <Button href="/contact?type=web" variant="outline">
                Bring us a tiny project →
              </Button>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Socials */}
      <div className="mt-16 text-center">
        <p className="hand text-2xl text-lilac">come say hi where I actually live:</p>
        <div className="mt-5 flex flex-wrap justify-center gap-4">
          <Button href={site.instagram} variant="outline">Instagram</Button>
          <Button href={site.tiktok} variant="outline">TikTok</Button>
          <Button href="/contact">Contact me</Button>
        </div>
      </div>
    </div>
  );
}
