"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { heroPhoto } from "@/data/media";
import { site } from "@/data/site";

export function Hero() {
  const reduce = useReducedMotion();
  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: [0.21, 0.6, 0.35, 1] as const },
        };

  return (
    <section className="relative overflow-hidden pt-36 pb-20 sm:pt-44 lg:pb-28">
      {/* one soft warm wash — calm, not busy */}
      <div
        aria-hidden
        className="glow-sage pointer-events-none absolute -top-32 right-[-10%] h-[36rem] w-[36rem]"
      />

      <div className={`mx-auto grid max-w-[90rem] items-center gap-14 px-4 sm:px-6 ${heroPhoto ? "lg:grid-cols-[1.1fr_0.9fr] lg:gap-20" : ""} lg:px-12 xl:px-20`}>
        {/* Copy */}
        <div className="relative z-10 max-w-2xl">
          <motion.p {...enter(0)} className="hand mb-4 text-3xl text-sage">
            painted by hand
          </motion.p>
          <motion.h1
            {...enter(0.08)}
            className="display leading-[1.02] text-[clamp(2.75rem,1.55rem+4.2vw,4.75rem)]"
          >
            Custom sneakers,
            <br />
            <span className="display-italic text-rose-2">painted by hand.</span>
          </motion.h1>
          <motion.p
            {...enter(0.16)}
            className="mt-7 max-w-lg text-xl leading-relaxed text-muted"
          >
            Wearable art created from your moodboard, story, colours, and
            obsessions. Send me the mood and I&apos;ll turn it into something you
            can wear.
          </motion.p>
          <motion.div
            {...enter(0.24)}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Button href="/design-lab" size="lg">
              Start a sneaker commission
            </Button>
            <Button href="/projects" variant="outline" size="lg">
              View my projects
            </Button>
          </motion.div>
          <motion.div
            {...enter(0.32)}
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-2 text-base text-muted"
          >
            <span>{site.location}</span>
          </motion.div>
        </div>

        {/* One large editorial visual — only when a real photo is set */}
        {heroPhoto && (
          <motion.div
            {...enter(0.2)}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <div className="overflow-hidden rounded-[2rem] border border-line bg-cream-soft p-3 shadow-lift">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.4rem]">
                <Photo photo={heroPhoto} priority sizes="(min-width: 1024px) 40vw, 90vw" />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
