"use client";

/**
 * Design Lab studio state — one zustand store shared by the 3D scene and
 * the flat UI panels, so hovering a part in the list highlights it on the
 * shoe and vice-versa.
 *
 * Colours, finishes, artwork and the inspiration note persist to
 * localStorage (skipHydration — the studio rehydrates in an effect to stay
 * SSR-safe). Selection, hover, placing and camera state are session-only.
 */

import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";
import {
  defaultColorway,
  defaultFinish,
  presetColorways,
  type FinishKey,
  type LetteringFontId,
  type ShoePartKey,
} from "@/data/shoe";

export type ViewKey = "threeQuarter" | "lateral" | "medial" | "front" | "back" | "top";

type Vec3 = [number, number, number];

/** A photo or a piece of lettering projected onto the shoe. */
export interface Artwork {
  id: string;
  kind: "photo" | "text";
  /** Image data URL (text is pre-rendered to an image too). */
  src: string;
  /** height / width of the image. */
  aspect: number;
  text?: string;
  font?: LetteringFontId;
  ink?: string;
  /** Target mesh name + part; null while waiting to be placed. */
  mesh: string | null;
  part: ShoePartKey | null;
  /** Anchor point + surface normal in the target mesh's local space. */
  point: Vec3;
  normal: Vec3;
  /** Width in scene units (the shoe is 2.4 long). */
  size: number;
  /** Spin around the surface normal, degrees. */
  angle: number;
}

export type NewArtwork = Pick<Artwork, "kind" | "src" | "aspect" | "text" | "font" | "ink">;

interface StudioState {
  colors: Record<ShoePartKey, string>;
  finish: Record<ShoePartKey, FinishKey>;
  artwork: Artwork[];
  selected: ShoePartKey | null;
  hovered: ShoePartKey | null;
  note: string;
  /** Artwork waiting for a click on the shoe. */
  placing: string | null;
  /** Artwork whose controls are open. */
  activeArt: string | null;
  /** Camera preset request; nonce lets the same view be re-requested. */
  view: ViewKey;
  viewNonce: number;
  /** Gentle auto-spin until the visitor takes the wheel. */
  autoSpin: boolean;
  /** Registered by the 3D viewer; renders a clean PNG of the stage. */
  snapshot: (() => Promise<string | null>) | null;

  select: (key: ShoePartKey | null) => void;
  hover: (key: ShoePartKey | null) => void;
  setPartColor: (key: ShoePartKey, hex: string) => void;
  /** Paint the currently selected part. */
  paint: (hex: string) => void;
  setFinish: (key: ShoePartKey, finish: FinishKey) => void;
  resetPart: (key: ShoePartKey) => void;
  resetAll: () => void;
  applyPreset: (id: string) => void;
  addArtwork: (art: NewArtwork) => string;
  placeArtwork: (id: string, mesh: string, part: ShoePartKey, point: Vec3, normal: Vec3) => void;
  updateArtwork: (id: string, patch: Partial<Artwork>) => void;
  removeArtwork: (id: string) => void;
  startPlacing: (id: string | null) => void;
  setActiveArt: (id: string | null) => void;
  setNote: (note: string) => void;
  requestView: (view: ViewKey) => void;
  stopSpin: () => void;
  setSnapshot: (fn: (() => Promise<string | null>) | null) => void;
}

/** localStorage that never throws — a full quota just means "not saved". */
const safeStorage: StateStorage = {
  getItem: (name) => {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value);
    } catch {
      // quota exceeded (big photos) — the session still works
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch {
      // ignore
    }
  },
};

export const useStudio = create<StudioState>()(
  persist(
    (set) => ({
      colors: { ...defaultColorway },
      finish: { ...defaultFinish },
      artwork: [],
      selected: null,
      hovered: null,
      note: "",
      placing: null,
      activeArt: null,
      view: "threeQuarter",
      viewNonce: 0,
      autoSpin: true,
      snapshot: null,

      select: (key) => set({ selected: key, autoSpin: false }),
      hover: (key) => set({ hovered: key }),
      setPartColor: (key, hex) =>
        set((s) => ({ colors: { ...s.colors, [key]: hex } })),
      paint: (hex) =>
        set((s) =>
          s.selected ? { colors: { ...s.colors, [s.selected]: hex } } : s,
        ),
      setFinish: (key, finish) =>
        set((s) => ({ finish: { ...s.finish, [key]: finish } })),
      resetPart: (key) =>
        set((s) => ({
          colors: { ...s.colors, [key]: defaultColorway[key] },
          finish: { ...s.finish, [key]: defaultFinish[key] },
        })),
      resetAll: () =>
        set({ colors: { ...defaultColorway }, finish: { ...defaultFinish } }),
      applyPreset: (id) => {
        const preset = presetColorways.find((p) => p.id === id);
        if (preset) set({ colors: { ...preset.colors } });
      },
      addArtwork: (art) => {
        const id = `art-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
        set((s) => ({
          artwork: [
            ...s.artwork,
            { ...art, id, mesh: null, part: null, point: [0, 0, 0], normal: [0, 0, 1], size: art.kind === "text" ? 0.5 : 0.45, angle: 0 },
          ],
          placing: id,
          activeArt: id,
          autoSpin: false,
        }));
        return id;
      },
      placeArtwork: (id, mesh, part, point, normal) =>
        set((s) => ({
          artwork: s.artwork.map((a) => (a.id === id ? { ...a, mesh, part, point, normal } : a)),
          placing: null,
          activeArt: id,
        })),
      updateArtwork: (id, patch) =>
        set((s) => ({
          artwork: s.artwork.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        })),
      removeArtwork: (id) =>
        set((s) => ({
          artwork: s.artwork.filter((a) => a.id !== id),
          placing: s.placing === id ? null : s.placing,
          activeArt: s.activeArt === id ? null : s.activeArt,
        })),
      startPlacing: (id) => set({ placing: id, autoSpin: false }),
      setActiveArt: (id) => set({ activeArt: id }),
      setNote: (note) => set({ note }),
      requestView: (view) =>
        set((s) => ({ view, viewNonce: s.viewNonce + 1, autoSpin: false })),
      stopSpin: () => set({ autoSpin: false }),
      setSnapshot: (fn) => set({ snapshot: fn }),
    }),
    {
      name: "iasmi-design-lab-v2",
      // v3: the real sneaker model (9 parts) + finishes + artwork — older
      // saves are dropped rather than migrated.
      version: 3,
      storage: createJSONStorage(() => safeStorage),
      partialize: (s) => ({
        colors: s.colors,
        finish: s.finish,
        note: s.note,
        // unplaced artwork is a half-finished action — don't keep it
        artwork: s.artwork.filter((a) => a.mesh !== null),
      }),
      skipHydration: true,
    },
  ),
);

/** Parts whose colour or finish differs from the clean white default. */
export function customizedParts(
  colors: Record<ShoePartKey, string>,
  finish: Record<ShoePartKey, FinishKey>,
): ShoePartKey[] {
  return (Object.keys(colors) as ShoePartKey[]).filter(
    (k) =>
      colors[k].toLowerCase() !== defaultColorway[k].toLowerCase() ||
      finish[k] !== defaultFinish[k],
  );
}

/** Placed artwork in the shape conceptSummary() wants. */
export function artworkSummary(artwork: Artwork[]) {
  return artwork
    .filter((a): a is Artwork & { part: ShoePartKey } => a.part !== null)
    .map((a) => ({ kind: a.kind, part: a.part, text: a.text }));
}
