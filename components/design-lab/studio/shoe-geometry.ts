/**
 * Procedural "Studio Low 01" — a generic low-top court sneaker built from
 * extruded side-profile panels, the way the real thing is built from
 * stitched leather pads.
 *
 * Why procedural instead of a downloaded model:
 *  - zero heavy assets (the shoe is ~a few KB of code, loads instantly)
 *  - no brand IP on a commercial commission site (the "side mark" is the
 *    same abstract twin-bar used by the 2D SneakerPreview)
 *  - every panel is its own mesh → hover/click/paint per part is trivial
 *
 * A future scanned/GLTF shoe can replace this file entirely: it only needs
 * meshes grouped under the same ShoePartKey keys.
 *
 * Coordinates: X = length (toe at +X), Y = up (sole bottom ≈ -0.33),
 * Z = width. Shapes are drawn in the X/Y plane and extruded along Z, then
 * tapered (narrower toe, heel and collar) so the slab reads as a last.
 * Outer panels extrude slightly wider ("inflate") so they sit proud of the
 * body like real overlays.
 */

import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { ShoePartKey } from "@/data/shoe";

/** Base half-width of the upper body; overlays add their inflate to this. */
const BASE_HW = 0.42;

/** Plan-view taper: narrower toward the toe tip and (gently) the heel. */
function planTaper(x: number): number {
  let t = 1;
  if (x > 0.3) {
    const u = Math.min((x - 0.3) / 0.92, 1);
    t *= 1 - 0.52 * u * u;
  }
  if (x < -0.65) {
    const u = Math.min((-x - 0.65) / 0.55, 1);
    t *= 1 - 0.28 * u * u;
  }
  return t;
}

/** Height taper: the collar/ankle is narrower than the sole line. */
function heightTaper(y: number): number {
  if (y <= 0.12) return 1;
  const u = Math.min((y - 0.12) / 0.62, 1);
  return 1 - 0.3 * u * u;
}

interface PanelOpts {
  halfWidth: number;
  /** Bevel size/thickness — bigger = softer, more cushioned edge. */
  bevel?: number;
  bevelSegments?: number;
  curveSegments?: number;
  /** Apply the collar height-taper (true for upper panels, false for soles). */
  taperY?: boolean;
}

/** Extrude a side-profile shape into a soft-edged, tapered panel. */
function panel(shape: THREE.Shape, opts: PanelOpts): THREE.BufferGeometry {
  const bevel = opts.bevel ?? 0.03;
  const depth = Math.max(0.02, opts.halfWidth * 2 - bevel * 2);
  let geo: THREE.BufferGeometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel * 0.9,
    bevelSegments: opts.bevelSegments ?? 3,
    curveSegments: opts.curveSegments ?? 20,
  });
  geo.translate(0, 0, -depth / 2);

  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    let t = planTaper(x);
    if (opts.taperY !== false) t *= heightTaper(y);
    pos.setZ(i, pos.getZ(i) * t);
  }

  // Re-index and smooth — merged vertices + recomputed normals give the
  // soft "hand-stitched pad" shading the bevels are there for.
  geo.deleteAttribute("normal");
  geo.deleteAttribute("uv");
  geo = mergeVertices(geo);
  geo.computeVertexNormals();
  return geo;
}

function draw(fn: (s: THREE.Shape) => void): THREE.Shape {
  const s = new THREE.Shape();
  fn(s);
  return s;
}

/* ---------------------------------------------------------------- shapes */

/** Full upper silhouette — doubles as the paintable "vamp" body. */
const vampShape = () =>
  draw((s) => {
    s.moveTo(-1.05, -0.05);
    s.bezierCurveTo(-1.21, 0.34, -1.16, 0.65, -0.98, 0.74); // heel curve, tall collar
    s.bezierCurveTo(-0.82, 0.79, -0.62, 0.76, -0.42, 0.64); // collar stays high…
    s.quadraticCurveTo(-0.18, 0.5, 0.06, 0.47); // …then dips at the throat
    s.bezierCurveTo(0.48, 0.38, 0.72, 0.26, 0.9, 0.2); // steep instep
    s.bezierCurveTo(1.08, 0.14, 1.21, 0.07, 1.2, 0.0); // low toe nose
    s.quadraticCurveTo(1.18, -0.05, 1.05, -0.05);
    s.lineTo(-1.05, -0.05);
  });

/** Toe cap with the classic swept-back crescent seam. */
const toeBoxShape = () =>
  draw((s) => {
    s.moveTo(0.68, -0.06);
    s.quadraticCurveTo(0.71, 0.12, 0.84, 0.23); // crescent seam
    s.bezierCurveTo(0.99, 0.19, 1.1, 0.13, 1.22, 0.05); // over the instep
    s.quadraticCurveTo(1.25, -0.02, 1.16, -0.06);
    s.lineTo(0.68, -0.06);
  });

/** Low wrap panel running from the toe seam around to the heel. */
const mudguardShape = () =>
  draw((s) => {
    s.moveTo(0.7, -0.06);
    s.lineTo(0.72, 0.13);
    s.bezierCurveTo(0.25, 0.19, -0.4, 0.12, -0.68, 0.15); // gentle wave back
    s.quadraticCurveTo(-0.92, 0.17, -1.0, 0.24); // rise at the heel
    s.bezierCurveTo(-1.12, 0.16, -1.14, 0.04, -1.09, -0.06); // heel wrap
    s.lineTo(0.7, -0.06);
  });

/** Big rear side panel, inset from collar + heel so seams read. */
const quarterShape = () =>
  draw((s) => {
    s.moveTo(0.04, -0.03);
    s.quadraticCurveTo(-0.03, 0.26, -0.22, 0.48); // front diagonal seam
    s.bezierCurveTo(-0.5, 0.58, -0.8, 0.66, -0.93, 0.64); // below collar
    s.bezierCurveTo(-1.1, 0.52, -1.14, 0.2, -1.0, -0.03); // heel edge
    s.lineTo(0.04, -0.03);
  });

/** Lace panel along the instep; pokes just above the topline. */
const eyestayShape = () =>
  draw((s) => {
    s.moveTo(-0.08, 0.5);
    s.bezierCurveTo(0.3, 0.4, 0.56, 0.29, 0.78, 0.24); // outer edge
    s.lineTo(0.74, 0.1);
    s.bezierCurveTo(0.46, 0.17, 0.18, 0.27, -0.14, 0.34); // inner edge
    s.lineTo(-0.08, 0.5);
  });

/** Heel counter — rises a touch above the collar like a pull tab. */
const heelTabShape = () =>
  draw((s) => {
    s.moveTo(-0.74, 0.32);
    s.lineTo(-0.76, 0.64);
    s.quadraticCurveTo(-0.9, 0.82, -1.02, 0.72); // rounded tab over the collar
    s.bezierCurveTo(-1.16, 0.58, -1.18, 0.42, -1.09, 0.32);
    s.lineTo(-0.74, 0.32);
  });

/** Twin angled bars — the same abstract mark as the 2D concept sketch. */
const sideMarkShapes = () => [
  draw((s) => {
    s.moveTo(-0.34, 0.13);
    s.lineTo(-0.15, 0.44);
    s.lineTo(-0.04, 0.44);
    s.lineTo(-0.22, 0.13);
    s.lineTo(-0.34, 0.13);
  }),
  draw((s) => {
    s.moveTo(-0.5, 0.13);
    s.lineTo(-0.38, 0.36);
    s.lineTo(-0.3, 0.36);
    s.lineTo(-0.41, 0.13);
    s.lineTo(-0.5, 0.13);
  }),
];

/** Padded tongue pillow rising gently out of the throat. */
const tongueShape = () =>
  draw((s) => {
    s.moveTo(-0.06, 0.36);
    s.lineTo(0.36, 0.24);
    s.lineTo(0.42, 0.42);
    s.bezierCurveTo(0.24, 0.56, 0.0, 0.57, -0.16, 0.46); // rounded top
    s.lineTo(-0.06, 0.36);
  });

/** Chunky court midsole with a little toe spring. */
const midsoleShape = () =>
  draw((s) => {
    s.moveTo(-1.22, -0.2);
    s.lineTo(1.02, -0.2);
    s.quadraticCurveTo(1.26, -0.16, 1.26, 0.0); // toe kick
    s.quadraticCurveTo(1.25, 0.06, 1.18, 0.06);
    s.quadraticCurveTo(0.0, 0.09, -1.16, 0.06);
    s.quadraticCurveTo(-1.26, -0.06, -1.22, -0.2);
  });

const outsoleShape = () =>
  draw((s) => {
    s.moveTo(-1.2, -0.32);
    s.lineTo(1.04, -0.32);
    s.quadraticCurveTo(1.24, -0.29, 1.25, -0.16);
    s.lineTo(1.02, -0.17);
    s.lineTo(-1.18, -0.17);
    s.quadraticCurveTo(-1.23, -0.24, -1.2, -0.32);
  });

/* ----------------------------------------------------------------- build */

export interface BuiltPart {
  key: ShoePartKey;
  geometries: THREE.BufferGeometry[];
}

function buildLaces(): THREE.BufferGeometry[] {
  // Four soft bars resting across the lace panel, following the instep slope.
  const spots: Array<[number, number]> = [
    [0.04, 0.49],
    [0.2, 0.435],
    [0.36, 0.378],
    [0.52, 0.32],
  ];
  return spots.map(([x, y]) => {
    const hw = (BASE_HW + 0.03) * planTaper(x) * heightTaper(y);
    const geo = new THREE.CapsuleGeometry(0.034, hw * 2 - 0.1, 6, 14);
    geo.rotateX(Math.PI / 2); // axis along Z (across the shoe)
    geo.translate(x, y + 0.012, 0);
    return geo;
  });
}

let cache: BuiltPart[] | null = null;

/** Build (once) and return every paintable part of the concept shoe. */
export function buildShoe(): BuiltPart[] {
  if (cache) return cache;

  const upper = { taperY: true };
  cache = [
    { key: "vamp", geometries: [panel(vampShape(), { ...upper, halfWidth: BASE_HW, bevel: 0.045 })] },
    { key: "toeBox", geometries: [panel(toeBoxShape(), { ...upper, halfWidth: BASE_HW + 0.036, bevel: 0.03 })] },
    { key: "mudguard", geometries: [panel(mudguardShape(), { ...upper, halfWidth: BASE_HW + 0.024, bevel: 0.028 })] },
    { key: "quarter", geometries: [panel(quarterShape(), { ...upper, halfWidth: BASE_HW + 0.012, bevel: 0.03 })] },
    { key: "eyestay", geometries: [panel(eyestayShape(), { ...upper, halfWidth: BASE_HW + 0.03, bevel: 0.026 })] },
    { key: "heelTab", geometries: [panel(heelTabShape(), { ...upper, halfWidth: BASE_HW + 0.042, bevel: 0.026 })] },
    {
      key: "sideMark",
      geometries: sideMarkShapes().map((sh) =>
        panel(sh, { ...upper, halfWidth: BASE_HW + 0.052, bevel: 0.014, bevelSegments: 2 }),
      ),
    },
    { key: "tongue", geometries: [panel(tongueShape(), { ...upper, halfWidth: 0.3, bevel: 0.045 })] },
    { key: "laces", geometries: buildLaces() },
    { key: "midsole", geometries: [panel(midsoleShape(), { halfWidth: BASE_HW + 0.05, bevel: 0.045, taperY: false })] },
    { key: "outsole", geometries: [panel(outsoleShape(), { halfWidth: BASE_HW + 0.03, bevel: 0.03, taperY: false })] },
  ];
  return cache;
}

/** Vertical offset that puts the outsole on the ground plane. */
export const SHOE_LIFT = 0.36;
