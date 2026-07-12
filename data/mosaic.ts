/**
 * "Mosaic of my life" tiles for the About page and homepage collage.
 * PLACEHOLDER content — swap labels for real photos/videos over time.
 */

export interface MosaicTileData {
  id: string;
  label: string;
  note?: string; // handwritten sticker note
  colors: string[];
  size: "sm" | "md" | "lg"; // controls grid span
  kind: "photo" | "video" | "swatch" | "note";
}

export const lifeMosaic: MosaicTileData[] = [
  { id: "m1", label: "Sneakers in progress", note: "the main canvas", colors: ["#e2745f", "#f2ecdf", "#40405c"], size: "lg", kind: "photo" },
  { id: "m2", label: "Paint water, hour four", colors: ["#8fb8de", "#b7a6e3"], size: "sm", kind: "photo" },
  { id: "m3", label: "Process reel", note: "sound on", colors: ["#17141d", "#e2745f"], size: "md", kind: "video" },
  { id: "m4", label: "Graduation caps for two friends", note: "before September!", colors: ["#2f2440", "#b7a6e3", "#d8b47a"], size: "md", kind: "photo" },
  { id: "m-nail", label: "Nail art, tiny canvases", note: "just starting", colors: ["#f5f0e6", "#8f9b82", "#d8c69a"], size: "sm", kind: "photo" },
  { id: "m-presson", label: "Custom press-ons", colors: ["#cad0be", "#a56a44", "#5f6f52"], size: "sm", kind: "photo" },
  { id: "m5", label: "Tokyo street palette", note: "one day, in person", colors: ["#f6c9d4", "#d8b47a", "#141a2e"], size: "sm", kind: "swatch" },
  { id: "m6", label: "Fashion & thrift finds", colors: ["#d8b47a", "#e5dccb"], size: "sm", kind: "photo" },
  { id: "m7", label: "Beauty experiments", colors: ["#f6c9d4", "#e2745f"], size: "sm", kind: "photo" },
  { id: "m8", label: "Travel film photos", colors: ["#8fb8de", "#5c6b4c", "#e5dccb"], size: "md", kind: "photo" },
  { id: "m9", label: "Gaming nights", note: "co-op only", colors: ["#2b3a67", "#b7a6e3"], size: "sm", kind: "photo" },
  { id: "m10", label: "Food I refuse to gatekeep", colors: ["#e2745f", "#d8b47a"], size: "sm", kind: "photo" },
  { id: "m11", label: "Sketchbook pages", colors: ["#f2ecdf", "#a89f92"], size: "md", kind: "photo" },
  { id: "m12", label: "Tiny websites, built together", note: "with my favourite developer", colors: ["#0f0d12", "#e2745f", "#b7a6e3"], size: "md", kind: "note" },
  { id: "m13", label: "Moodboards that got out of hand", colors: ["#b7a6e3", "#f6c9d4", "#d8b47a"], size: "sm", kind: "swatch" },
  { id: "m14", label: "Behind the scenes", note: "the messy desk is the studio", colors: ["#17141d", "#a89f92"], size: "lg", kind: "video" },
];
