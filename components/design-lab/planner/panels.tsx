"use client";

/** The planner's side panels: library, layers, adjust, together, project. */

import { useRef, useState } from "react";
import type { PlannerPair, PlannerView, TogetherKey } from "@/data/planner";
import { cn } from "@/lib/utils";
import { CropDialog } from "./CropDialog";
import { addFiles, assetDims, deleteAsset, exportProject, importProject, motifAssets } from "./io";
import { assetSrc, exportComposite, exportView, layoutFor } from "./render";
import { MAX_LAYERS_PER_VIEW, usePlanner, type AssetMeta, type Layer } from "./store";
import { viewsIn } from "./TogetherStage";

const chip =
  "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-line bg-cream-soft/70 px-4 text-sm text-cream transition-colors hover:border-olive/50 disabled:opacity-50 disabled:pointer-events-none";
const link = "inline-flex min-h-11 items-center text-sm text-brown underline-offset-4 hover:text-olive hover:underline";

function Thumb({ id, className }: { id: string; className?: string }) {
  const src = assetSrc.get(id);
  if (!src) return <span className={cn("block bg-coal", className)} />;
  // eslint-disable-next-line @next/next/no-img-element -- local blob/data URL
  return <img src={src} alt="" className={cn("block object-contain", className)} draggable={false} />;
}

/* ------------------------------------------------------------------ library */

export function LibraryPanel({ view, onAdded }: { view: PlannerView | null; onAdded: () => void }) {
  const assets = usePlanner((s) => s.assets);
  const addLayer = usePlanner((s) => s.addLayer);
  const layers = usePlanner((s) => s.layers);
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [managing, setManaging] = useState(false);

  const full = view ? layers[view.key].length >= MAX_LAYERS_PER_VIEW : false;

  const add = (a: AssetMeta) => {
    if (!view) return;
    if (addLayer(view.key, a, view.height / view.width)) onAdded();
    else setMsg(`${MAX_LAYERS_PER_VIEW} layers is the most for one view.`);
  };

  const onFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = [...(e.target.files ?? [])];
    e.target.value = "";
    if (!files.length) return;
    setBusy(true);
    setMsg(null);
    const { added, errors } = await addFiles(files);
    setBusy(false);
    setMsg(
      [added.length ? `Added ${added.length} image${added.length > 1 ? "s" : ""} to the library.` : "", ...errors]
        .filter(Boolean)
        .join(" "),
    );
  };

  const usedIn = (id: string) => Object.values(layers).reduce((n, l) => n + l.filter((x) => x.assetId === id).length, 0);

  const remove = async (a: AssetMeta) => {
    const n = usedIn(a.id);
    if (n && !window.confirm(`“${a.name}” is used ${n} time${n > 1 ? "s" : ""} on the shoes. Remove it everywhere?`)) return;
    await deleteAsset(a.id);
  };

  const tile = (a: AssetMeta, removable: boolean) => (
    <li key={a.id} className="relative">
      <button
        type="button"
        disabled={!view || full || managing}
        onClick={() => add(a)}
        title={view ? `Add “${a.name}” to ${view.label.toLowerCase()}` : a.name}
        className="group flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border border-line bg-cream-soft p-1.5 transition-colors hover:border-olive/50 disabled:cursor-default"
      >
        <Thumb id={a.id} className="max-h-full max-w-full" />
        <span className="sr-only">{view ? `Add ${a.name} to ${view.label}` : a.name}</span>
      </button>
      {removable && managing && (
        <button
          type="button"
          onClick={() => remove(a)}
          aria-label={`Remove ${a.name} from the library`}
          className="absolute -top-1.5 -right-1.5 flex h-11 w-11 items-center justify-center"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-deep text-sm text-paper shadow-soft">×</span>
        </button>
      )}
    </li>
  );

  return (
    <div>
      <p className="text-sm text-muted">
        {view ? (
          <>
            Tap an image to add it to <strong className="font-medium text-cream">{view.label.toLowerCase()}</strong>.
          </>
        ) : (
          "Open one view (tap a shoe) to add images to it."
        )}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" className={chip} onClick={() => fileRef.current?.click()} disabled={busy}>
          {busy ? "adding…" : "+ add images"}
        </button>
        {assets.length > 0 && (
          <button type="button" className={link} onClick={() => setManaging((m) => !m)} aria-pressed={managing}>
            {managing ? "done" : "remove images"}
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp,image/gif,image/avif,image/heic"
          onChange={onFiles}
          className="hidden"
          aria-label="Add images to the library"
        />
      </div>
      {msg && (
        <p className="mt-2 text-sm text-muted" role="status">
          {msg}
        </p>
      )}

      {assets.length > 0 && (
        <>
          <p className="eyebrow mt-5 mb-2 text-gold-ink">your images</p>
          <ul className="grid grid-cols-4 gap-2 sm:grid-cols-5">{assets.map((a) => tile(a, true))}</ul>
        </>
      )}
      <p className="eyebrow mt-5 mb-2 text-gold-ink">starter shapes</p>
      <ul className="grid grid-cols-4 gap-2 sm:grid-cols-5">{motifAssets.map((a) => tile(a, false))}</ul>
      <p className="mt-4 text-xs text-muted">Images stay in this browser. Simple shapes to block out a layout, not final art.</p>
    </div>
  );
}

/* ------------------------------------------------------------------- layers */

export function LayersPanel({ view, onPick }: { view: PlannerView; onPick: () => void }) {
  const layers = usePlanner((s) => s.layers[view.key]);
  const selectedId = usePlanner((s) => s.selectedId);
  const select = usePlanner((s) => s.select);
  const updateLayer = usePlanner((s) => s.updateLayer);
  const moveLayer = usePlanner((s) => s.moveLayer);
  const clearView = usePlanner((s) => s.clearView);
  const assets = usePlanner((s) => s.assets);
  const name = (l: Layer) => (assets.find((a) => a.id === l.assetId) ?? motifAssets.find((a) => a.id === l.assetId))?.name ?? "image";

  if (!layers.length) return <p className="text-sm text-muted">No art on {view.label.toLowerCase()} yet. Add some from the library.</p>;

  const ordered = [...layers].reverse(); // front first, like a stack
  return (
    <div>
      <p className="mb-2 text-xs text-muted">Front at the top.</p>
      <ul className="space-y-1.5">
        {ordered.map((l, i) => {
          const on = l.id === selectedId;
          return (
            <li key={l.id} className={cn("flex items-center gap-1 rounded-xl border pr-1", on ? "border-olive/40 bg-sage/10" : "border-line")}>
              <button
                type="button"
                onClick={() => (select(l.id), onPick())}
                aria-pressed={on}
                className="flex min-h-11 min-w-0 flex-1 items-center gap-3 px-2 text-left text-sm"
              >
                <Thumb id={l.assetId} className={cn("h-9 w-9 shrink-0 rounded-md border border-line bg-cream-soft", l.hidden && "opacity-40")} />
                <span className={cn("truncate", l.hidden ? "text-muted line-through" : "text-cream")}>{name(l)}</span>
              </button>
              <IconButton label={l.hidden ? `Show ${name(l)}` : `Hide ${name(l)}`} onClick={() => updateLayer(view.key, l.id, { hidden: !l.hidden })}>
                {l.hidden ? "◌" : "●"}
              </IconButton>
              <IconButton label={`Bring ${name(l)} forward`} disabled={i === 0} onClick={() => moveLayer(view.key, l.id, 1)}>
                ↑
              </IconButton>
              <IconButton label={`Send ${name(l)} back`} disabled={i === ordered.length - 1} onClick={() => moveLayer(view.key, l.id, -1)}>
                ↓
              </IconButton>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        className={cn(link, "mt-2")}
        onClick={() => window.confirm(`Remove all ${layers.length} layers from ${view.label.toLowerCase()}?`) && clearView(view.key)}
      >
        clear this view
      </button>
    </div>
  );
}

function IconButton({ children, label, onClick, disabled }: { children: React.ReactNode; label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base text-brown transition-colors hover:bg-sage/15 disabled:opacity-30"
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------- adjust */

function Toggle({ label, hint, on, onChange }: { label: string; hint: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border border-line bg-cream-soft/60 px-3 py-2 text-left"
    >
      <span>
        <span className="block text-sm text-cream">{label}</span>
        <span className="block text-xs text-muted">{hint}</span>
      </span>
      <span className={cn("relative h-6 w-10 shrink-0 rounded-full transition-colors", on ? "bg-olive" : "bg-beige")}>
        <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-paper shadow transition-all", on ? "left-[1.125rem]" : "left-0.5")} />
      </span>
    </button>
  );
}

function Slider({ label, value, min, max, step, onChange, format }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; format: (v: number) => string }) {
  return (
    <label className="block text-sm text-muted">
      <span className="flex justify-between">
        <span>{label}</span>
        <span className="tabular-nums text-cream-2">{format(value)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 block h-8 w-full accent-olive"
      />
    </label>
  );
}

export function AdjustPanel({ view }: { view: PlannerView }) {
  const layer = usePlanner((s) => s.layers[view.key].find((l) => l.id === s.selectedId) ?? null);
  const updateLayer = usePlanner((s) => s.updateLayer);
  const removeLayer = usePlanner((s) => s.removeLayer);
  const duplicateLayer = usePlanner((s) => s.duplicateLayer);
  const moveLayer = usePlanner((s) => s.moveLayer);
  const [cropping, setCropping] = useState(false);

  if (!layer) return <p className="text-sm text-muted">Select a layer on the shoe (or in Layers) to adjust it.</p>;
  const set = (patch: Partial<Layer>) => updateLayer(view.key, layer.id, patch);

  return (
    <div className="space-y-3">
      <Slider label="size" value={layer.w} min={0.02} max={1.6} step={0.005} onChange={(w) => set({ w })} format={(v) => `${Math.round(v * 100)}%`} />
      <Slider label="turn" value={layer.rotation} min={-180} max={180} step={1} onChange={(rotation) => set({ rotation })} format={(v) => `${Math.round(v)}°`} />
      <Slider label="opacity" value={layer.opacity} min={0.1} max={1} step={0.01} onChange={(opacity) => set({ opacity })} format={(v) => `${Math.round(v * 100)}%`} />
      <Toggle label="Paint look" hint="Leather, light and creases show through." on={layer.paint} onChange={(paint) => set({ paint })} />
      <Toggle label="Clip to shoe" hint="Hide what falls off the shoe." on={layer.clip} onChange={(clip) => set({ clip })} />
      <div className="flex flex-wrap gap-2 pt-1">
        <button type="button" className={chip} onClick={() => setCropping(true)}>
          crop
        </button>
        <button type="button" className={chip} onClick={() => set({ flipX: !layer.flipX })} aria-pressed={layer.flipX}>
          flip
        </button>
        <button type="button" className={chip} onClick={() => duplicateLayer(view.key, layer.id)}>
          duplicate
        </button>
        <button type="button" className={chip} onClick={() => moveLayer(view.key, layer.id, 1)}>
          forward
        </button>
        <button type="button" className={chip} onClick={() => moveLayer(view.key, layer.id, -1)}>
          back
        </button>
        <button type="button" className={cn(chip, "text-rose-ink")} onClick={() => removeLayer(view.key, layer.id)}>
          remove
        </button>
      </div>
      {cropping && (
        <CropDialog
          layer={layer}
          onClose={() => setCropping(false)}
          onApply={(crop) => {
            // keep the image's on-shoe scale: width follows the crop's width
            const d = assetDims(layer.assetId);
            const k = crop.w / layer.crop.w;
            set({ crop, w: d ? Math.max(0.02, layer.w * k) : layer.w });
            setCropping(false);
          }}
        />
      )}
    </div>
  );
}

/* ----------------------------------------------------------------- together */

export function TogetherPanel({ which, pair }: { which: TogetherKey; pair: PlannerPair }) {
  const feetTogether = usePlanner((s) => s.feetTogether);
  const innerLayout = usePlanner((s) => s.innerLayout);
  const setFeetTogether = usePlanner((s) => s.setFeetTogether);
  const setInnerLayout = usePlanner((s) => s.setInnerLayout);
  const setScreen = usePlanner((s) => s.setScreen);
  const layers = usePlanner((s) => s.layers);
  const version = usePlanner((s) => s.imagesVersion);
  const [busy, setBusy] = useState(false);

  const doExport = async () => {
    const layout = layoutFor(which, pair, which !== "pair" && feetTogether ? 0 : 1, innerLayout, version);
    if (!layout) return;
    setBusy(true);
    try {
      await exportComposite(which, layout, pair, layers, version);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      {which === "inner" && (
        <>
          <Toggle
            label="Feet together"
            hint="Slide them until they touch, for one scene across both (a mountain split in two)."
            on={feetTogether}
            onChange={setFeetTogether}
          />
          <div role="radiogroup" aria-label="How the inner sides meet" className="grid grid-cols-2 gap-2">
            {(
              [
                ["soles", "Soles together", "folded open, toes up"],
                ["toes", "Toe to toe", "sole down, toes meet"],
              ] as const
            ).map(([k, label, hint]) => (
              <button
                key={k}
                type="button"
                role="radio"
                aria-checked={innerLayout === k}
                onClick={() => setInnerLayout(k)}
                className={cn(
                  "min-h-11 rounded-xl border px-3 py-2 text-left",
                  innerLayout === k ? "border-olive/50 bg-sage/15" : "border-line bg-cream-soft/60",
                )}
              >
                <span className="block text-sm text-cream">{label}</span>
                <span className="block text-xs text-muted">{hint}</span>
              </button>
            ))}
          </div>
        </>
      )}
      <button type="button" className={chip} onClick={doExport} disabled={busy}>
        {busy ? "saving…" : "↓ save as PNG"}
      </button>
      <div>
        <p className="eyebrow mt-3 mb-1 text-gold-ink">edit a view</p>
        <ul className="flex flex-wrap gap-x-4">
          {viewsIn(which).map((k) => (
            <li key={k}>
              <button type="button" className={link} onClick={() => setScreen({ kind: "view", key: k })}>
                {pair.views[k].label}
                {pair.views[k].approximate ? " ≈" : ""}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ project */

export function ProjectPanel({ view, pair }: { view: PlannerView | null; pair: PlannerPair }) {
  const saveState = usePlanner((s) => s.saveState);
  const layers = usePlanner((s) => s.layers);
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!window.confirm("Replace the current plan with this file? (Export first if you want to keep it.)")) return;
    setBusy(true);
    try {
      await importProject(file);
      setMsg("Imported.");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Couldn't import that file.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">
        {saveState === "unavailable"
          ? "This browser won't let the planner save (private window?). Export to keep your work."
          : "Saves itself in this browser as you go. Export a file to back it up or move it to another device."}
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={chip}
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await exportProject();
              setMsg("Exported.");
            } catch {
              setMsg("Couldn't export.");
            } finally {
              setBusy(false);
            }
          }}
        >
          ↓ export plan
        </button>
        <button type="button" className={chip} disabled={busy} onClick={() => fileRef.current?.click()}>
          ↑ import plan
        </button>
        {view && (
          <button type="button" className={chip} onClick={() => exportView(view, pair.id, layers[view.key])}>
            ↓ {view.label.toLowerCase()} as PNG
          </button>
        )}
        <input ref={fileRef} type="file" accept="application/json,.json" onChange={onImport} className="hidden" aria-label="Import a plan" />
      </div>
      {msg && (
        <p className="text-sm text-muted" role="status">
          {msg}
        </p>
      )}
      <details className="rounded-xl border border-line bg-cream-soft/60 px-3 py-2 text-sm text-muted">
        <summary className="flex min-h-11 cursor-pointer items-center text-cream">About these photos</summary>
        <ul className="mt-1 mb-2 list-disc space-y-1 pl-5">
          {pair.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
          {Object.values(pair.views)
            .filter((v) => v.approximate)
            .map((v) => (
              <li key={v.key}>
                <strong className="font-medium text-cream-2">{v.label}</strong>: {v.from}, {v.approximate}.
              </li>
            ))}
        </ul>
      </details>
    </div>
  );
}
