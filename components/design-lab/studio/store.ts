"use client";

/**
 * Design Lab v2 studio state — one zustand store shared by the 3D scene
 * and the flat UI panels, so hovering a part in the list highlights it on
 * the shoe and vice-versa.
 *
 * Colours + the inspiration note persist to localStorage (skipHydration —
 * the studio rehydrates in an effect to stay SSR-safe). Selection, hover
 * and camera state are session-only.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  defaultColorway,
  presetColorways,
  type ShoePartKey,
} from "@/data/shoe";

export type ViewKey = "threeQuarter" | "lateral" | "medial" | "front" | "back" | "top";

interface StudioState {
  colors: Record<ShoePartKey, string>;
  selected: ShoePartKey | null;
  hovered: ShoePartKey | null;
  note: string;
  /** Camera preset request; nonce lets the same view be re-requested. */
  view: ViewKey;
  viewNonce: number;
  /** Gentle auto-spin until the visitor takes the wheel. */
  autoSpin: boolean;

  select: (key: ShoePartKey | null) => void;
  hover: (key: ShoePartKey | null) => void;
  setPartColor: (key: ShoePartKey, hex: string) => void;
  /** Paint the currently selected part. */
  paint: (hex: string) => void;
  resetPart: (key: ShoePartKey) => void;
  resetAll: () => void;
  applyPreset: (id: string) => void;
  setNote: (note: string) => void;
  requestView: (view: ViewKey) => void;
  stopSpin: () => void;
}

export const useStudio = create<StudioState>()(
  persist(
    (set) => ({
      colors: { ...defaultColorway },
      selected: null,
      hovered: null,
      note: "",
      view: "threeQuarter",
      viewNonce: 0,
      autoSpin: true,

      select: (key) => set({ selected: key, autoSpin: false }),
      hover: (key) => set({ hovered: key }),
      setPartColor: (key, hex) =>
        set((s) => ({ colors: { ...s.colors, [key]: hex } })),
      paint: (hex) =>
        set((s) =>
          s.selected ? { colors: { ...s.colors, [s.selected]: hex } } : s,
        ),
      resetPart: (key) =>
        set((s) => ({
          colors: { ...s.colors, [key]: defaultColorway[key] },
        })),
      resetAll: () => set({ colors: { ...defaultColorway } }),
      applyPreset: (id) => {
        const preset = presetColorways.find((p) => p.id === id);
        if (preset) set({ colors: { ...preset.colors } });
      },
      setNote: (note) => set({ note }),
      requestView: (view) =>
        set((s) => ({ view, viewNonce: s.viewNonce + 1, autoSpin: false })),
      stopSpin: () => set({ autoSpin: false }),
    }),
    {
      name: "iasmi-design-lab-v2",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ colors: s.colors, note: s.note }),
      skipHydration: true,
    },
  ),
);

/** True when any part differs from the clean white default. */
export function customizedParts(colors: Record<ShoePartKey, string>): ShoePartKey[] {
  return (Object.keys(colors) as ShoePartKey[]).filter(
    (k) => colors[k].toLowerCase() !== defaultColorway[k].toLowerCase(),
  );
}
