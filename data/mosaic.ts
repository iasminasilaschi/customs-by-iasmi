/**
 * "Mosaic of my life" — real phone photos for the About page and homepage.
 * Empty until real photos are added; both sections hide themselves when empty.
 */
import type { PhotoData } from "@/data/media";

export interface MosaicTileData {
  id: string;
  photo: PhotoData;
  label?: string; // short caption
  note?: string; // handwritten sticker note
  size: "sm" | "md" | "lg"; // controls grid span
}

export const lifeMosaic: MosaicTileData[] = [];
