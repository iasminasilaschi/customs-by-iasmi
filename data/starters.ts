/**
 * Design starters — curated jumping-off points so nobody faces a blank page.
 * MOCK DATA: palettes and budgets are placeholders to be refined with real pricing.
 */

export interface DesignStarter {
  id: string;
  title: string;
  vibe: string;
  description: string;
  tags: string[];
  palette: string[]; // hex — drives the sneaker preview in the Design Lab
  complexity: "gentle" | "detailed" | "full canvas";
  estimatedBudgetRange: string; // placeholder ranges
}

export const designStarters: DesignStarter[] = [
  {
    id: "s1",
    title: "Tokyo Bloom",
    vibe: "soft, romantic, a little nostalgic",
    description: "Cherry blossom fades, gold ink, lots of negative space.",
    tags: ["floral", "japan", "gold ink"],
    palette: ["#f6c9d4", "#e2745f", "#d8b47a", "#f2ecdf"],
    complexity: "detailed",
    estimatedBudgetRange: "€180–260",
  },
  {
    id: "s2",
    title: "Midnight Ink",
    vibe: "dark, calm, tattoo-adjacent",
    description: "Deep navy base, fine white linework, one gold accent.",
    tags: ["ink", "linework", "minimal"],
    palette: ["#141a2e", "#2b3a67", "#f2ecdf", "#d8b47a"],
    complexity: "detailed",
    estimatedBudgetRange: "€170–240",
  },
  {
    id: "s3",
    title: "Chrome Butterfly",
    vibe: "y2k, shiny, main character",
    description: "Metallic blues and lilacs, butterflies, a hidden lyric.",
    tags: ["y2k", "metallic", "statement"],
    palette: ["#8fb8de", "#b7a6e3", "#40405c", "#f2ecdf"],
    complexity: "full canvas",
    estimatedBudgetRange: "€220–320",
  },
  {
    id: "s4",
    title: "Cotton Cloud",
    vibe: "gentle, dreamy, everyday",
    description: "Soft sky fades and tiny clouds — quiet enough for daily wear.",
    tags: ["pastel", "minimal", "everyday"],
    palette: ["#cfdcec", "#f6c9d4", "#f2ecdf", "#a89f92"],
    complexity: "gentle",
    estimatedBudgetRange: "€140–190",
  },
  {
    id: "s5",
    title: "Botanical Study",
    vibe: "earthy, precise, museum-ish",
    description: "Vintage botanical illustration, warm paper tones, latin labels.",
    tags: ["botanical", "vintage", "illustration"],
    palette: ["#5c6b4c", "#d8b47a", "#e5dccb", "#2f3226"],
    complexity: "detailed",
    estimatedBudgetRange: "€190–270",
  },
  {
    id: "s6",
    title: "Your Obsession",
    vibe: "whatever refuses to leave your brain",
    description: "A film, a song, a city, a pet, a person. Send the mood — we build it from zero.",
    tags: ["one-of-one", "from scratch"],
    palette: ["#e2745f", "#b7a6e3", "#d8b47a", "#0f0d12"],
    complexity: "full canvas",
    estimatedBudgetRange: "quoted per concept",
  },
];
