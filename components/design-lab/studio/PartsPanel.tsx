"use client";

/**
 * Left panel — pick a part, paint it (colour + finish), add photos and
 * lettering, or apply a whole colour story. Hovering a row highlights the
 * part on the 3D shoe (shared store).
 */

import {
  finishes,
  finishOrder,
  paintSwatches,
  presetColorways,
  shoeParts,
  swatchName,
} from "@/data/shoe";
import { cn } from "@/lib/utils";
import { useStudio } from "./store";
import { ArtPanel } from "./ArtPanel";

export function PartsPanel() {
  const colors = useStudio((s) => s.colors);
  const selected = useStudio((s) => s.selected);
  const select = useStudio((s) => s.select);
  const hover = useStudio((s) => s.hover);
  const paint = useStudio((s) => s.paint);
  const finish = useStudio((s) => s.finish);
  const setFinish = useStudio((s) => s.setFinish);
  const resetPart = useStudio((s) => s.resetPart);
  const resetAll = useStudio((s) => s.resetAll);
  const applyPreset = useStudio((s) => s.applyPreset);

  const active = shoeParts.find((p) => p.key === selected);

  return (
    <div className="space-y-4">
      {/* 01 — parts */}
      <section aria-label="Shoe parts" className="rounded-blob border border-line bg-coal p-5">
        <p className="eyebrow mb-1">01 · pick a part</p>
        <p className="text-sm text-muted">On the shoe, or right here.</p>
        <ul className="mt-3 grid grid-cols-2 gap-1.5 lg:grid-cols-1">
          {shoeParts.map((p) => (
            <li key={p.key}>
              <button
                type="button"
                onClick={() => select(selected === p.key ? null : p.key)}
                onMouseEnter={() => hover(p.key)}
                onMouseLeave={() => hover(null)}
                aria-pressed={selected === p.key}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl border px-3 py-2 text-left text-sm transition-all",
                  selected === p.key
                    ? "border-olive/50 bg-sage/15 text-cream"
                    : "border-transparent text-cream-2 hover:border-line hover:bg-cream-soft/60",
                )}
              >
                <span
                  className="h-3.5 w-3.5 shrink-0 rounded-full border border-line"
                  style={{ backgroundColor: colors[p.key] }}
                />
                {p.label.toLowerCase()}
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* 02 — paint */}
      <section aria-label="Colour controls" className="rounded-blob border border-line bg-coal p-5">
        <p className="eyebrow mb-1">02 · paint it</p>
        {active ? (
          <>
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-medium text-cream">{active.label}</h3>
              <span className="text-sm text-muted">{swatchName(colors[active.key])}</span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-muted">{active.blurb}</p>

            <div className="mt-4 grid grid-cols-8 gap-2" role="group" aria-label="Paint swatches">
              {paintSwatches.map((s) => {
                const current = colors[active.key].toLowerCase() === s.hex.toLowerCase();
                return (
                  <button
                    key={s.hex}
                    type="button"
                    title={s.name}
                    aria-label={`Paint ${active.label} ${s.name}`}
                    aria-pressed={current}
                    onClick={() => paint(s.hex)}
                    className={cn(
                      "aspect-square w-full rounded-full border border-line transition-transform hover:scale-110",
                      current && "ring-2 ring-olive ring-offset-2 ring-offset-coal",
                    )}
                    style={{ backgroundColor: s.hex }}
                  />
                );
              })}
            </div>

            <div className="mt-4" role="group" aria-label={`Finish for ${active.label}`}>
              <p className="mb-1.5 text-sm text-muted">finish</p>
              <div className="flex flex-wrap gap-1.5">
                {finishOrder.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFinish(active.key, f)}
                    aria-pressed={finish[active.key] === f}
                    className={cn(
                      "rounded-full border px-3 py-1 text-sm transition-colors",
                      finish[active.key] === f
                        ? "border-olive/50 bg-sage/15 text-cream"
                        : "border-line text-muted hover:bg-cream-soft/60 hover:text-cream",
                    )}
                  >
                    {finishes[f].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
                <span className="relative inline-block h-8 w-8 overflow-hidden rounded-full border border-line">
                  <input
                    type="color"
                    value={colors[active.key]}
                    onChange={(e) => paint(e.target.value)}
                    aria-label={`Custom colour for ${active.label}`}
                    className="absolute -left-2 -top-2 h-12 w-12 cursor-pointer border-0 p-0"
                  />
                </span>
                custom shade
              </label>
              <button
                type="button"
                onClick={() => resetPart(active.key)}
                className="text-sm text-brown underline-offset-4 transition-colors hover:text-olive hover:underline"
              >
                reset part
              </button>
            </div>
          </>
        ) : (
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Click a part of the shoe — or one in the list above — and the
            paints appear here.
          </p>
        )}
      </section>

      {/* 03 — photos & words */}
      <ArtPanel />

      {/* 04 — colour stories */}
      <section aria-label="Preset colourways" className="rounded-blob border border-line bg-coal p-5">
        <p className="eyebrow mb-1">04 · colour stories</p>
        <p className="text-sm text-muted">Whole-shoe starting points — then make them yours.</p>
        <div className="mt-3 space-y-1.5">
          {presetColorways.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset.id)}
              className="flex w-full items-center justify-between gap-3 rounded-xl border border-transparent px-3 py-2 text-left transition-all hover:border-line hover:bg-cream-soft/60"
            >
              <span className="min-w-0">
                <span className="block text-sm text-cream">{preset.name}</span>
                <span className="block truncate text-sm text-muted">{preset.vibe}</span>
              </span>
              <span className="flex shrink-0 -space-x-1.5">
                {[preset.colors.toeCap, preset.colors.sideOuter, preset.colors.heel, preset.colors.sole].map(
                  (c, i) => (
                    <span
                      key={i}
                      className="h-5 w-5 rounded-full border border-line"
                      style={{ backgroundColor: c }}
                    />
                  ),
                )}
              </span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={resetAll}
          className="mt-3 text-sm text-brown underline-offset-4 transition-colors hover:text-olive hover:underline"
        >
          reset everything to clean white
        </button>
      </section>
    </div>
  );
}
