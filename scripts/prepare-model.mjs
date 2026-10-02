/**
 * Turns the downloaded Sketchfab sneaker into the web-ready studio model.
 *
 *   npm run model:prepare
 *
 * Source: assets/3d/unbranded_white_sneaker.glb (see assets/3d/CREDITS.md)
 * Output: public/models/sneaker.glb
 *
 * What it does:
 *  1. Normalises the shoe: toe → +X, sole on y=0, centred, ~2.4 units long.
 *  2. Bakes every node transform into the vertices (one shared local space,
 *     so decals and raycasts behave the same on every part).
 *  3. Splits merged meshes into paintable pieces (toe cap vs heel, outer vs
 *     inner side panel) by connected components, then regroups everything
 *     into one named node per piece with `extras.part` = a ShoePartKey.
 *  4. Simplifies the over-dense eyelets, then meshopt-compresses.
 *
 * The source mesh order is fixed by the file (see the table below); if the
 * model is ever swapped, re-inspect it with
 *   npx @gltf-transform/cli inspect assets/3d/<file>.glb
 */

import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import {
  clearNodeTransform,
  compactPrimitive,
  dedup,
  flatten,
  getBounds,
  joinPrimitives,
  meshopt,
  prune,
  simplifyPrimitive,
  weldPrimitive,
} from "@gltf-transform/functions";
import { MeshoptEncoder, MeshoptSimplifier } from "meshoptimizer";

const SRC = "assets/3d/unbranded_white_sneaker.glb";
const OUT = "public/models/sneaker.glb";
const TARGET_LENGTH = 2.4;

await MeshoptEncoder.ready;
await MeshoptSimplifier.ready;

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ "meshopt.encoder": MeshoptEncoder });
const doc = await io.read(SRC);
const root = doc.getRoot();
const scene = root.getDefaultScene() ?? root.listScenes()[0];
const buffer = root.listBuffers()[0];

// 1 — normalise: glTF TRS is T·R·S; a 180° turn about Y maps (x,y,z) → (-x,y,-z)
const { min, max } = getBounds(scene);
const s = TARGET_LENGTH / (max[0] - min[0]);
const wrap = doc
  .createNode("sneaker")
  .setScale([s, s, s])
  .setRotation([0, 1, 0, 0])
  .setTranslation([(s * (min[0] + max[0])) / 2, -s * min[1], (s * (min[2] + max[2])) / 2]);
for (const child of scene.listChildren()) {
  scene.removeChild(child);
  wrap.addChild(child);
}
scene.addChild(wrap);

// 2 — bake transforms
await doc.transform(flatten());
for (const node of root.listNodes()) if (node.getMesh()) clearNodeTransform(node);

// 3 — split + regroup. Source meshes, in file order:
//  0 WhiteSuede   inner lining         5 Insole        insole
//  1 WhiteSole    cupsole sidewall     6 WhiteSuede    side panels (outer + inner)
//  2 WhiteLeather toe cap + heel/trim  7 WhiteLeather  tongue
//  3 WhiteLeather small trim pieces    8 WhiteSatin    laces
//  4 Normal       outsole tread        9 metal         eyelets
const src = root.listMeshes().map((m) => m.listPrimitives()[0]);
if (src.length !== 10) throw new Error(`expected 10 source meshes, got ${src.length}`);

/** Connected components (welded by position), largest first, as index arrays. */
function components(prim) {
  const pos = prim.getAttribute("POSITION").getArray();
  const idx = prim.getIndices().getArray();
  const weld = new Map();
  const id = new Int32Array(pos.length / 3);
  for (let v = 0; v < id.length; v++) {
    const k = `${pos[v * 3].toFixed(5)},${pos[v * 3 + 1].toFixed(5)},${pos[v * 3 + 2].toFixed(5)}`;
    if (!weld.has(k)) weld.set(k, weld.size);
    id[v] = weld.get(k);
  }
  const parent = Int32Array.from({ length: weld.size }, (_, j) => j);
  const find = (x) => {
    while (parent[x] !== x) x = parent[x] = parent[parent[x]];
    return x;
  };
  for (let t = 0; t < idx.length; t += 3) {
    const a = find(id[idx[t]]);
    parent[find(id[idx[t + 1]])] = a;
    parent[find(id[idx[t + 2]])] = a;
  }
  const groups = new Map();
  for (let t = 0; t < idx.length; t += 3) {
    const r = find(id[idx[t]]);
    if (!groups.has(r)) groups.set(r, []);
    groups.get(r).push(idx[t], idx[t + 1], idx[t + 2]);
  }
  return [...groups.values()].sort((a, b) => b.length - a.length);
}

/** A standalone primitive holding only the given triangles. */
function subset(prim, indices) {
  const p = prim.clone();
  p.setIndices(
    doc.createAccessor().setType("SCALAR").setArray(new Uint32Array(indices)).setBuffer(buffer),
  );
  return compactPrimitive(p);
}

function centroidZ(prim) {
  const pos = prim.getAttribute("POSITION").getArray();
  let z = 0;
  for (let i = 2; i < pos.length; i += 3) z += pos[i];
  return z / (pos.length / 3);
}

function join(prims) {
  const material = prims[0].getMaterial();
  for (const p of prims) {
    p.setMaterial(material);
    p.setAttribute("TANGENT", null);
  }
  return prims.length === 1 ? prims[0] : joinPrimitives(prims);
}

const [heelTrim, toeCap] = components(src[2]).map((ix) => subset(src[2], ix));
const [sideA, sideB] = components(src[6]).map((ix) => subset(src[6], ix));
// +Z faces the studio's default camera → that's the "outer" side
const [sideOuter, sideInner] = centroidZ(sideA) > centroidZ(sideB) ? [sideA, sideB] : [sideB, sideA];

const eyelets = src[9];
weldPrimitive(eyelets);
simplifyPrimitive(eyelets, { simplifier: MeshoptSimplifier, ratio: 0.35, error: 0.002 });

/** Output node name → [part key, primitive]. Node names = three.js mesh names. */
const pieces = {
  toeCap: ["toeCap", toeCap],
  sideOuter: ["sideOuter", sideOuter],
  sideInner: ["sideInner", sideInner],
  heel: ["heel", join([heelTrim, src[3]])],
  tongue: ["tongue", join([src[7]])],
  laces: ["laces", join([src[8]])],
  eyelets: ["eyelets", join([eyelets])],
  lining: ["lining", join([src[0], src[5]])],
  sole: ["sole", join([src[1]])],
  soleTread: ["sole", src[4]], // keeps its own tread normal map
};

for (const node of root.listNodes()) node.dispose();
for (const [name, [part, prim]] of Object.entries(pieces)) {
  const mesh = doc.createMesh(name).addPrimitive(prim);
  scene.addChild(doc.createNode(name).setMesh(mesh).setExtras({ part }));
}

// 4 — clean + compress (scene-wide quantisation keeps one shared local frame)
await doc.transform(
  prune(),
  dedup(),
  meshopt({ encoder: MeshoptEncoder, level: "medium", quantizationVolume: "scene" }),
);
await io.write(OUT, doc);

const b = getBounds(scene);
console.log(`wrote ${OUT}`);
console.log(`bounds min ${b.min.map((v) => v.toFixed(3))} max ${b.max.map((v) => v.toFixed(3))}`);
for (const n of scene.listChildren()) {
  const p = n.getMesh().listPrimitives()[0];
  console.log(`  ${n.getName().padEnd(10)} part=${n.getExtras().part.padEnd(9)} verts=${p.getAttribute("POSITION").getCount()}`);
}
