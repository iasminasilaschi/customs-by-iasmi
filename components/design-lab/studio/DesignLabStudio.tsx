"use client";

/**
 * Design Lab v2 — the customization studio.
 *
 * Layout: parts & paints (left) · 3D stage (center, sticky) · concept
 * summary (right); stacks viewer-first on mobile. The 3D canvas is
 * client-only (`ssr: false` — allowed here because this is a Client
 * Component) and only ships three.js on this route.
 *
 * A private tool: nothing here is sent anywhere. The summary panel can save
 * a concept image or copy the colour story.
 */

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { PartsPanel } from "./PartsPanel";
import { SummaryPanel } from "./SummaryPanel";
import { useStudio } from "./store";

const ShoeViewer = dynamic(() => import("./ShoeViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center">
        <div
          aria-hidden
          className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-sage border-t-transparent"
        />
        <p className="text-sm text-muted">warming up the studio…</p>
      </div>
    </div>
  ),
});

export function DesignLabStudio() {
  // Colours + note persist per-browser; rehydrate after mount (SSR-safe).
  useEffect(() => {
    useStudio.persist.rehydrate();
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* 3D stage — first on mobile, center on desktop */}
      <section
        aria-label="3D shoe preview"
        className="min-w-0 lg:order-2 lg:col-span-6"
      >
        <div className="grain relative h-[26rem] overflow-hidden rounded-blob border border-line bg-coal shadow-soft sm:h-[30rem] lg:sticky lg:top-24 lg:h-[34rem]">
          {/* soft sage glow behind the shoe */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(70% 55% at 50% 42%, rgba(143,155,130,0.22), transparent 70%)",
            }}
          />
          <ShoeViewer />
        </div>
      </section>

      <aside className="lg:order-1 lg:col-span-3" aria-label="Customization controls">
        <PartsPanel />
      </aside>

      <aside className="lg:order-3 lg:col-span-3" aria-label="Design summary">
        <SummaryPanel />
      </aside>
    </div>
  );
}
