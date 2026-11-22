/**
 * Library uploads, IndexedDB hydration, and project export / import.
 * Images are downscaled in the browser; nothing leaves the device unless
 * she downloads an export herself.
 */

import { z } from "zod";
import { motifs } from "./motifs";
import { idb, type StoredAsset } from "./db";
import { assetSrc, downloadText, stamp } from "./render";
import { emptyLayers, newId, projectOf, usePlanner, type AssetMeta, type ProjectData } from "./store";

const MAX_SIDE = 2048;
export const MAX_FILE_BYTES = 25 * 1024 * 1024;

export const motifAssets: AssetMeta[] = motifs.map((m) => ({
  id: m.id,
  name: m.name,
  width: m.width * 2,
  height: m.height * 2,
  kind: "motif",
}));

/** Size info for any asset id (library uploads or starter motifs). */
export function assetDims(id: string) {
  return usePlanner.getState().assets.find((a) => a.id === id) ?? motifAssets.find((a) => a.id === id);
}

function canvasBlob(c: HTMLCanvasElement, type: string, q?: number) {
  return new Promise<Blob | null>((r) => c.toBlob(r, type, q));
}

/** Downscale an image file to at most 2048px, keeping transparency. */
async function shrink(file: Blob): Promise<{ blob: Blob; width: number; height: number }> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const k = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
    const width = Math.max(1, Math.round(img.naturalWidth * k));
    const height = Math.max(1, Math.round(img.naturalHeight * k));
    if (k === 1 && file.size < 3 * 1024 * 1024) return { blob: file, width, height };
    const c = document.createElement("canvas");
    c.width = width;
    c.height = height;
    c.getContext("2d")!.drawImage(img, 0, 0, width, height);
    // webp keeps alpha and is small; Safari falls back to PNG on its own
    const blob = (await canvasBlob(c, "image/webp", 0.9)) ?? (await canvasBlob(c, "image/png"));
    if (!blob) throw new Error("encode failed");
    return { blob, width, height };
  } finally {
    URL.revokeObjectURL(url);
  }
}

function register(a: StoredAsset): AssetMeta {
  const old = assetSrc.get(a.id);
  if (old?.startsWith("blob:")) URL.revokeObjectURL(old);
  assetSrc.set(a.id, URL.createObjectURL(a.blob));
  return { id: a.id, name: a.name, width: a.width, height: a.height, kind: "upload" };
}

async function save(a: StoredAsset) {
  try {
    await idb.putAsset(a);
  } catch {
    usePlanner.getState().setSaveState("unavailable");
  }
}

/** Add image files to the library. Returns error messages for skipped files. */
export async function addFiles(files: File[]): Promise<{ added: AssetMeta[]; errors: string[] }> {
  const added: AssetMeta[] = [];
  const errors: string[] = [];
  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      errors.push(`${file.name}: not an image`);
      continue;
    }
    if (file.size > MAX_FILE_BYTES) {
      errors.push(`${file.name}: over 25 MB`);
      continue;
    }
    try {
      const { blob, width, height } = await shrink(file);
      const stored: StoredAsset = {
        id: newId("img"),
        name: file.name.replace(/\.[a-z0-9]+$/i, "").slice(0, 60) || "image",
        width,
        height,
        blob,
        addedAt: Date.now(),
      };
      await save(stored);
      added.push(register(stored));
    } catch {
      errors.push(`${file.name}: couldn't read it (try JPG or PNG)`);
    }
  }
  if (added.length) usePlanner.getState().addAssets(added);
  return { added, errors };
}

export async function deleteAsset(id: string) {
  const src = assetSrc.get(id);
  if (src?.startsWith("blob:")) URL.revokeObjectURL(src);
  assetSrc.delete(id);
  usePlanner.getState().removeAsset(id);
  try {
    await idb.deleteAsset(id);
  } catch {
    // nothing saved to delete
  }
}

/** Load the library + the saved project for a pair from IndexedDB. */
export async function hydrate(pairId: string) {
  const st = usePlanner.getState();
  try {
    const stored = await idb.allAssets();
    stored.sort((a, b) => a.addedAt - b.addedAt);
    st.addAssets(stored.map(register));
    const project = await idb.getProject<ProjectData>(pairId);
    if (project) st.loadProject(parseProject(project) ?? { ...projectOf(st), pairId });
  } catch {
    st.setSaveState("unavailable");
  }
  st.setHydrated();
}

/* ---------------------------------------------------------- export/import */

const cropSchema = z.object({ x: z.number(), y: z.number(), w: z.number().positive(), h: z.number().positive() });
const layerSchema = z.object({
  id: z.string().max(80),
  assetId: z.string().max(80),
  x: z.number(),
  y: z.number(),
  w: z.number().positive(),
  rotation: z.number(),
  flipX: z.boolean(),
  opacity: z.number().min(0).max(1),
  paint: z.boolean(),
  clip: z.boolean(),
  crop: cropSchema,
  hidden: z.boolean().default(false),
  zones: z.array(z.enum(["side", "front", "toe", "collar", "heel", "laces", "sole", "inside"])).max(8).optional(),
});
const viewKeys = Object.keys(emptyLayers()) as (keyof ReturnType<typeof emptyLayers>)[];
const projectSchema = z.object({
  pairId: z.string().max(40),
  layers: z.object(Object.fromEntries(viewKeys.map((k) => [k, z.array(layerSchema).max(60).default([])]))),
  feetTogether: z.boolean().default(false),
  innerLayout: z.enum(["soles", "toes"]).default("soles"),
});
const fileSchema = z.object({
  app: z.literal("iasmi-photo-planner"),
  version: z.literal(1),
  project: projectSchema,
  assets: z
    .array(
      z.object({
        id: z.string().max(80),
        name: z.string().max(120),
        width: z.number().positive(),
        height: z.number().positive(),
        dataUrl: z.string().startsWith("data:image/"),
      }),
    )
    .max(400),
});

function parseProject(p: unknown): ProjectData | null {
  const r = projectSchema.safeParse(p);
  return r.success ? (r.data as ProjectData) : null;
}

const blobToDataUrl = (b: Blob) =>
  new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result));
    fr.onerror = () => reject(fr.error);
    fr.readAsDataURL(b);
  });

/** Download the whole project (layers + every library image) as one JSON file. */
export async function exportProject() {
  const st = usePlanner.getState();
  const assets = [];
  for (const a of st.assets) {
    const src = assetSrc.get(a.id);
    if (!src) continue;
    const blob = await (await fetch(src)).blob();
    assets.push({ id: a.id, name: a.name, width: a.width, height: a.height, dataUrl: await blobToDataUrl(blob) });
  }
  const file = { app: "iasmi-photo-planner", version: 1, exportedAt: new Date().toISOString(), project: projectOf(st), assets };
  downloadText(JSON.stringify(file), `photo-planner-${st.pairId}-${stamp()}.json`);
}

/** Replace the current project with an exported file. Throws a friendly message. */
export async function importProject(file: File) {
  if (file.size > 200 * 1024 * 1024) throw new Error("That file is too big to be a planner export.");
  let json: unknown;
  try {
    json = JSON.parse(await file.text());
  } catch {
    throw new Error("That isn't a planner export (not JSON).");
  }
  const r = fileSchema.safeParse(json);
  if (!r.success) throw new Error("That file doesn't look like a photo planner export.");
  const st = usePlanner.getState();
  if (r.data.project.pairId !== st.pairId) throw new Error(`That export is for another pair (“${r.data.project.pairId}”).`);
  const metas: AssetMeta[] = [];
  for (const a of r.data.assets) {
    const blob = await (await fetch(a.dataUrl)).blob();
    const stored: StoredAsset = { id: a.id, name: a.name, width: a.width, height: a.height, blob, addedAt: Date.now() };
    await save(stored);
    metas.push(register(stored));
  }
  st.addAssets(metas);
  st.loadProject(r.data.project as ProjectData);
  st.bumpImages();
}
