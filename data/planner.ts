/**
 * Photo planner — the real pairs it can plan on.
 *
 * One cut-out photo per side of each shoe (one canvas each, with its own art
 * layers), plus "together" layouts built from them. Cut-outs live in
 * public/design-lab/pairs/<pair>/ (password-protected with the rest of
 * /design-lab by proxy.ts); masters + the pipeline notes in the README.
 *
 * Conventions for side views (sole down):
 *   toe pointing LEFT  = left shoe outer  / right shoe inner
 *   toe pointing RIGHT = right shoe outer / left shoe inner
 * Heels are photographed from behind (left shoe on the left); toes from the
 * front/above (toe at the bottom of the image).
 */

export type PlannerViewKey =
  | "leftOuter"
  | "leftInner"
  | "rightOuter"
  | "rightInner"
  | "leftHeel"
  | "rightHeel"
  | "leftToe"
  | "rightToe";

export type TogetherKey = "pair" | "outer" | "inner";

export interface PlannerView {
  key: PlannerViewKey;
  /** "Left outer" */
  label: string;
  /** "L outer" — for tight chips */
  short: string;
  shoe: "left" | "right";
  part: "outer" | "inner" | "heel" | "toe";
  src: string;
  width: number;
  height: number;
  /** Which original photo this view comes from. */
  from: string;
  /** Set when the view is not a real photo of that side (mirrored copy). */
  approximate?: string;
}

export interface PlannerPair {
  id: string;
  name: string;
  /** Short honest notes shown under the planner. */
  notes: string[];
  views: Record<PlannerViewKey, PlannerView>;
}

const japanDir = "/design-lab/pairs/japan";
const RETAKE = "approximate, retake photo";

export const japanPair: PlannerPair = {
  id: "japan",
  name: "Japan-inspired pair",
  notes: [
    "The side photos show both shoes stacked; each view is the top shoe, cut out on its own and levelled.",
    "Which shoe was on top isn't certain, so the top one is treated as the left shoe. Inner and outer look almost the same, so this is fine for planning.",
  ],
  views: {
    leftOuter: {
      key: "leftOuter",
      label: "Left outer",
      short: "L outer",
      shoe: "left",
      part: "outer",
      src: `${japanDir}/left-outer.webp`,
      width: 1094,
      height: 471,
      from: "clean-side-2.jpeg (top shoe)",
    },
    leftInner: {
      key: "leftInner",
      label: "Left inner",
      short: "L inner",
      shoe: "left",
      part: "inner",
      src: `${japanDir}/left-inner.webp`,
      width: 1101,
      height: 462,
      from: "clean-side-1.jpeg (top shoe)",
    },
    rightOuter: {
      key: "rightOuter",
      label: "Right outer",
      short: "R outer",
      shoe: "right",
      part: "outer",
      src: `${japanDir}/right-outer.webp`,
      width: 1094,
      height: 471,
      from: "mirrored copy of the left outer",
      approximate: RETAKE,
    },
    rightInner: {
      key: "rightInner",
      label: "Right inner",
      short: "R inner",
      shoe: "right",
      part: "inner",
      src: `${japanDir}/right-inner.webp`,
      width: 1101,
      height: 462,
      from: "mirrored copy of the left inner",
      approximate: RETAKE,
    },
    leftHeel: {
      key: "leftHeel",
      label: "Left heel",
      short: "L heel",
      shoe: "left",
      part: "heel",
      src: `${japanDir}/left-heel.webp`,
      width: 540,
      height: 797,
      from: "clean-heels.jpeg (left of the pair)",
    },
    rightHeel: {
      key: "rightHeel",
      label: "Right heel",
      short: "R heel",
      shoe: "right",
      part: "heel",
      src: `${japanDir}/right-heel.webp`,
      width: 551,
      height: 817,
      from: "clean-heels.jpeg (right of the pair)",
    },
    leftToe: {
      key: "leftToe",
      label: "Left toe",
      short: "L toe",
      shoe: "left",
      part: "toe",
      src: `${japanDir}/left-toe.webp`,
      width: 489,
      height: 1258,
      from: "clean-front-top-view-table.jpeg (right of the photo)",
    },
    rightToe: {
      key: "rightToe",
      label: "Right toe",
      short: "R toe",
      shoe: "right",
      part: "toe",
      src: `${japanDir}/right-toe.webp`,
      width: 515,
      height: 1265,
      from: "clean-front-top-view-table.jpeg (left of the photo)",
    },
  },
};

export const plannerPairs: PlannerPair[] = [japanPair];

/** Order of the single-view chips: left shoe row, right shoe row. */
export const viewOrder: PlannerViewKey[] = [
  "leftOuter",
  "leftInner",
  "leftHeel",
  "leftToe",
  "rightOuter",
  "rightInner",
  "rightHeel",
  "rightToe",
];

export const togetherViews: { key: TogetherKey; label: string; hint: string }[] = [
  { key: "pair", label: "The pair", hint: "How it all fits: both shoes, heels and toes." },
  { key: "outer", label: "Outer sides", hint: "How people see him from the sides: toes pointing away." },
  { key: "inner", label: "Inner sides", hint: "The two inner sides facing each other, as when his feet are together." },
];
