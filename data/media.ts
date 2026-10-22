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
  pop: string; // a complementary colour from the artwork, for small details (must read on bg)
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
    // straw-hat yellow, Luffy's red, the sea-dragon's blue
    vibe: {
      bg: "#f3c95a",
      glow: "#fde7a3",
      word: "#feedbb",
      ink: "#2a1a0c",
      muted: "#5c3d17",
      accent: "#a8221a",
      accentInk: "#fff6e0",
      accentOnCream: "#a8221a",
      pop: "#1b538f",
      glass: "rgb(255 246 222 / 0.6)",
      line: "rgb(42 26 12 / 0.16)",
      shade: "rgb(110 70 10 / 0.42)",
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
    // nori green-black, ginger cats, rice-white text, a touch of salmon
    vibe: {
      bg: "#15201a",
      glow: "#26352b",
      word: "#2f4034",
      ink: "#f7f1e3",
      muted: "#c2bba8",
      accent: "#f7943a",
      accentInk: "#15201a",
      accentOnCream: "#b0521a",
      pop: "#ff9f8a",
      glass: "rgb(38 50 42 / 0.66)",
      line: "rgb(243 238 226 / 0.16)",
      shade: "rgb(0 0 0 / 0.6)",
    },
  },
  {
    slug: "cherry-blossoms",
    name: "Cherry blossoms",
    photo: {
      src: "/work/cherry-blossoms/cover.webp",
      alt: "The remade pair stacked on each other: white Air Force 1s with pink Swooshes and pink cherry blossoms with golden centres on brown branches.",
      cutout: true,
    },
    caption: "cherry blossoms, ruined once and remade a year later",
    word: ["CHERRY", "BLOSSOMS"],
    pose: { x: "0%", y: "-1%", rotate: -3, scale: 0.98 },
    // blossom pink, buttery cream, the branches' brown, the flowers' golden centres
    vibe: {
      bg: "#f2c6c5",
      glow: "#fbe6cf",
      word: "#fcefe4",
      ink: "#3b2116",
      muted: "#6b4232",
      accent: "#7a3f1f",
      accentInk: "#fff4e3",
      accentOnCream: "#8c4a24",
      pop: "#775000",
      glass: "rgb(255 244 234 / 0.62)",
      line: "rgb(59 33 22 / 0.16)",
      shade: "rgb(122 63 31 / 0.34)",
    },
  },
  {
    slug: "tattoo-cats",
    name: "Tattoo cats",
    photo: {
      src: "/work/tattoo-cats/cover-side-2.webp",
      alt: "The right shoe from the side: a cat asleep inside a heart with a crescent moon near the heel and a cat reaching up for a butterfly near the toe, with the left shoe and its moon cat behind it.",
      cutout: true,
    },
    caption: "tattoo cats, still there after two machine washes",
    word: ["TATTOO", "CATS"],
    pose: { x: "0%", y: "-1%", rotate: -2, scale: 0.98 },
    // warm ink black, white leather, rose-red flowers, the iridescent Swoosh's lilac
    vibe: {
      bg: "#262123",
      glow: "#3a3236",
      word: "#4a4045",
      ink: "#f8f2ee",
      muted: "#c9bdb9",
      accent: "#f0716a",
      accentInk: "#1f1a1c",
      accentOnCream: "#b23a33",
      pop: "#c9b6f5",
      glass: "rgb(52 45 48 / 0.66)",
      line: "rgb(248 242 238 / 0.16)",
      shade: "rgb(0 0 0 / 0.5)",
    },
  },
];

/** The palette of a pair in the rotation, also used to theme its project page. */
export function vibeFor(slug: string): VibePalette | undefined {
  return heroShowcase.find((s) => s.slug === slug)?.vibe;
}

/** Photo for the graduation caps card on the homepage. */
export const beyondPhotos: { caps: PhotoData | null } = {
  caps: {
    src: "/work/graduation-caps/both-caps.jpg",
    alt: "Two hand-painted graduation caps side by side: one with a floral stethoscope design, one with an anatomical heart and flowers.",
  },
};

/** Video on /process (materials & sealing walkthrough). */
export const processVideo: VideoData | null = null;
