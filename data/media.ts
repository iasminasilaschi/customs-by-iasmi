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

/**
 * Colours a pair brings with it while it's on the homepage stage. The hero,
 * the nav and the accents further down the page all wash into them.
 * Take them from the shoe's own paint.
 */
export interface VibePalette {
  bg: string; // hero background
  glow: string; // soft light behind the shoe
  word: string; // giant word behind the shoe (stays close to bg)
  ink: string; // text on bg
  muted: string; // secondary text on bg
  accent: string; // italic headline, main button, progress line
  accentInk: string; // text on the accent button
  accentOnCream: string; // italics + links in the cream sections below (must read on cream)
  glass: string; // nav pill background
  line: string; // hairlines and hover tints
  shade: string; // shoe and button shadows
}

/** One pair in the homepage hero rotation. */
export interface ShowcaseSlide {
  slug: string; // its project; the shoe and caption link to /projects/<slug>
  name: string; // short label on the switcher
  photo: PhotoData; // a transparent cutout
  caption: string;
  word: string[]; // giant word behind the shoe, one entry per line
  pose: { x: string; y: string; rotate: number; scale: number }; // how it rests on stage
  vibe: VibePalette;
}

/**
 * Homepage hero: the pairs take turns on stage, a few seconds each.
 * Adding one = its cutout + a palette. With a single entry it just stands
 * still; with none, the hero shows the headline alone.
 */
export const heroShowcase: ShowcaseSlide[] = [
  {
    slug: "one-piece-sneakers",
    name: "One Piece",
    photo: {
      src: "/work/one-piece-sneakers/cover.webp",
      alt: "A pair of hand-painted One Piece sneakers stacked on each other: Zoro with three swords on one shoe, Luffy in his straw hat on the other.",
      cutout: true,
    },
    caption: "the One Piece pair, after a year of daily wear",
    word: ["ONE", "PIECE"],
    pose: { x: "0%", y: "-2%", rotate: -3, scale: 0.98 },
    // straw-hat gold, Luffy's red hat band
    vibe: {
      bg: "#ecd49b",
      glow: "#f8e9c3",
      word: "#faeccb",
      ink: "#2b1f14",
      muted: "#5e4a2e",
      accent: "#a3342a",
      accentInk: "#fbf1dd",
      accentOnCream: "#a3342a",
      glass: "rgb(251 244 226 / 0.62)",
      line: "rgb(43 31 20 / 0.16)",
      shade: "rgb(92 62 20 / 0.42)",
    },
  },
  {
    slug: "sushi-cats",
    name: "Sushi cats",
    photo: {
      src: "/work/sushi-cats/cover.webp",
      alt: "The pair of black Air Force 1s: a ginger cat peeking out of a nori-wrapped maki on the front shoe, and a cat curled inside a ring of rice on the shoe behind it.",
      cutout: true,
    },
    caption: "sushi cats, a birthday gift for a best friend",
    word: ["SUSHI", "CATS"],
    pose: { x: "4%", y: "0%", rotate: 4, scale: 1 },
    // nori night, tangerine cats, rice-white text
    vibe: {
      bg: "#1c1f1b",
      glow: "#30352d",
      word: "#30352d",
      ink: "#f3eee2",
      muted: "#bdb5a3",
      accent: "#e8913f",
      accentInk: "#1c1f1b",
      accentOnCream: "#b0521a",
      glass: "rgb(42 46 39 / 0.66)",
      line: "rgb(243 238 226 / 0.16)",
      shade: "rgb(0 0 0 / 0.6)",
    },
  },
  {
    slug: "tattoo-cats",
    name: "Tattoo cats",
    photo: {
      src: "/work/tattoo-cats/cover.webp",
      alt: "The pair seen from the heels: a cat sitting on a crescent moon with a red flower on the left shoe, a cat on a looping heart on the right one, and a small black cat paw on each heel under the upside-down Nike Air logo.",
      cutout: true,
    },
    caption: "tattoo cats, still there after two machine washes",
    word: ["TATTOO", "CATS"],
    pose: { x: "0%", y: "-1%", rotate: -2, scale: 0.97 },
    // soft warm black, white leather, the little red flowers
    vibe: {
      bg: "#2b2828",
      glow: "#383333",
      word: "#4a4443",
      ink: "#f4efea",
      muted: "#c4bab4",
      accent: "#e5706a",
      accentInk: "#221e1e",
      accentOnCream: "#b23a33",
      glass: "rgb(52 48 48 / 0.66)",
      line: "rgb(244 239 234 / 0.16)",
      shade: "rgb(0 0 0 / 0.5)",
    },
  },
];

/** Photo for the graduation caps card on the homepage. */
export const beyondPhotos: { caps: PhotoData | null } = {
  caps: {
    src: "/work/graduation-caps/both-caps.jpg",
    alt: "Two hand-painted graduation caps side by side: one with a floral stethoscope design, one with an anatomical heart and flowers.",
  },
};

/** Video on /process (materials & sealing walkthrough). */
export const processVideo: VideoData | null = null;
