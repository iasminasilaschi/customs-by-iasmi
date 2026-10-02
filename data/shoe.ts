/**
 * Design Lab v3 — the concept shoe.
 *
 * Part keys, curated paint swatches, finishes and preset colourways for
 * the 3D customizer. The model is a licensed, unbranded white court
 * low-top (assets/3d/CREDITS.md), prepared by scripts/prepare-model.mjs —
 * every mesh in public/models/sneaker.glb carries `extras.part` set to one
 * of these keys, so the keys are the contract between model and UI.
 */

export type ShoePartKey =
  | "toeCap"
  | "sideOuter"
  | "sideInner"
  | "heel"
  | "tongue"
  | "laces"
  | "eyelets"
  | "lining"
  | "sole";

export interface ShoePartDef {
  key: ShoePartKey;
  label: string;
  blurb: string; // one calm line shown when the part is active
}

/** Ordered toe → heel → sole, the way you'd read the shoe. */
export const shoeParts: ShoePartDef[] = [
  { key: "toeCap", label: "Toe cap", blurb: "The rounded front — the first thing anyone sees." },
  { key: "sideOuter", label: "Outer side", blurb: "The big canvas facing the world — made for artwork." },
  { key: "sideInner", label: "Inner side", blurb: "The quieter twin — match it, or keep a secret." },
  { key: "heel", label: "Heel & trim", blurb: "Heel counter plus the trim around the collar and laces." },
  { key: "tongue", label: "Tongue", blurb: "Soft real estate for a small motif." },
  { key: "laces", label: "Laces", blurb: "An easy accent — swap-friendly in real life." },
  { key: "eyelets", label: "Eyelets", blurb: "Tiny metal rings — a whisper of shine." },
  { key: "lining", label: "Lining", blurb: "The inside of the collar and the insole." },
  { key: "sole", label: "Sole", blurb: "The cupsole — clean white, gum, or something bolder." },
];

export const baseShoe = {
  name: "Court Low",
  description: "A clean leather court low-top — real panels, unbranded on purpose.",
};

/** The crisp white pair everyone starts from (soft warm whites). */
export const defaultColorway: Record<ShoePartKey, string> = {
  toeCap: "#f7f4ec",
  sideOuter: "#f7f4ec",
  sideInner: "#f7f4ec",
  heel: "#f3efe5",
  tongue: "#f3efe5",
  laces: "#fbfaf5",
  eyelets: "#d9d6cf",
  lining: "#efeadf",
  sole: "#f8f7f2",
};

export type FinishKey = "matte" | "satin" | "gloss" | "metallic";

export const finishes: Record<
  FinishKey,
  { label: string; roughness: number; clearcoat: number; metalness: number }
> = {
  matte: { label: "matte", roughness: 0.85, clearcoat: 0, metalness: 0 },
  satin: { label: "satin", roughness: 0.5, clearcoat: 0.25, metalness: 0 },
  gloss: { label: "gloss", roughness: 0.22, clearcoat: 1, metalness: 0 },
  metallic: { label: "metallic", roughness: 0.3, clearcoat: 0.4, metalness: 0.85 },
};

export const finishOrder: FinishKey[] = ["matte", "satin", "gloss", "metallic"];

/** How each part comes out of the box. */
export const defaultFinish: Record<ShoePartKey, FinishKey> = {
  toeCap: "satin",
  sideOuter: "satin",
  sideInner: "satin",
  heel: "satin",
  tongue: "matte",
  laces: "matte",
  eyelets: "metallic",
  lining: "matte",
  sole: "satin",
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

/** Lettering styles for text on the shoe — the site's own three voices. */
export const letteringFonts = [
  { id: "serif", label: "serif", cssVar: "--font-fraunces", fallback: "Georgia, serif", weight: 600 },
  { id: "hand", label: "handwritten", cssVar: "--font-caveat", fallback: "cursive", weight: 700 },
  { id: "clean", label: "clean", cssVar: "--font-grotesk", fallback: "system-ui, sans-serif", weight: 600 },
] as const;

export type LetteringFontId = (typeof letteringFonts)[number]["id"];

/** Max photos + text pieces on one shoe. */
export const MAX_ARTWORK = 4;

/** The minimum a summary needs to know about placed artwork. */
export interface ArtworkSummary {
  kind: "photo" | "text";
  part: ShoePartKey;
  text?: string;
}

/**
 * One human-readable line describing a configuration — used by the design
 * summary, the "copy concept" button and the commission form context.
 */
export function conceptSummary(
  colors: Record<ShoePartKey, string>,
  finish: Record<ShoePartKey, FinishKey> = defaultFinish,
  artwork: ArtworkSummary[] = [],
): string {
  const changed = shoeParts.filter(
    (p) =>
      colors[p.key].toLowerCase() !== defaultColorway[p.key].toLowerCase() ||
      finish[p.key] !== defaultFinish[p.key],
  );
  const bits: string[] = [];
  if (changed.length > 0) {
    bits.push(
      changed
        .map((p) => {
          const f = finish[p.key] !== defaultFinish[p.key] ? ` (${finish[p.key]})` : "";
          return `${p.label.toLowerCase()}: ${swatchName(colors[p.key])}${f}`;
        })
        .join(" · "),
    );
  }
  const label = (k: ShoePartKey) => shoeParts.find((p) => p.key === k)!.label.toLowerCase();
  const photos = artwork.filter((a) => a.kind === "photo");
  if (photos.length > 0) {
    bits.push(
      `${photos.length} photo${photos.length > 1 ? "s" : ""} placed (${photos.map((p) => label(p.part)).join(", ")})`,
    );
  }
  for (const t of artwork.filter((a) => a.kind === "text")) {
    bits.push(`text "${t.text}" on ${label(t.part)}`);
  }
  if (bits.length === 0) return `${baseShoe.name} — clean white base, untouched`;
  return `${baseShoe.name} — ${bits.join(" · ")}`;
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
      toeCap: "#f6c9d4",
      sideOuter: "#f9f6ee",
      sideInner: "#f9f6ee",
      heel: "#d98ba0",
      tongue: "#f6c9d4",
      laces: "#f9f6ee",
      eyelets: "#c9a35c",
      lining: "#f6c9d4",
      sole: "#f8f7f2",
    },
  },
  {
    id: "botanical-study",
    name: "Botanical Study",
    vibe: "earthy, museum-ish",
    colors: {
      toeCap: "#5f6f52",
      sideOuter: "#e5dccb",
      sideInner: "#e5dccb",
      heel: "#2f3a2f",
      tongue: "#cad0be",
      laces: "#f2ecdf",
      eyelets: "#c9a35c",
      lining: "#cad0be",
      sole: "#d9be93",
    },
  },
  {
    id: "midnight-ink",
    name: "Midnight Ink",
    vibe: "dark, calm",
    colors: {
      toeCap: "#141a2e",
      sideOuter: "#2b3a67",
      sideInner: "#2b3a67",
      heel: "#141a2e",
      tongue: "#2b3a67",
      laces: "#f2ecdf",
      eyelets: "#c9a35c",
      lining: "#c9a35c",
      sole: "#f2ecdf",
    },
  },
  {
    id: "terracotta-court",
    name: "Terracotta Court",
    vibe: "warm, seventies",
    colors: {
      toeCap: "#e2745f",
      sideOuter: "#f2ecdf",
      sideInner: "#f2ecdf",
      heel: "#a14e32",
      tongue: "#e5dccb",
      laces: "#f9f6ee",
      eyelets: "#d9d6cf",
      lining: "#e5dccb",
      sole: "#d9be93",
    },
  },
];
