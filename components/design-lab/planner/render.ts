/**
 * Photo planner rendering — plain canvas 2D, shared by the editor, the live
 * "together" composites and the PNG export, so what you edit is exactly
 * what you export.
 *
 * A view = its shoe cut-out + art layers. Each layer is drawn into a scratch
 * canvas, optionally clipped to the shoe's alpha ("clip to shoe"), then laid
 * on with `multiply` ("paint look": the leather's light, creases and stitches
 * show through, like paint) or plainly (sticker look).
 */

import { ZONE_STEP, zoneOrder, zones as zoneDefs, type PlannerPair, type PlannerView, type PlannerViewKey, type TogetherKey, type ZoneId } from "@/data/planner";
import type { InnerLayout, Layer } from "./store";
import { motifs, motifSrc } from "./motifs";

/* ------------------------------------------------------------------ images */

const loaded = new Map<string, HTMLImageElement>();
const loadedSrc = new Map<string, string>();
const loading = new Set<string>();
let listener: () => void = () => {};

/** Called whenever an image finishes loading (the store bumps a version). */
export function setImageListener(fn: () => void) {
  listener = fn;
}

function imageFor(key: string, src: string): HTMLImageElement | undefined {
  if (typeof window === "undefined") return undefined; // server render: "still loading"
  const hit = loaded.get(key);
  // compare with what we asked for: img.src comes back as an absolute URL
  if (hit && loadedSrc.get(key) === src) return hit;
  if (loading.has(key + src)) return undefined;
  loading.add(key + src);
  const img = new Image();
  img.decoding = "async";
  img.onload = () => {
    loading.delete(key + src);
    loaded.set(key, img);
    loadedSrc.set(key, src);
    alphaCache.delete(key);
    listener();
  };
  img.onerror = () => loading.delete(key + src);
  img.src = src;
  return undefined;
}

/** Where each library image can be loaded from (object URLs for uploads). */
export const assetSrc = new Map<string, string>(motifs.map((m) => [m.id, motifSrc(m)]));

export const assetImage = (id: string) => {
  const src = assetSrc.get(id);
  return src ? imageFor(id, src) : undefined;
};
export const viewImage = (view: PlannerView) => imageFor(view.src, view.src);
/** Has this view's photo loaded? `imagesVersion` is a cache key (see layoutFor). */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const viewLoaded = (view: PlannerView, imagesVersion: number) => !!viewImage(view);

export function preloadViews(pair: PlannerPair) {
  for (const v of Object.values(pair.views)) {
    viewImage(v);
    if (v.zonesSrc) imageFor(v.zonesSrc, v.zonesSrc);
  }
}

/* ------------------------------------------------- shoe outline (alpha map) */

export interface Bounds {
  x: number;
  y: number;
  w: number;
  h: number;
}
interface AlphaInfo {
  bounds: Bounds;
  alpha: Uint8ClampedArray;
  width: number;
}
const alphaCache = new Map<string, AlphaInfo>();

/** Tight box around the shoe's pixels + the alpha map (for taps). */
export function alphaInfo(view: PlannerView): AlphaInfo | undefined {
  const cached = alphaCache.get(view.src);
  if (cached) return cached;
  const img = viewImage(view);
  if (!img) return undefined;
  const c = document.createElement("canvas");
  c.width = view.width;
  c.height = view.height;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, view.width, view.height);
  const data = ctx.getImageData(0, 0, view.width, view.height).data;
  const alpha = new Uint8ClampedArray(view.width * view.height);
  let x0 = view.width, y0 = view.height, x1 = -1, y1 = -1;
  for (let y = 0; y < view.height; y++) {
    for (let x = 0; x < view.width; x++) {
      const a = data[(y * view.width + x) * 4 + 3];
      alpha[y * view.width + x] = a;
      if (a > 24) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  const info: AlphaInfo =
    x1 < 0
      ? { bounds: { x: 0, y: 0, w: view.width, h: view.height }, alpha, width: view.width }
      : { bounds: { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 }, alpha, width: view.width };
  alphaCache.set(view.src, info);
  return info;
}

/* ------------------------------------------------------------ paint zones */

interface ZoneData {
  ids: Uint8Array; // zone value per pixel, 0 = not shoe
  present: ZoneId[];
}
const zoneCache = new Map<string, ZoneData>();
const zoneByValue = new Map<number, ZoneId>(Object.entries(zoneDefs).map(([id, z]) => [z.value, id as ZoneId]));

/** The view's zone map, decoded (undefined while loading, or without one). */
export function zoneData(view: PlannerView): ZoneData | undefined {
  if (!view.zonesSrc) return undefined;
  const hit = zoneCache.get(view.zonesSrc);
  if (hit) return hit;
  const img = imageFor(view.zonesSrc, view.zonesSrc);
  if (!img) return undefined;
  const c = document.createElement("canvas");
  c.width = view.width;
  c.height = view.height;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, 0, 0, view.width, view.height);
  const px = ctx.getImageData(0, 0, view.width, view.height).data;
  const ids = new Uint8Array(view.width * view.height);
  const seen = new Set<number>();
  for (let i = 0; i < ids.length; i++) {
    const v = Math.round(px[i * 4] / ZONE_STEP); // rounding shrugs off any colour-management drift
    ids[i] = v;
    if (v) seen.add(v);
  }
  const data = { ids, present: zoneOrder.filter((z) => seen.has(zoneDefs[z].value)) };
  zoneCache.set(view.zonesSrc, data);
  return data;
}

/** The zone at a point given as fractions of the view (null off the shoe). */
export function zoneAt(view: PlannerView, fx: number, fy: number): ZoneId | null {
  const zd = zoneData(view);
  if (!zd) return null;
  const x = Math.floor(fx * view.width), y = Math.floor(fy * view.height);
  if (x < 0 || y < 0 || x >= view.width || y >= view.height) return null;
  return zoneByValue.get(zd.ids[y * view.width + x]) ?? null;
}

const maskCache = new Map<string, HTMLCanvasElement>();

/** Alpha mask of some zones: the shoe's own soft edge, cut to those panels. */
function zoneMask(view: PlannerView, sel: ZoneId[]): HTMLCanvasElement | null {
  const zd = zoneData(view);
  const info = alphaInfo(view);
  if (!zd || !info) return null;
  const key = `${view.zonesSrc}|${[...sel].sort().join(",")}`;
  const hit = maskCache.get(key);
  if (hit) return hit;
  const want = new Set(sel.map((z) => zoneDefs[z].value));
  const c = document.createElement("canvas");
  c.width = view.width;
  c.height = view.height;
  const ctx = c.getContext("2d")!;
  const out = ctx.createImageData(view.width, view.height);
  for (let i = 0; i < zd.ids.length; i++) {
    if (want.has(zd.ids[i])) out.data[i * 4 + 3] = info.alpha[i];
  }
  ctx.putImageData(out, 0, 0);
  maskCache.set(key, c);
  return c;
}

/** What a layer is cropped to: its zones, else the whole shoe; null = no crop. */
function clipFor(view: PlannerView, layer: Layer, base: HTMLImageElement): CanvasImageSource | null {
  if (!layer.clip) return null;
  if (layer.zones && view.zonesSrc) return zoneMask(view, layer.zones) ?? base;
  return base;
}

const gridCache = new Map<string, Uint8ClampedArray>();
const GRID = 48;
/** A coarse alpha grid of a library image, to see which zones it really covers. */
function assetGrid(id: string): Uint8ClampedArray | undefined {
  const hit = gridCache.get(id);
  if (hit) return hit;
  const img = assetImage(id);
  if (!img || !img.naturalWidth) return undefined;
  const c = document.createElement("canvas");
  c.width = c.height = GRID;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, GRID, GRID);
  const d = ctx.getImageData(0, 0, GRID, GRID).data;
  const a = new Uint8ClampedArray(GRID * GRID);
  for (let i = 0; i < a.length; i++) a[i] = d[i * 4 + 3];
  gridCache.set(id, a);
  return a;
}

/**
 * Which zones the visible part of a layer lands on, and how much (samples).
 * Null while the zone map or the image is still loading.
 */
export function layerZoneCoverage(view: PlannerView, layer: Layer): Map<ZoneId, number> | null {
  const zd = zoneData(view);
  const g = assetGrid(layer.assetId);
  const img = assetImage(layer.assetId);
  if (!zd || !g || !img) return null;
  const N = 40;
  const srcW = layer.crop.w * img.naturalWidth, srcH = layer.crop.h * img.naturalHeight;
  const dw = layer.w * view.width, dh = (dw * srcH) / srcW;
  const r = (layer.rotation * Math.PI) / 180, cos = Math.cos(r), sin = Math.sin(r);
  const cx = layer.x * view.width, cy = layer.y * view.height;
  const counts = new Map<ZoneId, number>();
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const u = (i + 0.5) / N, v = (j + 0.5) / N;
      const gx = Math.min(GRID - 1, Math.floor((layer.crop.x + u * layer.crop.w) * GRID));
      const gy = Math.min(GRID - 1, Math.floor((layer.crop.y + v * layer.crop.h) * GRID));
      if (g[gy * GRID + gx] < 40) continue; // transparent part of the image
      const lx = (u - 0.5) * dw * (layer.flipX ? -1 : 1), ly = (v - 0.5) * dh;
      const x = Math.floor(cx + lx * cos - ly * sin), y = Math.floor(cy + lx * sin + ly * cos);
      if (x < 0 || y < 0 || x >= view.width || y >= view.height) continue;
      const z = zoneByValue.get(zd.ids[y * view.width + x]);
      if (z) counts.set(z, (counts.get(z) ?? 0) + 1);
    }
  }
  return counts;
}

/** Zones a layer reaches into but doesn't show on yet (ignoring a few stray samples). */
export function spillZones(view: PlannerView, layer: Layer): ZoneId[] {
  if (!layer.clip || !layer.zones) return [];
  const cov = layerZoneCoverage(view, layer);
  if (!cov) return [];
  const total = [...cov.values()].reduce((a, b) => a + b, 0);
  const min = Math.max(3, total * 0.01);
  return zoneOrder.filter((z) => !layer.zones!.includes(z) && (cov.get(z) ?? 0) >= min);
}

/* ------------------------------------------------------------ single views */

type Dims = (assetId: string) => { width: number; height: number } | undefined;

/** Size of a layer in view pixels (before rotation). */
export function layerSize(view: PlannerView, layer: Layer, dims: Dims) {
  const d = dims(layer.assetId) ?? { width: 1, height: 1 };
  const w = layer.w * view.width;
  const h = (w * (layer.crop.h * d.height)) / (layer.crop.w * d.width);
  return { w, h };
}

/** The four corners of a layer in view pixels: TL, TR, BR, BL. */
export function layerCorners(view: PlannerView, layer: Layer, dims: Dims) {
  const { w, h } = layerSize(view, layer, dims);
  const cx = layer.x * view.width;
  const cy = layer.y * view.height;
  const r = (layer.rotation * Math.PI) / 180;
  const cos = Math.cos(r), sin = Math.sin(r);
  return ([[-1, -1], [1, -1], [1, 1], [-1, 1]] as const).map(([sx, sy]) => {
    const lx = (sx * w) / 2, ly = (sy * h) / 2;
    return { x: cx + lx * cos - ly * sin, y: cy + lx * sin + ly * cos };
  });
}

/** Topmost visible layer under a point (view pixels). */
export function hitLayer(view: PlannerView, layers: Layer[], px: number, py: number, dims: Dims): Layer | null {
  for (let i = layers.length - 1; i >= 0; i--) {
    const l = layers[i];
    if (l.hidden) continue;
    const { w, h } = layerSize(view, l, dims);
    const r = (-l.rotation * Math.PI) / 180;
    const dx = px - l.x * view.width, dy = py - l.y * view.height;
    const lx = dx * Math.cos(r) - dy * Math.sin(r);
    const ly = dx * Math.sin(r) + dy * Math.cos(r);
    if (Math.abs(lx) <= w / 2 && Math.abs(ly) <= h / 2) return l;
  }
  return null;
}

let scratch: HTMLCanvasElement | null = null;
function scratchOf(w: number, h: number) {
  scratch ??= document.createElement("canvas");
  if (scratch.width !== w) scratch.width = w;
  if (scratch.height !== h) scratch.height = h;
  return scratch;
}

/**
 * Draw a view (shoe + layers) into ctx. `t` maps view pixels to canvas
 * pixels. Returns false while the shoe photo is still loading.
 */
export interface RenderOptions {
  /** This layer's cropped-away part is shown faintly (editing aid). */
  ghostId?: string | null;
  /** Tint these zones (hovering a zone button). */
  highlight?: ZoneId[] | null;
}

export function renderView(
  ctx: CanvasRenderingContext2D,
  view: PlannerView,
  layers: Layer[],
  t: DOMMatrix,
  opts: RenderOptions = {},
): boolean {
  const base = viewImage(view);
  if (!base) return false;
  ctx.save();
  ctx.setTransform(t);
  ctx.drawImage(base, 0, 0, view.width, view.height);
  ctx.restore();

  const cw = ctx.canvas.width, ch = ctx.canvas.height;
  for (const layer of layers) {
    if (layer.hidden) continue;
    const img = assetImage(layer.assetId);
    if (!img || !img.naturalWidth) continue;
    const s = scratchOf(cw, ch);
    const sx = s.getContext("2d")!;
    sx.setTransform(1, 0, 0, 1, 0, 0);
    sx.globalCompositeOperation = "source-over";
    sx.globalAlpha = 1;
    sx.clearRect(0, 0, cw, ch);
    drawLayer(sx, view, layer, img, t);
    const clip = clipFor(view, layer, base);
    if (clip) {
      sx.setTransform(t);
      sx.globalCompositeOperation = "destination-in";
      sx.drawImage(clip, 0, 0, view.width, view.height);
    }
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = layer.opacity;
    ctx.globalCompositeOperation = layer.paint ? "multiply" : "source-over";
    ctx.drawImage(s, 0, 0);
    ctx.restore();

    // the part the crop hides, faintly, so you can see what the zones cut off
    if (clip && opts.ghostId === layer.id) {
      sx.setTransform(1, 0, 0, 1, 0, 0);
      sx.globalCompositeOperation = "source-over";
      sx.clearRect(0, 0, cw, ch);
      drawLayer(sx, view, layer, img, t);
      sx.setTransform(t);
      sx.globalCompositeOperation = "destination-out";
      sx.drawImage(clip, 0, 0, view.width, view.height);
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 0.22;
      ctx.drawImage(s, 0, 0);
      ctx.restore();
    }
  }

  if (opts.highlight?.length) {
    const mask = zoneMask(view, opts.highlight);
    if (mask) {
      const s = scratchOf(cw, ch);
      const sx = s.getContext("2d")!;
      sx.setTransform(1, 0, 0, 1, 0, 0);
      sx.globalCompositeOperation = "source-over";
      sx.clearRect(0, 0, cw, ch);
      sx.setTransform(t);
      sx.drawImage(mask, 0, 0, view.width, view.height);
      sx.setTransform(1, 0, 0, 1, 0, 0);
      sx.globalCompositeOperation = "source-in";
      sx.fillStyle = "#5f6f52";
      sx.fillRect(0, 0, cw, ch);
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 0.38;
      ctx.drawImage(s, 0, 0);
      ctx.restore();
    }
  }
  return true;
}

/** One layer's image, placed, into a context whose canvas starts clean. */
function drawLayer(sx: CanvasRenderingContext2D, view: PlannerView, layer: Layer, img: HTMLImageElement, t: DOMMatrix) {
  sx.setTransform(t);
  const nw = img.naturalWidth, nh = img.naturalHeight;
  const srcW = layer.crop.w * nw, srcH = layer.crop.h * nh;
  const dw = layer.w * view.width, dh = (dw * srcH) / srcW;
  sx.translate(layer.x * view.width, layer.y * view.height);
  sx.rotate((layer.rotation * Math.PI) / 180);
  sx.scale(layer.flipX ? -1 : 1, 1);
  sx.drawImage(img, layer.crop.x * nw, layer.crop.y * nh, srcW, srcH, -dw / 2, -dh / 2, dw, dh);
}

/* A rendered copy of each view at its own resolution, for the composites. */
const viewCache = new Map<PlannerViewKey, { canvas: HTMLCanvasElement; layers: Layer[]; version: number }>();

export function viewCanvas(view: PlannerView, layers: Layer[], version: number): HTMLCanvasElement | null {
  const hit = viewCache.get(view.key);
  if (hit && hit.layers === layers && hit.version === version) return hit.canvas;
  const canvas = hit?.canvas ?? document.createElement("canvas");
  canvas.width = view.width;
  canvas.height = view.height;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, view.width, view.height);
  if (!renderView(ctx, view, layers, new DOMMatrix())) return null;
  viewCache.set(view.key, { canvas, layers, version });
  return canvas;
}

/* -------------------------------------------------------- together layouts */

export interface Placement {
  view: PlannerViewKey;
  /** Centre of the drawn shoe, composite units. */
  cx: number;
  cy: number;
  /** Drawn size before rotation. */
  w: number;
  h: number;
  /** Degrees: -90 turns the toe of a toe-right view upwards. */
  rot: 0 | 90 | -90;
  /** Tight box of the shoe inside its photo (source pixels). */
  src: Bounds;
}
export interface Label {
  text: string;
  x: number;
  y: number;
  align: CanvasTextAlign;
}
export interface Layout {
  width: number;
  height: number;
  /** Label size in composite units: scales with the layout so it stays readable on a phone. */
  fontSize: number;
  items: Placement[];
  labels: Label[];
}

const PAD = 48;
/** Label size for a composite this wide (~11px on a 390px phone). */
const fontFor = (width: number) => Math.max(30, width / 34);
const GAP = 170; // between the two shoes when apart

const labelFor = (v: PlannerView) => (v.approximate ? `${v.label} (mirrored)` : v.label);

/**
 * Where every shoe goes in a together view. `apart` is 1 when the shoes sit
 * apart, 0 when "feet together" has slid them until they touch.
 * Returns null until every photo involved has loaded.
 */
export function layoutFor(
  key: TogetherKey,
  pair: PlannerPair,
  apart: number,
  inner: InnerLayout,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- cache key: the React Compiler memoises calls on their arguments, so pass the image version to recompute once photos load
  imagesVersion: number,
): Layout | null {
  const V = pair.views;
  const b = (k: PlannerViewKey) => alphaInfo(V[k])?.bounds;
  const need: PlannerViewKey[] =
    key === "outer" ? ["leftOuter", "rightOuter"] : key === "inner" ? ["leftInner", "rightInner"] : (Object.keys(V) as PlannerViewKey[]);
  if (need.some((k) => !b(k))) return null;

  const items: Placement[] = [];
  const labels: Label[] = [];
  /** Place a shoe with its tight box's top-left at (x, y), scaled by s. */
  const put = (k: PlannerViewKey, x: number, y: number, s = 1, rot: Placement["rot"] = 0) => {
    const src = b(k)!;
    const w = src.w * s, h = src.h * s;
    const fw = rot ? h : w, fh = rot ? w : h;
    items.push({ view: k, cx: x + fw / 2, cy: y + fh / 2, w, h, rot, src });
    return { fw, fh };
  };

  if (key === "outer" || (key === "inner" && inner === "toes")) {
    // side by side, sole down, bottoms aligned
    const [l, r] = key === "outer" ? (["leftOuter", "rightOuter"] as const) : (["leftInner", "rightInner"] as const);
    const bl = b(l)!, br = b(r)!;
    const gap = GAP * apart;
    const width = PAD * 2 + bl.w + br.w + GAP;
    const shift = (GAP - gap) / 2; // slide towards the middle
    const rowH = Math.max(bl.h, br.h);
    const fs = fontFor(width);
    const top = PAD + fs * 1.8;
    put(l, PAD + shift, top + rowH - bl.h);
    put(r, PAD + shift + bl.w + gap, top + rowH - br.h);
    labels.push({ text: labelFor(V[l]), x: PAD + shift, y: PAD + fs, align: "left" });
    labels.push({ text: labelFor(V[r]), x: PAD + shift + bl.w + gap + br.w, y: PAD + fs, align: "right" });
    return { width, height: top + rowH + PAD, fontSize: fs, items, labels };
  }

  if (key === "inner") {
    // "feet together": both inner sides folded open around the soles, seen
    // from above as he would look down at his feet: toes up, soles in the
    // middle, left shoe on the left.
    const bl = b("leftInner")!, br = b("rightInner")!;
    const gap = GAP * apart;
    const width = PAD * 2 + bl.h + br.h + GAP;
    const shift = (GAP - gap) / 2;
    const fs = fontFor(width);
    const top = PAD + fs * 1.8;
    put("leftInner", PAD + shift, top, 1, -90);
    put("rightInner", PAD + shift + bl.h + gap, top, 1, 90);
    labels.push({ text: labelFor(V.leftInner), x: PAD + shift, y: PAD + fs, align: "left" });
    labels.push({ text: labelFor(V.rightInner), x: PAD + shift + bl.h + gap + br.h, y: PAD + fs, align: "right" });
    return { width, height: top + Math.max(bl.w, br.w) + PAD, fontSize: fs, items, labels };
  }

  // the pair: left shoe column, right shoe column; sides, then heels, then toes
  const colW = Math.max(...(["leftOuter", "rightOuter", "leftInner", "rightInner"] as const).map((k) => b(k)!.w));
  const gapX = 130;
  const cols = [PAD, PAD + colW + gapX];
  const width = PAD * 2 + colW * 2 + gapX;
  const fs = fontFor(width);
  const LABEL = fs * 1.7;
  let y = PAD;
  const sideH = Math.max(b("leftOuter")!.h, b("rightOuter")!.h);
  const row = (pairKeys: [PlannerViewKey, PlannerViewKey], height: number, scaleTo?: number) => {
    let rowH = 0;
    const placed = pairKeys.map((k, i) => {
      const src = b(k)!;
      const s = scaleTo ? scaleTo / src.h : 1;
      rowH = Math.max(rowH, src.h * s);
      return { k, i, s, src };
    });
    rowH = Math.max(rowH, height);
    for (const { k, i, s, src } of placed) {
      const w = src.w * s, h = src.h * s;
      const x = cols[i] + (colW - w) / 2;
      put(k, x, y + LABEL + rowH - h, s);
      labels.push({ text: labelFor(V[k]), x: cols[i] + colW / 2, y: y + fs, align: "center" });
    }
    y += LABEL + rowH + 36;
  };
  row(["leftOuter", "rightOuter"], sideH);
  row(["leftInner", "rightInner"], 0);
  row(["leftHeel", "rightHeel"], 0, sideH * 0.98);
  row(["leftToe", "rightToe"], 0, colW * 0.62);
  return { width, height: y - 36 + PAD, fontSize: fs, items, labels };
}

/** Draw a composite. `scale` maps composite units to canvas pixels. */
export function drawComposite(
  ctx: CanvasRenderingContext2D,
  layout: Layout,
  pair: PlannerPair,
  layers: Record<PlannerViewKey, Layer[]>,
  version: number,
  scale: number,
  opts: { labels?: boolean; labelColor?: string; font?: string; highlight?: PlannerViewKey | null } = {},
) {
  for (const it of layout.items) {
    const c = viewCanvas(pair.views[it.view], layers[it.view], version);
    if (!c) continue;
    ctx.save();
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.translate(it.cx, it.cy);
    ctx.rotate((it.rot * Math.PI) / 180);
    if (opts.highlight === it.view) {
      ctx.shadowColor = "rgba(95,111,82,0.55)";
      ctx.shadowBlur = 28;
    }
    ctx.drawImage(c, it.src.x, it.src.y, it.src.w, it.src.h, -it.w / 2, -it.h / 2, it.w, it.h);
    ctx.restore();
  }
  if (opts.labels !== false) {
    ctx.save();
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.fillStyle = opts.labelColor ?? "#685f52";
    ctx.font = `500 ${Math.round(layout.fontSize)}px ${opts.font ?? "system-ui, sans-serif"}`;
    ctx.textBaseline = "alphabetic";
    for (const l of layout.labels) {
      ctx.textAlign = l.align;
      ctx.fillText(l.text, l.x, l.y);
    }
    ctx.restore();
  }
}

/** Which shoe is under a point (composite units)? Exact outline first, then its box. */
export function hitComposite(layout: Layout, pair: PlannerPair, x: number, y: number): PlannerViewKey | null {
  const local = (it: Placement) => {
    const r = (-it.rot * Math.PI) / 180;
    const dx = x - it.cx, dy = y - it.cy;
    return { lx: dx * Math.cos(r) - dy * Math.sin(r), ly: dx * Math.sin(r) + dy * Math.cos(r) };
  };
  for (let i = layout.items.length - 1; i >= 0; i--) {
    const it = layout.items[i];
    const { lx, ly } = local(it);
    if (Math.abs(lx) > it.w / 2 || Math.abs(ly) > it.h / 2) continue;
    const info = alphaInfo(pair.views[it.view]);
    if (!info) continue;
    const sx = Math.floor(it.src.x + (lx / it.w + 0.5) * it.src.w);
    const sy = Math.floor(it.src.y + (ly / it.h + 0.5) * it.src.h);
    if (info.alpha[sy * info.width + sx] > 24) return it.view;
  }
  for (let i = layout.items.length - 1; i >= 0; i--) {
    const { lx, ly } = local(layout.items[i]);
    if (Math.abs(lx) <= layout.items[i].w / 2 + 20 && Math.abs(ly) <= layout.items[i].h / 2 + 20) return layout.items[i].view;
  }
  return null;
}

/* ------------------------------------------------------------------ export */

export const PAPER = "#f5f0e6";

export function pageFont() {
  try {
    return getComputedStyle(document.body).fontFamily || "system-ui, sans-serif";
  } catch {
    return "system-ui, sans-serif";
  }
}

function download(canvas: HTMLCanvasElement, filename: string) {
  return new Promise<void>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error("export failed"));
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      resolve();
    }, "image/png");
  });
}

const stamp = () => new Date().toISOString().slice(0, 10);

export async function exportComposite(key: TogetherKey, layout: Layout, pair: PlannerPair, layers: Record<PlannerViewKey, Layer[]>, version: number) {
  const c = document.createElement("canvas");
  c.width = Math.ceil(layout.width);
  c.height = Math.ceil(layout.height);
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, c.width, c.height);
  drawComposite(ctx, layout, pair, layers, version, 1, { font: pageFont() });
  await download(c, `${pair.id}-${key}-together-${stamp()}.png`);
}

export async function exportView(view: PlannerView, pairId: string, layers: Layer[]) {
  const c = document.createElement("canvas");
  c.width = view.width;
  c.height = view.height;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, c.width, c.height);
  // render on transparent first so "multiply" outside the shoe stays true to colour
  const inner = document.createElement("canvas");
  inner.width = view.width;
  inner.height = view.height;
  renderView(inner.getContext("2d")!, view, layers, new DOMMatrix());
  ctx.drawImage(inner, 0, 0);
  const slug = view.label.toLowerCase().replace(/\s+/g, "-");
  await download(c, `${pairId}-${slug}-${stamp()}.png`);
}

/** Download a text file (project export). */
export function downloadText(text: string, filename: string, type = "application/json") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
export { stamp };

/** Zones for an image placed at (fx, fy): the panel under it, else the view's default. */
export function zonesAt(view: PlannerView, fx: number, fy: number): ZoneId[] | undefined {
  if (!view.zonesSrc) return undefined;
  const z = zoneAt(view, fx, fy);
  return [z ?? view.defaultZone ?? "side"];
}
