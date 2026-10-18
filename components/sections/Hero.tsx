"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { MotionConfig, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { SneakerStage } from "@/components/sections/hero/SneakerStage";
import { heroShowcase, type VibePalette } from "@/data/media";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

/** The atelier's own colours, for when no pair is on stage. */
const atelier: VibePalette = {
  bg: "#f5f0e6",
  glow: "#fbf8f0",
  word: "#ece2d1",
  ink: "#2c2a20",
  muted: "#7a7060",
  accent: "#5f6f52",
  accentInk: "#f5f0e6",
  accentOnCream: "#bb8355",
  glass: "rgb(251 248 240 / 0.72)",
  line: "rgb(58 50 34 / 0.14)",
  shade: "rgb(47 58 47 / 0.6)",
};

/** A palette as the vibe properties registered in globals.css. */
function vibeVars(v: VibePalette): Record<string, string> {
  return {
    "--vibe-bg": v.bg,
    "--vibe-glow": v.glow,
    "--vibe-word": v.word,
    "--vibe-ink": v.ink,
    "--vibe-muted": v.muted,
    "--vibe-accent": v.accent,
    "--vibe-accent-ink": v.accentInk,
    "--vibe-glass": v.glass,
    "--vibe-line": v.line,
    "--vibe-tint": v.line,
    "--vibe-shade": v.shade,
  };
}

export function Hero() {
  const [active, setActive] = useState(0);
  const slide = heroShowcase[active];
  const vibe = slide?.vibe ?? atelier;

  // The nav and the cream sections' accents follow the pair on stage too.
  useEffect(() => {
    if (!slide) return;
    const style = document.documentElement.style;
    const vars = { ...vibeVars(slide.vibe), "--color-rose-2": slide.vibe.accentOnCream };
    for (const [k, v] of Object.entries(vars)) style.setProperty(k, v);
  }, [slide]);
  // Leaving the homepage fades everything back to the atelier colours.
  useEffect(
    () => () => {
      const style = document.documentElement.style;
      for (const k of Array.from(style)) {
        if (k.startsWith("--vibe-") || k === "--color-rose-2") style.removeProperty(k);
      }
    },
    [],
  );

  // same markup on server and client; MotionConfig drops the rise for reduced motion
  const enter = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: [0.21, 0.6, 0.35, 1] as const },
  });

  return (
    <MotionConfig reducedMotion="user">
      <section
        className="vibe-scope relative overflow-hidden"
        style={vibeVars(vibe) as CSSProperties}
      >
        <div
          className={cn(
            "mx-auto grid max-w-[90rem] items-center gap-8 px-4 pt-28 pb-16 sm:px-6 sm:pt-32 lg:px-12 lg:pt-32 lg:pb-20 xl:px-20",
            slide && "lg:min-h-[min(100svh,60rem)] lg:grid-cols-[1.1fr_1fr] lg:gap-10",
          )}
        >
          {/* Copy */}
          <div className="relative z-10 max-w-2xl">
            <motion.p {...enter(0)} className="hand mb-4 text-3xl text-(--vibe-muted)">
              painted by hand
            </motion.p>
            <motion.h1
              {...enter(0.08)}
              className="display leading-[1.02] text-[clamp(2.75rem,1.55rem+4.2vw,4.75rem)]"
            >
              Custom sneakers,
              <br />
              <span className="display-italic text-(--vibe-accent)">painted by hand.</span>
            </motion.h1>
            <motion.p
              {...enter(0.16)}
              className="mt-7 max-w-lg text-xl leading-relaxed text-(--vibe-muted)"
            >
              Wearable art created from your moodboard, story, colours, and
              obsessions. Send me the mood and I&apos;ll turn it into something you
              can wear.
            </motion.p>
            <motion.div
              {...enter(0.24)}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Button href="/design-lab" variant="vibe" size="lg">
                Start a sneaker commission
              </Button>
              <Button href="/projects" variant="vibe-outline" size="lg">
                View my projects
              </Button>
            </motion.div>
            <motion.div
              {...enter(0.32)}
              className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-2 text-base text-(--vibe-muted)"
            >
              <span>{site.location}</span>
            </motion.div>
          </div>

          {/* The pairs take turns on stage, each bringing its own colours */}
          {slide && (
            <SneakerStage
              slides={heroShowcase}
              active={active}
              onSelect={setActive}
              className="max-lg:order-first max-lg:mx-auto max-lg:w-full max-lg:max-w-2xl"
            />
          )}
        </div>
      </section>
    </MotionConfig>
  );
}
