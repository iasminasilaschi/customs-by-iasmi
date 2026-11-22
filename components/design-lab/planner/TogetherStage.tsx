"use client";

/**
 * A read-only, live composite of the side views ("together" views). Tap any
 * shoe to open that view for editing. "Feet together" slides the inner
 * sides until they touch, so one scene can run across both.
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { PlannerPair, PlannerViewKey, TogetherKey } from "@/data/planner";
import { drawComposite, hitComposite, layoutFor, pageFont } from "./render";
import { usePlanner } from "./store";

/** 1 = apart, 0 = touching; eases between them when the toggle flips. */
function useApart(feetTogether: boolean, active: boolean) {
  const target = feetTogether && active ? 0 : 1;
  const [apart, setApart] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = from.current;
    if (start === target) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dur = reduce ? 0 : 520;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = dur ? Math.min(1, (now - t0) / dur) : 1;
      const e = 1 - Math.pow(1 - p, 3);
      const v = start + (target - start) * e;
      from.current = v;
      setApart(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return apart;
}

export function TogetherStage({ which, pair }: { which: TogetherKey; pair: PlannerPair }) {
  const layers = usePlanner((s) => s.layers);
  const version = usePlanner((s) => s.imagesVersion);
  const feetTogether = usePlanner((s) => s.feetTogether);
  const innerLayout = usePlanner((s) => s.innerLayout);
  const setScreen = usePlanner((s) => s.setScreen);

  const apart = useApart(feetTogether, which !== "pair");
  const layout = layoutFor(which, pair, which === "pair" ? 1 : apart, innerLayout, version);

  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [wrapW, setWrapW] = useState(0);
  const [hover, setHover] = useState<PlannerViewKey | null>(null);
  const down = useRef<{ x: number; y: number } | null>(null);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWrapW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // css size: full width, but never taller than ~75% of the screen
  let cssW = wrapW, cssH = 0;
  if (layout && wrapW) {
    const maxH = typeof window === "undefined" ? 800 : Math.max(320, window.innerHeight * 0.75);
    cssH = (wrapW * layout.height) / layout.width;
    if (cssH > maxH) {
      cssH = maxH;
      cssW = (maxH * layout.width) / layout.height;
    }
  }
  const scale = layout && cssW ? cssW / layout.width : 1;

  useEffect(() => {
    const c = canvasRef.current;
    if (!c || !layout || !cssW) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const W = Math.round(cssW * dpr), H = Math.round(cssH * dpr);
    if (c.width !== W) c.width = W;
    if (c.height !== H) c.height = H;
    const ctx = c.getContext("2d")!;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, W, H);
    drawComposite(ctx, layout, pair, layers, version, scale * dpr, { font: pageFont(), highlight: hover });
  }, [layout, cssW, cssH, scale, pair, layers, version, hover]);

  const toUnits = (e: React.PointerEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: (e.clientX - r.left) / scale, y: (e.clientY - r.top) / scale };
  };

  const label = {
    pair: "The pair: both shoes, all eight views.",
    outer: "Outer sides of both shoes, toes pointing away from each other.",
    inner:
      innerLayout === "soles"
        ? `Inner sides folded open around the soles, toes up${feetTogether ? ", touching" : ""}.`
        : `Inner sides toe to toe${feetTogether ? ", touching" : ""}.`,
  }[which];

  return (
    <div ref={wrapRef} className="grain relative overflow-hidden rounded-blob border border-line bg-cream-soft p-0 shadow-soft">
      {!layout ? (
        <p className="flex h-72 items-center justify-center text-sm text-muted">loading the shoes…</p>
      ) : (
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`${label} Tap a shoe to edit it.`}
          className="mx-auto block touch-manipulation"
          style={{ width: cssW, height: cssH, cursor: hover ? "pointer" : "default" }}
          onPointerDown={(e) => (down.current = { x: e.clientX, y: e.clientY })}
          onPointerUp={(e) => {
            const d = down.current;
            down.current = null;
            if (!d || Math.hypot(e.clientX - d.x, e.clientY - d.y) > 8) return;
            const p = toUnits(e);
            const hit = hitComposite(layout, pair, p.x, p.y);
            if (hit) setScreen({ kind: "view", key: hit });
          }}
          onPointerMove={(e) => {
            if (e.pointerType !== "mouse") return;
            const p = toUnits(e);
            setHover(hitComposite(layout, pair, p.x, p.y));
          }}
          onPointerLeave={() => setHover(null)}
        />
      )}
    </div>
  );
}

/** Keyboard / screen-reader way into the views shown in a together view. */
export function viewsIn(which: TogetherKey): PlannerViewKey[] {
  if (which === "outer") return ["leftOuter", "rightOuter"];
  if (which === "inner") return ["leftInner", "rightInner"];
  return ["leftOuter", "rightOuter", "leftInner", "rightInner", "leftHeel", "rightHeel", "leftToe", "rightToe"];
}
