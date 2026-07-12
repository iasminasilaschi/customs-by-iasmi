"use client";

/**
 * Right panel — the concept made "real": base shoe, per-part colour
 * recap, an inspiration note, and the handoff into a commission request.
 */

import { useState } from "react";
import {
  baseShoe,
  conceptSummary,
  defaultColorway,
  shoeParts,
  swatchName,
} from "@/data/shoe";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { customizedParts, useStudio } from "./store";

export function SummaryPanel() {
  const colors = useStudio((s) => s.colors);
  const note = useStudio((s) => s.note);
  const setNote = useStudio((s) => s.setNote);
  const hover = useStudio((s) => s.hover);
  const [copied, setCopied] = useState(false);

  const paintedCount = customizedParts(colors).length;

  const copySummary = async () => {
    const text = `${conceptSummary(colors)}${note.trim() ? `\ninspiration: ${note.trim()}` : ""}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — no drama, the form still carries everything
    }
  };

  return (
    <div className="space-y-4">
      <section aria-label="Your concept" className="rounded-blob border border-line bg-coal p-5">
        <p className="eyebrow mb-1">your concept</p>
        <h3 className="font-medium text-cream">{baseShoe.name}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">{baseShoe.description}</p>

        <ul className="mt-4 space-y-1">
          {shoeParts.map((p) => {
            const painted =
              colors[p.key].toLowerCase() !== defaultColorway[p.key].toLowerCase();
            return (
              <li
                key={p.key}
                onMouseEnter={() => hover(p.key)}
                onMouseLeave={() => hover(null)}
                className="flex items-center justify-between gap-3 rounded-lg px-1.5 py-1 text-sm transition-colors hover:bg-cream-soft/60"
              >
                <span className={cn(painted ? "text-cream" : "text-muted")}>
                  {p.label.toLowerCase()}
                </span>
                <span className="flex items-center gap-2">
                  <span className={cn("text-sm", painted ? "text-cream-2" : "text-muted/70")}>
                    {painted ? swatchName(colors[p.key]) : "clean white"}
                  </span>
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-line"
                    style={{ backgroundColor: colors[p.key] }}
                  />
                </span>
              </li>
            );
          })}
        </ul>

        <p className="mt-4 border-t border-line pt-3 text-sm text-muted">
          {paintedCount === 0
            ? "Untouched so far — a clean white pair waiting for its story."
            : `${paintedCount} of ${shoeParts.length} parts painted.`}
        </p>
      </section>

      <section aria-label="Inspiration note" className="rounded-blob border border-line bg-coal p-5">
        <label htmlFor="lab-note" className="eyebrow mb-1 block">
          a note for the artist
        </label>
        <textarea
          id="lab-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          maxLength={280}
          placeholder="a film, a song, a garden, a person…"
          className="mt-2 w-full resize-none rounded-xl border border-line bg-cream-soft/70 px-3.5 py-2.5 text-base text-cream placeholder:text-muted/70 focus:border-olive focus:outline-none"
        />
      </section>

      <section className="rounded-blob border border-line bg-coal p-5">
        <p className="text-sm leading-relaxed text-muted">
          ✦ This is a concept preview, not the final render. Hand-painted
          commissions differ slightly in texture, finish and the small
          handmade details that make them yours.
        </p>
        <div className="mt-4 space-y-2">
          <Button href="#request" className="w-full">
            Request this concept ↓
          </Button>
          <Button variant="outline" onClick={copySummary} className="w-full">
            {copied ? "copied ✓" : "copy concept summary"}
          </Button>
        </div>
        <p className="mt-3 text-center text-sm text-muted">
          Saved in this browser as you play — come back anytime.
        </p>
      </section>
    </div>
  );
}
