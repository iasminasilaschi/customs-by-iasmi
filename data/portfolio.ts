/**
 * MOCK DATA — every piece here is a placeholder to shape the layout.
 * Replace with real projects, photos and videos as they are made.
 * `images` entries are labels rendered by <ArtPlaceholder /> until real
 * media exists in /public.
 */

export type PortfolioCategory =
  | "sneakers"
  | "graduation-caps"
  | "nail-art"
  | "process"
  | "sketches"
  | "digital"
  | "life";

export const categoryLabels: Record<PortfolioCategory, string> = {
  sneakers: "Sneakers",
  "graduation-caps": "Graduation caps",
  "nail-art": "Nail art",
  process: "Process",
  sketches: "Sketches",
  digital: "Digital experiments",
  life: "Life mosaic",
};

export interface PortfolioPiece {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: PortfolioCategory;
  tags: string[];
  colors: string[]; // hex palette, drives placeholder art
  baseShoe?: string;
  year: number;
  images: string[]; // labels for placeholder frames (later: real paths)
  videoUrl?: string;
  hasVideo?: boolean;
  beforeLabel?: string;
  afterLabel?: string;
  processSteps: string[];
  materials?: string[];
  story?: string;
  featured: boolean;
}

export const portfolio: PortfolioPiece[] = [
  {
    id: "p1",
    slug: "sakura-drift",
    title: "Sakura Drift",
    subtitle: "Hand-painted cherry blossoms on white leather",
    description:
      "Soft pink gradients, falling petals and a little gold ink — a quiet, romantic pair built around one reference photo from a spring trip.",
    category: "sneakers",
    tags: ["hand-painted", "custom sneakers", "floral", "japan", "gift"],
    colors: ["#f6c9d4", "#e2745f", "#f2ecdf", "#8a6db1"],
    baseShoe: "Nike Air Force 1 (client-supplied)",
    year: 2026,
    images: ["Hero shot — side profile", "Toe cap detail", "Petal close-up", "On-feet"],
    hasVideo: true,
    beforeLabel: "Plain white AF1",
    afterLabel: "Sakura Drift, sealed",
    processSteps: [
      "Moodboard from one photo + three colours",
      "Pencil sketch mapped to shoe zones",
      "Leather prep and masking",
      "Layered acrylic, petal by petal",
      "Gold ink accents",
      "Matte finisher, two coats",
    ],
    materials: ["Angelus leather acrylics", "Gold pigment ink", "Matte acrylic finisher"],
    story:
      "The brief was a single sentence: “make it feel like the week the cherry trees bloomed.” We picked three colours from a photo, kept the rest of the shoe calm, and let the petals drift from heel to toe.",
    featured: true,
  },
  {
    id: "p2",
    slug: "midnight-koi",
    title: "Midnight Koi",
    subtitle: "Ink-dark base, two koi circling the heel",
    description:
      "Deep navy fade with two hand-painted koi and gold ripples — painted for someone who wanted their tattoo continued onto their shoes.",
    category: "sneakers",
    tags: ["hand-painted", "custom sneakers", "ink", "tattoo-inspired"],
    colors: ["#141a2e", "#2b3a67", "#e2745f", "#d8b47a"],
    baseShoe: "Vans Old Skool (sourced by studio)",
    year: 2026,
    images: ["Hero shot", "Heel koi detail", "Ripple texture", "Pair, top-down"],
    hasVideo: true,
    beforeLabel: "Stock black Old Skool",
    afterLabel: "Midnight Koi, sealed",
    processSteps: [
      "Reference: client's forearm tattoo",
      "Digital mock on shoe template",
      "Base fade, navy to ink",
      "Koi linework in white, then colour",
      "Gold ripple accents",
      "Flexible sealant + water test",
    ],
    materials: ["Angelus acrylics", "Fine liner brushes", "Flexible finisher"],
    story:
      "Continuing an existing tattoo means matching someone else's linework — slower, more careful, and worth it. The koi wrap the heel so they only fully meet when the pair stands together.",
    featured: true,
  },
  {
    id: "p3",
    slug: "butterfly-static",
    title: "Butterfly Static",
    subtitle: "Chrome-blue butterflies over a glitchy grey wash",
    description:
      "A louder pair — metallic blue butterflies, scanline texture, and a hidden lyric under the tongue.",
    category: "sneakers",
    tags: ["hand-painted", "custom sneakers", "y2k", "metallic", "before/after"],
    colors: ["#8fb8de", "#b7a6e3", "#40405c", "#f2ecdf"],
    baseShoe: "Adidas Forum Low (client-supplied)",
    year: 2025,
    images: ["Hero shot", "Wing detail", "Hidden lyric", "Sole splash"],
    beforeLabel: "Scuffed white Forums",
    afterLabel: "Butterfly Static, restored + painted",
    processSteps: [
      "Deep clean and restoration first",
      "Grey static wash, dry-brushed",
      "Butterfly stencils cut by hand",
      "Metallic blue layering",
      "Lyric lettering under the tongue",
      "Seal + lace swap",
    ],
    materials: ["Restoration kit", "Metallic acrylics", "Hand-cut stencils"],
    story:
      "This one started as a rescue: a scuffed pair headed for the bin. Restoration first, then paint — the kind of project that proves customs can be a second life, not just decoration.",
    featured: true,
  },
  {
    id: "p4",
    slug: "cap-tiny-worlds",
    title: "Tiny Worlds — Cap №1",
    subtitle: "Graduation cap for a best friend, September 2026",
    description:
      "The first of two custom graduation caps painted for friends — a miniature landscape of everything her degree survived on: coffee, deadlines, and one specific playlist.",
    category: "graduation-caps",
    tags: ["graduation cap", "gift", "hand-painted", "in progress"],
    colors: ["#2f2440", "#b7a6e3", "#d8b47a", "#f2ecdf"],
    year: 2026,
    images: ["Concept sketch", "Colour tests", "Work in progress"],
    processSteps: [
      "Interview: what should this day remember?",
      "Sketch three concepts, pick one",
      "Paint on removable cap topper",
      "Seal for photos and confetti",
    ],
    materials: ["Acrylics", "Cap topper board", "UV-resistant sealer"],
    story:
      "Two caps, two friends, one September. These are real commissions in progress — they will become the first full case studies in this category.",
    featured: true,
  },
  {
    id: "p9",
    slug: "wildflower-pressons",
    title: "Wildflower Press-Ons",
    subtitle: "Hand-painted press-on set — tiny pressed flowers",
    description:
      "A first press-on set: soft cream bases with hand-painted wildflowers and a whisper of gold. A tiny canvas I'm only beginning to explore.",
    category: "nail-art",
    tags: ["nail art", "press-ons", "floral", "hand-painted", "emerging"],
    colors: ["#f5f0e6", "#8f9b82", "#d8c69a", "#a56a44"],
    year: 2026,
    images: ["Full set — cream & sage", "Petal detail", "On-hand mock"],
    processSteps: [
      "Shape and size the set",
      "Cream base coats",
      "Paint each flower by hand",
      "Fine gold detailing",
      "Gloss seal + cure",
    ],
    materials: ["Reusable press-on tips", "Gel colour", "Gloss top coat"],
    story:
      "Sneakers taught me patience on a big canvas; press-ons are the opposite — the same detail, shrunk to a fingernail. This first set is an experiment, honestly labelled as one.",
    featured: false,
  },
  {
    id: "p10",
    slug: "chrome-dusk-pressons",
    title: "Chrome Dusk Press-Ons",
    subtitle: "Muted chrome fade with a hand-drawn line motif",
    description:
      "A duskier set — warm chrome fading into olive, with a single fine line drawn across the tips. Still early days, still learning the material.",
    category: "nail-art",
    tags: ["nail art", "press-ons", "chrome", "minimal", "emerging"],
    colors: ["#cad0be", "#5f6f52", "#7a5c45", "#d8c69a"],
    year: 2026,
    images: ["Full set — olive chrome", "Line motif detail", "On-hand mock"],
    processSteps: [
      "Shape and size the set",
      "Chrome base and fade",
      "Hand-drawn line motif",
      "Seal + cure",
    ],
    story:
      "Press-ons mean someone can wear the art for a weekend and keep the set. That reusability is what pulled me in — low commitment, high detail.",
    featured: false,
  },
  {
    id: "p5",
    slug: "process-sealing-study",
    title: "Sealing & Layering Study",
    subtitle: "Why customs survive real life",
    description:
      "A process log: crack tests, flex tests, water beading on sealed leather. The unglamorous part that makes a painted shoe wearable.",
    category: "process",
    tags: ["process video", "materials", "hand-painted"],
    colors: ["#40405c", "#e2745f", "#a89f92", "#17141d"],
    year: 2026,
    images: ["Flex test frames", "Water bead test", "Layer diagram"],
    hasVideo: true,
    processSteps: [
      "Thin coats beat thick coats",
      "Heat-set between layers",
      "Flex test on every zone",
      "Finisher matched to material",
    ],
    materials: ["Angelus 2-Thin", "Heat gun", "Matte + satin finishers"],
    story:
      "Every pair gets flexed, bent and water-tested before it ships. This entry exists so clients can see exactly what “sealed and wearable” means.",
    featured: false,
  },
  {
    id: "p6",
    slug: "sketchbook-zones",
    title: "Sketchbook: Zone Studies",
    subtitle: "How a moodboard becomes a shoe map",
    description:
      "Pages from the sketchbook — breaking sneakers into paintable zones: toe, quarter, swoosh area, heel, sole wall. The grammar behind every commission.",
    category: "sketches",
    tags: ["sketches", "process", "design system"],
    colors: ["#f2ecdf", "#a89f92", "#e2745f", "#17141d"],
    year: 2025,
    images: ["Zone map spread", "Thumbnail grid", "Colour key tests"],
    processSteps: [
      "Trace silhouette",
      "Divide into zones",
      "Assign moodboard elements per zone",
      "Test three colour keys",
    ],
    story:
      "These zone maps are also the seed of the future Design Lab — one day you'll drag your inspiration onto these exact zones.",
    featured: false,
  },
  {
    id: "p7",
    slug: "palette-experiments",
    title: "Palette Experiments",
    subtitle: "Colour pulled from photos, food, and cities",
    description:
      "An ongoing series: extracting five-colour palettes from travel photos and testing them as fades on leather scraps.",
    category: "life",
    tags: ["personal", "colour", "travel", "moodboard"],
    colors: ["#e2745f", "#b7a6e3", "#d8b47a", "#8fb8de", "#2f2440"],
    year: 2026,
    images: ["Tokyo street palette", "Breakfast palette", "Storm palette"],
    processSteps: ["Pick a photo", "Pull five colours", "Paint a fade", "Archive the swatch"],
    story:
      "Half hobby, half research. The best commissions usually start from one of these swatches.",
    featured: false,
  },
  {
    id: "p8",
    slug: "this-website",
    title: "This studio site, v1",
    subtitle: "The website you are looking at",
    description:
      "First digital experiment: this site. Designed and built as a small collaboration — a mosaic that will slowly grow into a studio.",
    category: "digital",
    tags: ["web experiment", "collaboration", "in progress"],
    colors: ["#2f3a2f", "#8f9b82", "#d8c69a", "#f5f0e6"],
    year: 2026,
    images: ["Homepage design", "Design Lab shell", "Mobile screens"],
    processSteps: [
      "Moodboard the vibe",
      "Design system: sage, cream, gold",
      "Build with Next.js + Tailwind",
      "Ship v1, grow from there",
    ],
    story:
      "Sometimes the canvas is a sneaker. Sometimes it is a webpage. This one is both a portfolio piece and the studio itself.",
    featured: false,
  },
];

export function getPiece(slug: string): PortfolioPiece | undefined {
  return portfolio.find((p) => p.slug === slug);
}

export const featuredPieces = portfolio.filter((p) => p.featured);
