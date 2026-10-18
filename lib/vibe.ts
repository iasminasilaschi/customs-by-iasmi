import type { CSSProperties } from "react";
import type { VibePalette } from "@/data/media";

/** The atelier's own colours, for when no pair is on stage. */
export const atelier: VibePalette = {
  bg: "#f5f0e6",
  glow: "#fbf8f0",
  word: "#ece2d1",
  ink: "#2c2a20",
  muted: "#7a7060",
  accent: "#5f6f52",
  accentInk: "#f5f0e6",
  accentOnCream: "#bb8355",
  pop: "#6f7d60",
  glass: "rgb(251 248 240 / 0.72)",
  line: "rgb(58 50 34 / 0.14)",
  shade: "rgb(47 58 47 / 0.6)",
};

/** A palette as the --vibe-* properties the hero and the nav read (globals.css). */
export function vibeVars(v: VibePalette): Record<string, string> {
  return {
    "--vibe-bg": v.bg,
    "--vibe-ink": v.ink,
    "--vibe-muted": v.muted,
    "--vibe-accent": v.accent,
    "--vibe-accent-ink": v.accentInk,
    "--vibe-pop": v.pop,
    "--vibe-glass": v.glass,
    "--vibe-line": v.line,
    "--vibe-tint": v.line,
    "--vibe-shade": v.shade,
  };
}

/**
 * A palette mapped onto the site's own colour tokens, so a whole page takes a
 * pair's colours: background, text, panels, accents, and its pop colour for
 * the small details (eyebrows, tags, ✦). Used on the pair's project page.
 */
export function pageTokens(v: VibePalette): CSSProperties {
  return {
    "--color-ink": v.bg,
    "--color-coal": v.glow,
    "--color-coal-2": v.glow,
    "--color-cream-soft": v.glow,
    "--color-cream": v.ink,
    "--color-cream-2": v.ink,
    "--color-muted": v.muted,
    "--color-line": v.line,
    "--color-rose": v.accent,
    "--color-rose-2": v.accent,
    "--color-olive": v.accent,
    "--color-deep": `color-mix(in oklab, ${v.accent}, ${v.ink} 22%)`,
    "--color-paper": v.accentInk,
    "--color-gold": v.pop,
    "--color-lilac": v.pop,
    "--color-sage": v.pop,
  } as CSSProperties;
}

/** Give the nav (and the page's cream-section accents) a pair's colours. */
export function applyRootVibe(v: VibePalette) {
  const style = document.documentElement.style;
  const vars = { ...vibeVars(v), "--color-rose-2": v.accentOnCream };
  for (const [k, value] of Object.entries(vars)) style.setProperty(k, value);
}

/** Back to the atelier colours. */
export function clearRootVibe() {
  const root = document.documentElement;
  root.removeAttribute("data-vibe-wash");
  for (const k of Array.from(root.style)) {
    if (k.startsWith("--vibe-") || k === "--color-rose-2") root.style.removeProperty(k);
  }
}
