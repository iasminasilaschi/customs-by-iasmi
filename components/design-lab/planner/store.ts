"use client";

/**
 * Photo planner state: one list of art layers per view (side of a shoe),
 * the "together" settings, and what's on screen. Persisted to IndexedDB by
 * usePlannerAutosave (PhotoPlanner.tsx), not by zustand middleware, because
 * the library images are Blobs.
 */

import { create } from "zustand";
import type { PlannerViewKey, TogetherKey } from "@/data/planner";

export interface Crop {
  /** Fractions of the source image. */
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Layer {
  id: string;
  assetId: string;
  /** Centre, as fractions of the view's width / height. */
  x: number;
  y: number;
  /** Width as a fraction of the view's width. */
  w: number;
  /** Degrees, clockwise. */
  rotation: number;
  flipX: boolean;
  opacity: number;
  /** Multiply onto the leather so the shoe's light and creases show through. */
  paint: boolean;
  /** Hide whatever falls outside the shoe's outline. */
  clip: boolean;
  crop: Crop;
  hidden: boolean;
}

export interface AssetMeta {
  id: string;
  name: string;
  width: number;
  height: number;
  kind: "upload" | "motif";
}

export type Screen = { kind: "together"; key: TogetherKey } | { kind: "view"; key: PlannerViewKey };

export type InnerLayout = "soles" | "toes";

export const emptyLayers = (): Record<PlannerViewKey, Layer[]> => ({
  leftOuter: [],
  leftInner: [],
  rightOuter: [],
  rightInner: [],
  leftHeel: [],
  rightHeel: [],
  leftToe: [],
  rightToe: [],
});

/** What gets saved / exported for a pair. */
export interface ProjectData {
  pairId: string;
  layers: Record<PlannerViewKey, Layer[]>;
  feetTogether: boolean;
  innerLayout: InnerLayout;
  savedAt?: number;
}

export const FULL_CROP: Crop = { x: 0, y: 0, w: 1, h: 1 };
export const MAX_LAYERS_PER_VIEW = 24;

export const newId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

interface PlannerState extends ProjectData {
  hydrated: boolean;
  assets: AssetMeta[];
  screen: Screen;
  selectedId: string | null;
  /** Bumped whenever an image finishes loading, so canvases redraw. */
  imagesVersion: number;
  saveState: "idle" | "saving" | "saved" | "unavailable";

  setScreen: (s: Screen) => void;
  select: (id: string | null) => void;
  addLayer: (view: PlannerViewKey, asset: AssetMeta, viewAspect: number) => string | null;
  updateLayer: (view: PlannerViewKey, id: string, patch: Partial<Layer>) => void;
  removeLayer: (view: PlannerViewKey, id: string) => void;
  duplicateLayer: (view: PlannerViewKey, id: string) => void;
  /** +1 = towards the front, -1 = towards the back. */
  moveLayer: (view: PlannerViewKey, id: string, dir: 1 | -1) => void;
  clearView: (view: PlannerViewKey) => void;
  setFeetTogether: (v: boolean) => void;
  setInnerLayout: (v: InnerLayout) => void;
  addAssets: (a: AssetMeta[]) => void;
  removeAsset: (id: string) => void;
  loadProject: (p: ProjectData) => void;
  bumpImages: () => void;
  setSaveState: (s: PlannerState["saveState"]) => void;
  setHydrated: () => void;
}

const mapView = (
  s: PlannerState,
  view: PlannerViewKey,
  fn: (layers: Layer[]) => Layer[],
): Pick<PlannerState, "layers"> => ({ layers: { ...s.layers, [view]: fn(s.layers[view]) } });

export const usePlanner = create<PlannerState>()((set, get) => ({
  pairId: "japan",
  layers: emptyLayers(),
  feetTogether: false,
  innerLayout: "soles",
  hydrated: false,
  assets: [],
  screen: { kind: "together", key: "pair" },
  selectedId: null,
  imagesVersion: 0,
  saveState: "idle",

  setScreen: (screen) => set({ screen, selectedId: null }),
  select: (selectedId) => set({ selectedId }),

  addLayer: (view, asset, viewAspect) => {
    if (get().layers[view].length >= MAX_LAYERS_PER_VIEW) return null;
    const id = newId("layer");
    // start at roughly a third of the view, never taller than ~70% of it
    const imgAspect = asset.height / asset.width; // h / w
    const wide = viewAspect < 1; // side views are wide (h/w < 1)
    let w = wide ? 0.32 : 0.6;
    const hFrac = (w * imgAspect) / viewAspect;
    if (hFrac > 0.7) w *= 0.7 / hFrac;
    const layer: Layer = {
      id,
      assetId: asset.id,
      x: 0.5,
      y: wide ? 0.45 : 0.42,
      w,
      rotation: 0,
      flipX: false,
      opacity: 1,
      paint: true,
      clip: true,
      crop: { ...FULL_CROP },
      hidden: false,
    };
    set((s) => ({ ...mapView(s, view, (l) => [...l, layer]), selectedId: id }));
    return id;
  },
  updateLayer: (view, id, patch) =>
    set((s) => mapView(s, view, (l) => l.map((x) => (x.id === id ? { ...x, ...patch } : x)))),
  removeLayer: (view, id) =>
    set((s) => ({
      ...mapView(s, view, (l) => l.filter((x) => x.id !== id)),
      selectedId: s.selectedId === id ? null : s.selectedId,
    })),
  duplicateLayer: (view, id) => {
    const src = get().layers[view].find((x) => x.id === id);
    if (!src || get().layers[view].length >= MAX_LAYERS_PER_VIEW) return;
    const copy = { ...src, id: newId("layer"), x: Math.min(0.95, src.x + 0.04), y: Math.min(0.95, src.y + 0.04) };
    set((s) => ({ ...mapView(s, view, (l) => [...l, copy]), selectedId: copy.id }));
  },
  moveLayer: (view, id, dir) =>
    set((s) =>
      mapView(s, view, (l) => {
        const i = l.findIndex((x) => x.id === id);
        const j = i + dir;
        if (i < 0 || j < 0 || j >= l.length) return l;
        const next = [...l];
        [next[i], next[j]] = [next[j], next[i]];
        return next;
      }),
    ),
  clearView: (view) => set((s) => ({ ...mapView(s, view, () => []), selectedId: null })),
  setFeetTogether: (feetTogether) => set({ feetTogether }),
  setInnerLayout: (innerLayout) => set({ innerLayout }),
  addAssets: (a) =>
    set((s) => {
      const ids = new Set(a.map((x) => x.id));
      return { assets: [...s.assets.filter((x) => !ids.has(x.id)), ...a] };
    }),
  removeAsset: (id) =>
    set((s) => {
      const layers = { ...s.layers };
      for (const k of Object.keys(layers) as PlannerViewKey[]) layers[k] = layers[k].filter((l) => l.assetId !== id);
      return { assets: s.assets.filter((x) => x.id !== id), layers, selectedId: null };
    }),
  loadProject: (p) =>
    set({
      pairId: p.pairId,
      layers: { ...emptyLayers(), ...p.layers },
      feetTogether: p.feetTogether,
      innerLayout: p.innerLayout,
      selectedId: null,
    }),
  bumpImages: () => set((s) => ({ imagesVersion: s.imagesVersion + 1 })),
  setSaveState: (saveState) => set({ saveState }),
  setHydrated: () => set({ hydrated: true }),
}));

export const projectOf = (s: ProjectData): ProjectData => ({
  pairId: s.pairId,
  layers: s.layers,
  feetTogether: s.feetTogether,
  innerLayout: s.innerLayout,
});
