/**
 * How the studio reads public/models/sneaker.glb.
 *
 * The GLB is produced by scripts/prepare-model.mjs: one mesh per piece,
 * each tagged with `extras.part` (→ three.js `userData.part`) holding a
 * ShoePartKey. The shoe sits on y=0, toe towards +X, ~2.4 units long.
 */

import type { ShoePartKey } from "@/data/shoe";

export const MODEL_URL = "/models/sneaker.glb";

/** Height of the shoe in scene units — the camera aims at its middle. */
export const SHOE_HEIGHT = 1.02;

/** Surfaces big and smooth enough to carry a photo or lettering. */
export const ARTWORK_PARTS: ReadonlySet<ShoePartKey> = new Set([
  "toeCap",
  "sideOuter",
  "sideInner",
  "heel",
  "tongue",
  "sole",
]);
