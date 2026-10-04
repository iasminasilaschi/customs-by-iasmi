import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { lifeMosaic } from "@/data/mosaic";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description:
    "The person behind Customs by Iasmi — custom hand-painted sneakers and graduation caps.",
};

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
