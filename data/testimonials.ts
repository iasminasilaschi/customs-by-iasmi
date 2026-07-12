/**
 * MOCK TESTIMONIALS — clearly labelled as samples in the UI.
 * Replace with real quotes from first clients/friends (with permission)
 * before launch. Never present these as real reviews.
 */

export interface Testimonial {
  quote: string;
  name: string;
  project: string;
  isSample: true;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "I sent her three photos and a song. The pair that came back felt like it had been mine forever.",
    name: "Sample client",
    project: "Sakura Drift",
    isSample: true,
  },
  {
    quote:
      "She continued my tattoo onto my shoes. People stop me to ask about them constantly.",
    name: "Sample client",
    project: "Midnight Koi",
    isSample: true,
  },
  {
    quote:
      "The process videos were half the joy — watching the pair come alive before it arrived.",
    name: "Sample client",
    project: "Butterfly Static",
    isSample: true,
  },
];
