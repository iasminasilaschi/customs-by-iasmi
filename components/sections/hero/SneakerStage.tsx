"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import type { ShowcaseSlide } from "@/data/media";
import { cn } from "@/lib/utils";

/** Seconds each pair stays on stage. */
const SWAP_EVERY = 6;

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_IN = [0.55, 0, 0.75, 0.2] as const;
const SIZES = "(min-width: 1024px) 52vw, 92vw";

// Read as an external store: "not reduced" while hydrating, then the real
// setting, so server and client markup always agree.
const REDUCE = "(prefers-reduced-motion: reduce)";
function subscribeReduce(onChange: () => void) {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
const useReducedMotion = () =>
  useSyncExternalStore(subscribeReduce, () => window.matchMedia(REDUCE).matches, () => false);

/** What every animated piece gets as `custom`. */
type Ctx = { slide: ShowcaseSlide; reduce: boolean };

const pose = ({ pose: p }: ShowcaseSlide) => ({ x: p.x, y: p.y, rotate: p.rotate, scale: p.scale });

/*
  The swap: the pair on stage is thrown off to the upper left, tipping and
  growing as it goes, while the next one drops in from the upper right and
  settles. With reduced motion they simply crossfade in place.
  Rest states never depend on `reduce`, so server and client markup match.
*/
const shoe: Variants = {
  enter: ({ slide, reduce }: Ctx) =>
    reduce
      ? { ...pose(slide), opacity: 0, filter: "blur(0px)" }
      : { x: "58%", y: "-82%", rotate: 18, scale: 0.86, opacity: 0, filter: "blur(6px)" },
  rest: ({ slide, reduce }: Ctx) => ({
    ...pose(slide),
    opacity: 1,
    filter: "blur(0px)",
    transition: reduce
      ? { duration: 0.45 }
      : {
          default: { duration: 0.98, delay: 0.15, ease: EASE_OUT },
          opacity: { duration: 0.3, delay: 0.15, ease: "linear" },
          filter: { duration: 0.4, delay: 0.15, ease: "linear" },
        },
  }),
  leave: ({ reduce }: Ctx) =>
    reduce
      ? { opacity: 0, transition: { duration: 0.35 } }
      : {
          x: "-62%",
          y: "-78%",
          rotate: -24,
          scale: 1.18,
          opacity: 0,
          filter: "blur(6px)",
          transition: { duration: 0.64, ease: EASE_IN },
        },
};

/** The ground shadow empties as a pair leaves and catches the next landing. */
const ground: Variants = {
  enter: ({ reduce }: Ctx) => ({ opacity: 0, scaleX: reduce ? 1 : 0.5 }),
  rest: ({ reduce }: Ctx) => ({
    opacity: 1,
    scaleX: 1,
    transition: reduce ? { duration: 0.45 } : { duration: 0.9, delay: 0.45, ease: EASE_OUT },
  }),
  leave: ({ reduce }: Ctx) => ({
    opacity: 0,
    scaleX: reduce ? 1 : 0.6,
    transition: { duration: 0.35, ease: EASE_IN },
  }),
};

/** Giant word: old letters lift away, new ones rise in, left to right. */
const word: Variants = {
  enter: {},
  rest: ({ reduce }: Ctx) => ({
    transition: reduce ? {} : { staggerChildren: 0.038, delayChildren: 0.22 },
  }),
  leave: ({ reduce }: Ctx) => ({ transition: reduce ? {} : { staggerChildren: 0.018 } }),
};
const letter: Variants = {
  enter: ({ reduce }: Ctx) => ({ y: reduce ? "0%" : "38%", opacity: 0 }),
  rest: ({ reduce }: Ctx) => ({
    y: "0%",
    opacity: 1,
    transition: reduce ? { duration: 0.45 } : { duration: 0.82, ease: EASE_OUT },
  }),
  leave: ({ reduce }: Ctx) => ({
    y: reduce ? "0%" : "-22%",
    opacity: 0,
    transition: { duration: reduce ? 0.35 : 0.36, ease: EASE_IN },
  }),
};

const caption: Variants = {
  enter: ({ reduce }: Ctx) => ({ opacity: 0, y: reduce ? 0 : 8 }),
  rest: { opacity: 1, y: 0, transition: { duration: 0.42, delay: 0.2, ease: EASE_OUT } },
  leave: ({ reduce }: Ctx) => ({ opacity: 0, y: reduce ? 0 : -6, transition: { duration: 0.2, ease: EASE_IN } }),
};

/**
 * The homepage hero's stage: one pair at a time, swapping every few
 * seconds. Autoplay pauses on hover, keyboard focus, when scrolled away or
 * the tab is hidden, and whenever the visitor presses pause. With reduced
 * motion it doesn't start until asked to.
 */
export function SneakerStage({
  slides,
  active,
  onSelect,
  className,
}: {
  slides: ShowcaseSlide[];
  active: number;
  onSelect: (index: number) => void;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const slide = slides[active];
  const ctx: Ctx = { slide, reduce };
  const rotating = slides.length > 1;

  const [userStopped, setUserStopped] = useState<boolean | null>(null);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [offscreen, setOffscreen] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const stopped = userStopped ?? reduce; // reduced motion: no autoplay unless asked
  const paused = stopped || hovering || focused || offscreen || tabHidden;

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOffscreen(!e.isIntersecting), {
      threshold: 0.35,
    });
    io.observe(el);
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div
      ref={ref}
      role="region"
      aria-roledescription="carousel"
      aria-label="Sneakers I've painted"
      className={cn("relative min-w-0", className)}
      style={{ "--vibe-interval": `${SWAP_EVERY}s` } as CSSProperties}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovering(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHovering(false)}
      onFocus={(e) => e.target.matches(":focus-visible") && setFocused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setFocused(false)}
    >
      {/* giant word behind the shoe */}
      <div
        data-words
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 bottom-[12%] grid place-items-center md:inset-x-[-12%] md:top-[-2%] md:bottom-[14%]"
      >
        <AnimatePresence initial={false}>
          <GiantWord key={slide.slug} ctx={ctx} />
        </AnimatePresence>
      </div>

      <div className="relative aspect-[5/4] sm:aspect-[4/3] lg:aspect-[1.35]">
        <AnimatePresence initial={false}>
          <motion.div
            key={slide.slug}
            custom={ctx}
            variants={ground}
            initial="enter"
            animate="rest"
            exit="leave"
            aria-hidden
            className="absolute inset-x-[16%] bottom-[2%] h-[10%]"
          >
            <div className="vibe-ground h-full w-full rounded-[50%]" />
          </motion.div>
        </AnimatePresence>

        <div className="vibe-float absolute inset-0">
          <AnimatePresence initial={false}>
            <motion.div
              key={slide.slug}
              custom={ctx}
              variants={shoe}
              initial="enter"
              animate="rest"
              exit="leave"
              className="absolute inset-0"
            >
              <Image
                src={slide.photo.src}
                alt={slide.photo.alt}
                fill
                sizes={SIZES}
                loading="eager"
                fetchPriority={active === 0 ? "high" : undefined}
                className="object-contain drop-shadow-[0_28px_26px_var(--vibe-shade)]"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* keep every pair loaded, so a swap never waits on the network */}
        {rotating && (
          <div aria-hidden className="invisible absolute inset-0">
            {slides.map((s) => (
              <Image key={s.slug} src={s.photo.src} alt="" fill sizes={SIZES} loading="eager" />
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div aria-live={paused ? "polite" : "off"} className="min-h-[2rem]">
          {/* its ::after stretches over the whole stage, so the shoe is clickable too */}
          <Link
            href={`/projects/${slide.slug}`}
            className="hand group text-2xl text-(--vibe-ink) after:absolute after:inset-0"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={slide.slug}
                custom={ctx}
                variants={caption}
                initial="enter"
                animate="rest"
                exit="leave"
                className="inline-block"
              >
                {slide.caption}{" "}
                <span
                  aria-hidden
                  className="inline-block text-(--vibe-accent) transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </motion.span>
            </AnimatePresence>
          </Link>
        </div>

        {rotating && (
          <div
            role="group"
            aria-label="Choose a pair"
            className="vibe-glass relative z-10 flex max-w-full items-center gap-1 overflow-x-auto rounded-full p-1 [scrollbar-width:none]"
          >
            {slides.map((s, i) => {
              const on = i === active;
              return (
                <button
                  key={s.slug}
                  type="button"
                  aria-current={on ? "true" : undefined}
                  onClick={() => onSelect(i)}
                  className={cn(
                    "relative whitespace-nowrap rounded-full px-2.5 pt-2 pb-2.5 text-[0.85rem] transition-colors min-[400px]:px-3 min-[400px]:text-[0.9rem] sm:px-4 sm:text-[0.95rem]",
                    on ? "bg-(--vibe-tint) text-(--vibe-ink)" : "text-(--vibe-ink)/70 hover:text-(--vibe-ink)",
                  )}
                >
                  {s.name}
                  {on && (
                    // the progress line is also the timer: when it fills, the next pair comes on
                    <span
                      aria-hidden
                      onAnimationEnd={() => onSelect((active + 1) % slides.length)}
                      style={{ animationPlayState: paused ? "paused" : "running" }}
                      className="vibe-bar absolute inset-x-2.5 bottom-1.5 min-[400px]:inset-x-3 sm:inset-x-4 h-0.5 rounded-full bg-(--vibe-accent)"
                    />
                  )}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setUserStopped(!stopped)}
              aria-label={stopped ? "Play the slideshow" : "Pause the slideshow"}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-(--vibe-ink) transition-colors hover:bg-(--vibe-tint)"
            >
              <svg viewBox="0 0 16 16" aria-hidden className="h-3.5 w-3.5">
                {stopped ? (
                  <path
                    d="M4.5 2.8v10.4a.8.8 0 0 0 1.2.7l8.3-5.2a.8.8 0 0 0 0-1.4L5.7 2.1a.8.8 0 0 0-1.2.7Z"
                    fill="currentColor"
                  />
                ) : (
                  <>
                    <rect x="3.5" y="2.5" width="3" height="11" rx="1" fill="currentColor" />
                    <rect x="9.5" y="2.5" width="3" height="11" rx="1" fill="currentColor" />
                  </>
                )}
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/** The pair's word, sized to fill the space behind the shoe. */
function GiantWord({ ctx }: { ctx: Ctx }) {
  const ref = useRef<HTMLDivElement>(null);
  const lines = ctx.slide.word;

  useLayoutEffect(() => {
    const el = ref.current;
    const box = el?.closest<HTMLElement>("[data-words]");
    if (!el || !box) return;
    const fit = () => {
      if (!el.isConnected) return;
      el.style.fontSize = "100px";
      const natural = el.getBoundingClientRect().width;
      const { width, height } = box.getBoundingClientRect();
      el.style.fontSize = `${Math.min((100 * width) / natural, height / (lines.length * 0.8))}px`;
      el.dataset.fit = "";
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, [lines.length]);

  return (
    <motion.div
      custom={ctx}
      variants={word}
      initial="enter"
      animate="rest"
      exit="leave"
      className="col-start-1 row-start-1"
    >
      <div ref={ref} className="vibe-word">
        {lines.map((line) => (
          <span key={line} className="block">
            {[...line].map((ch, i) => (
              <motion.span key={i} custom={ctx} variants={letter} className="inline-block">
                {ch === " " ? " " : ch}
              </motion.span>
            ))}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
