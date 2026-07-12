"use client";

/**
 * Design Lab v2 — the customization studio.
 *
 * Layout: parts & paints (left) · 3D stage (center, sticky) · concept
 * summary (right); stacks viewer-first on mobile. The 3D canvas is
 * client-only (`ssr: false` — allowed here because this is a Client
 * Component) and only ships three.js on this route.
 *
 * The current configuration flows into the commission form below as its
 * `context`, so a request carries the exact colour story.
 */

import { useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { conceptSummary } from "@/data/shoe";
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

export function DesignLabStudio({ initialIdea = "" }: { initialIdea?: string }) {
  const colors = useStudio((s) => s.colors);
  const note = useStudio((s) => s.note);

  // Colours + note persist per-browser; rehydrate after mount (SSR-safe).
  useEffect(() => {
    useStudio.persist.rehydrate();
  }, []);

  const context = useMemo(() => {
    const trimmed = note.trim();
    return `3D concept · ${conceptSummary(colors)}${trimmed ? ` · inspiration: ${trimmed}` : ""}`;
  }, [colors, note]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* 3D stage — first on mobile, center on desktop */}
        <section
          aria-label="3D shoe preview"
          className="lg:order-2 lg:col-span-6"
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

      {/* make it real */}
      <section
        aria-label="Request this concept"
        id="request"
        className="grain scroll-mt-28 rounded-blob border border-line bg-coal p-6 sm:p-10"
      >
        <div className="mb-8 max-w-xl">
          <p className="eyebrow mb-2">04 · make it real</p>
          <h2 className="display text-3xl text-cream">
            A concept first. A{" "}
            <span className="display-italic text-rose-2">hand-painted pair</span> next.
          </h2>
          <p className="mt-3 text-sm text-muted">
            Your colour story comes with the request automatically. I&apos;ll
            reply with thoughts, a rough quote and next steps — no commitment
            yet.
          </p>
        </div>
        <InquiryForm defaultType="sneakers" initialIdea={initialIdea} context={context} />
      </section>
    </div>
  );
}
