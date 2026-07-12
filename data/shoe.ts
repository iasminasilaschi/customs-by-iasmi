/**
 * Design Lab v2 — the concept shoe.
 *
 * Part keys, curated paint swatches and preset colourways for the 3D
 * customizer. The 3D model is a generic low-top silhouette ("Studio
 * Low 01") built in-house — deliberately not a branded shoe, same as the
 * 2D concept sketch. Part keys are stable: a future scanned/GLTF model
 * only needs its mesh names mapped onto these keys.
 */

export type ShoePartKey =
  | "toeBox"
  | "mudguard"
  | "vamp"
  | "eyestay"
  | "quarter"
  | "sideMark"
  | "heelTab"
  | "tongue"
  | "laces"
  | "midsole"
  | "outsole";

export interface ShoePartDef {
  key: ShoePartKey;
  label: string;
  blurb: string; // one calm line shown when the part is active
}

/** Ordered toe → heel → sole, the way you'd read the shoe. */
export const shoeParts: ShoePartDef[] = [
  { key: "toeBox", label: "Toe box", blurb: "The front cap — first thing anyone sees." },
  { key: "mudguard", label: "Mudguard", blurb: "The low wrap that takes the weather." },
  { key: "vamp", label: "Vamp", blurb: "The body of the upper, under the laces." },
  { key: "eyestay", label: "Lace panel", blurb: "The band the laces run through." },
  { key: "quarter", label: "Quarter panel", blurb: "The big side canvas — murals live here." },
  { key: "sideMark", label: "Side mark", blurb: "The twin bars — our stand-in for a logo." },
  { key: "heelTab", label: "Heel tab", blurb: "The back counter — initials go here a lot." },
  { key: "tongue", label: "Tongue", blurb: "Soft real estate for a small motif." },
  { key: "laces", label: "Laces", blurb: "An easy accent — swap-friendly in real life." },
  { key: "midsole", label: "Midsole", blurb: "The thick line that carries the whole look." },
  { key: "outsole", label: "Outsole", blurb: "Underfoot — gum or colour, your call." },
];

export const baseShoe = {
  name: "Studio Low 01",
  description: "A generic low-top silhouette — the classic court shape, unbranded on purpose.",
};

/** The clean white pair everyone starts from (warm whites, soft gum sole). */
export const defaultColorway: Record<ShoePartKey, string> = {
  toeBox: "#f6f2e7",
  mudguard: "#f0ebde",
  vamp: "#f6f2e7",
  eyestay: "#f0ebde",
  quarter: "#f6f2e7",
  sideMark: "#e7e0cf",
  heelTab: "#ece6d7",
  tongue: "#ece5d4",
  laces: "#f9f6ee",
  midsole: "#f9f6ee",
  outsole: "#d9be93",
};

export interface PaintSwatch {
  name: string;
  hex: string;
}

/**
 * Curated leather-paint palette — warm neutrals first, then the site's
 * clay/sage/gold family, then the deeper story colours.
 */
export const paintSwatches: PaintSwatch[] = [
  { name: "gesso white", hex: "#f9f6ee" },
  { name: "warm cream", hex: "#f2ecdf" },
  { name: "oat", hex: "#e5dccb" },
  { name: "sand", hex: "#d8c69a" },
  { name: "gum", hex: "#d9be93" },
  { name: "muted gold", hex: "#c9a35c" },
  { name: "clay", hex: "#bb8355" },
  { name: "terracotta", hex: "#e2745f" },
  { name: "rust", hex: "#a14e32" },
  { name: "saddle brown", hex: "#7a5c45" },
  { name: "espresso", hex: "#4a382a" },
  { name: "blush", hex: "#f6c9d4" },
  { name: "dusty rose", hex: "#d98ba0" },
  { name: "lilac", hex: "#b7a6e3" },
  { name: "dusty blue", hex: "#8fb8de" },
  { name: "slate", hex: "#5d729c" },
  { name: "navy", hex: "#2b3a67" },
  { name: "midnight ink", hex: "#141a2e" },
  { name: "soft sage", hex: "#cad0be" },
  { name: "sage", hex: "#8f9b82" },
  { name: "olive", hex: "#5f6f52" },
  { name: "deep forest", hex: "#2f3a2f" },
  { name: "charcoal", hex: "#33312c" },
  { name: "ink black", hex: "#17150f" },
];

/** Look up a friendly name for a hex (falls back to the raw hex). */
export function swatchName(hex: string): string {
  const s = paintSwatches.find((p) => p.hex.toLowerCase() === hex.toLowerCase());
  return s ? s.name : hex.toLowerCase();
}

/**
 * One human-readable line describing a configuration — used by the design
 * summary, the "copy concept" button and the commission form context.
 */
export function conceptSummary(colors: Record<ShoePartKey, string>): string {
  const changed = shoeParts.filter(
    (p) => colors[p.key].toLowerCase() !== defaultColorway[p.key].toLowerCase(),
  );
  if (changed.length === 0) return `${baseShoe.name} — clean white base, untouched`;
  const painted = changed
    .map((p) => `${p.label.toLowerCase()}: ${swatchName(colors[p.key])}`)
    .join(" · ");
  return `${baseShoe.name} — ${painted}`;
}

export interface PresetColorway {
  id: string;
  name: string;
  vibe: string;
  colors: Record<ShoePartKey, string>;
}

/** Quick colour stories — cousins of the Design Starters, tuned per-part. */
export const presetColorways: PresetColorway[] = [
  {
    id: "fresh-cream",
    name: "Fresh Cream",
    vibe: "the clean start",
    colors: { ...defaultColorway },
  },
  {
    id: "tokyo-bloom",
    name: "Tokyo Bloom",
    vibe: "soft, romantic",
    colors: {
      toeBox: "#f6c9d4",
      mudguard: "#f2ecdf",
      vamp: "#f9f6ee",
      eyestay: "#f6c9d4",
      quarter: "#f9f6ee",
      sideMark: "#e2745f",
      heelTab: "#d98ba0",
      tongue: "#f2ecdf",
      laces: "#f9f6ee",
      midsole: "#f9f6ee",
      outsole: "#d8c69a",
    },
  },
  {
    id: "botanical-study",
    name: "Botanical Study",
    vibe: "earthy, museum-ish",
    colors: {
      toeBox: "#cad0be",
      mudguard: "#5f6f52",
      vamp: "#e5dccb",
      eyestay: "#5f6f52",
      quarter: "#e5dccb",
      sideMark: "#c9a35c",
      heelTab: "#2f3a2f",
      tongue: "#cad0be",
      laces: "#f2ecdf",
      midsole: "#f2ecdf",
      outsole: "#d9be93",
    },
  },
  {
    id: "midnight-ink",
    name: "Midnight Ink",
    vibe: "dark, calm",
    colors: {
      toeBox: "#141a2e",
      mudguard: "#2b3a67",
      vamp: "#141a2e",
      eyestay: "#2b3a67",
      quarter: "#141a2e",
      sideMark: "#c9a35c",
      heelTab: "#c9a35c",
      tongue: "#2b3a67",
      laces: "#f2ecdf",
      midsole: "#f2ecdf",
      outsole: "#17150f",
    },
  },
  {
    id: "terracotta-court",
    name: "Terracotta Court",
    vibe: "warm, seventies",
    colors: {
      toeBox: "#e2745f",
      mudguard: "#a14e32",
      vamp: "#f2ecdf",
      eyestay: "#e5dccb",
      quarter: "#f2ecdf",
      sideMark: "#7a5c45",
      heelTab: "#a14e32",
      tongue: "#e5dccb",
      laces: "#f9f6ee",
      midsole: "#f9f6ee",
      outsole: "#d9be93",
    },
  },
];
