"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { MotionConfig, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { SneakerStage } from "@/components/sections/hero/SneakerStage";
import { EASE_WASH, WASH, WASH_HOLD } from "@/components/sections/hero/wash";
import { heroShowcase } from "@/data/media";
import { applyRootVibe, atelier, clearRootVibe, vibeVars } from "@/lib/vibe";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

/** A pair's backdrop in the stack; the newest one fades in over the rest. */
type Layer = { id: number; index: number };

export function Hero() {
  const [active, setActive] = useState(0);
  const [layers, setLayers] = useState<Layer[]>([{ id: 0, index: 0 }]);
  const nextLayer = useRef(1);
  const washTimer = useRef<number | undefined>(undefined);
  const slide = heroShowcase[active];
  const vibe = slide?.vibe ?? atelier;

  // Bring on another pair: its backdrop fades in on top, and for the length
  // of that fade html[data-vibe-wash] makes text and UI colours flip at its
  // midpoint (globals.css) instead of snapping.
  const select = (index: number) => {
    if (index === active || !heroShowcase[index]) return;
    const root = document.documentElement;
    root.setAttribute("data-vibe-wash", "");
    window.clearTimeout(washTimer.current);
    washTimer.current = window.setTimeout(() => root.removeAttribute("data-vibe-wash"), WASH_HOLD);
    const id = nextLayer.current++;
    setLayers((ls) => [...ls, { id, index }]);
    setActive(index);
  };

  // The nav and the cream sections' accents follow the pair on stage too.
  // Set before paint, so they change in the same frame as the hero.
  useLayoutEffect(() => {
    if (slide) applyRootVibe(slide.vibe);
  }, [slide]);
  // Leaving the homepage puts the atelier colours back.
  useEffect(
    () => () => {
      window.clearTimeout(washTimer.current);
      clearRootVibe();
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
        {/* one backdrop per pair: a plain opacity fade, smooth in every browser */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {layers.map((l) => {
            const v = heroShowcase[l.index]?.vibe ?? atelier;
            return (
              <motion.div
                key={l.id}
                className="vibe-layer"
                style={{ "--layer-bg": v.bg, "--layer-glow": v.glow } as CSSProperties}
                initial={l.id === 0 ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: WASH, ease: EASE_WASH }}
                // once it covers everything, the ones underneath can go
                onAnimationComplete={() => setLayers((ls) => ls.filter((x) => x.id >= l.id))}
              />
            );
          })}
        </div>

        <div
          className={cn(
            "relative mx-auto grid max-w-[90rem] items-center gap-8 px-4 pt-28 pb-16 sm:px-6 sm:pt-32 lg:px-12 lg:pt-32 lg:pb-20 xl:px-20",
            slide && "lg:min-h-[min(100svh,60rem)] lg:grid-cols-[1.1fr_1fr] lg:gap-10",
          )}
        >
          {/* Copy */}
          <div className="relative z-10 max-w-2xl">
            <motion.p {...enter(0)} className="hand mb-4 text-3xl text-(--vibe-pop)">
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
              onSelect={select}
              className="max-lg:order-first max-lg:mx-auto max-lg:w-full max-lg:max-w-2xl"
            />
          )}
        </div>
      </section>
    </MotionConfig>
  );
}
