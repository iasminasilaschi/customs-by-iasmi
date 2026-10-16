/**
 * Shared media types + the handful of site-wide photos (hero, "beyond
 * sneakers" cards, process video). Everything here is REAL or empty: when a
 * value is `null`, the section simply doesn't render that image.
 *
 * Files live in /public — see public/work/README.md for the folder layout.
 * Paths start with "/", e.g. "/work/one-piece-sneakers/cover.jpg".
 */

export interface PhotoData {
  src: string;
  alt: string; // one plain sentence describing what's in the photo
  caption?: string; // optional visible caption (e.g. a making-of stage)
  cutout?: boolean; // transparent background: shown whole, floating, never cropped
}

export interface VideoData {
  src: string; // e.g. "/work/one-piece-sneakers/process.mp4"
  poster?: string; // still frame shown before play
}

/** Big photo next to the homepage headline (links to its project page). */
export const heroPhoto: (PhotoData & { href: string }) | null = {
  src: "/work/one-piece-sneakers/cover.webp",
  alt: "A pair of hand-painted One Piece sneakers stacked on each other: Zoro with three swords on one shoe, Luffy in his straw hat on the other.",
  caption: "the One Piece pair, after a year of daily wear",
  cutout: true,
  href: "/projects/one-piece-sneakers",
};

/** Photo for the graduation caps card on the homepage. */
export const beyondPhotos: { caps: PhotoData | null } = {
  caps: {
    src: "/work/graduation-caps/both-caps.jpg",
    alt: "Two hand-painted graduation caps side by side: one with a floral stethoscope design, one with an anatomical heart and flowers.",
  },
};

/** Video on /process (materials & sealing walkthrough). */
export const processVideo: VideoData | null = null;
