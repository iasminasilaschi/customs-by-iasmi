/**
 * FAQ content. Wording around returns/copyright is intentionally careful:
 * no fake legal guarantees. Final policy text must be reviewed before
 * accepting paid orders — see docs/LEGAL-AND-CONTENT-NOTES.md.
 */

export interface FAQItem {
  question: string;
  answer: string;
  category: "ordering" | "wear & care" | "designs & rights" | "policies";
}

export const faqItems: FAQItem[] = [
  {
    question: "How do I order a custom pair?",
    answer:
      "Send your idea through the Design Lab form (or just email / DM me). We agree on the concept, base shoe, budget and timing, I sketch the direction, and a deposit confirms your slot. Then I paint, seal, document the process, and ship your pair.",
    category: "ordering",
  },
  {
    question: "Can I send my own shoes?",
    answer:
      "Yes — many clients send a pair they already own, including well-loved ones (light restoration is possible). Clean, deliver or ship them to me and they become the canvas.",
    category: "ordering",
  },
  {
    question: "Can you source the shoes for me?",
    answer:
      "Yes. Tell me the model and size and I'll source a new pair; the shoe cost is added to the quote. I'll always confirm the exact model and price with you before buying.",
    category: "ordering",
  },
  {
    question: "Can I pay a deposit instead of the full price?",
    answer:
      "Yes — commissions are deposit-based. A deposit confirms your slot and covers materials; the remainder is due before shipping. Exact split is agreed per project.",
    category: "ordering",
  },
  {
    question: "Can I gift a custom pair?",
    answer:
      "Absolutely — customs make ridiculous(ly good) gifts. I can work from the recipient's story secretly, include a small card, and time delivery for the occasion. Gift processes for graduation caps work the same way.",
    category: "ordering",
  },
  {
    question: "Are the shoes actually wearable?",
    answer:
      "Yes. I use flexible leather acrylics made for footwear, heat-set the layers, and seal every pair with a finisher. They are made to be worn — flex-tested and water-bead-tested before shipping.",
    category: "wear & care",
  },
  {
    question: "Are they waterproof?",
    answer:
      "Water-resistant, not waterproof. Sealed paint handles rain and everyday life, but customs are hand-painted artwork: avoid machine washing, soaking, and mud baths. Treat them like a leather jacket, not a rain boot.",
    category: "wear & care",
  },
  {
    question: "How do I clean them?",
    answer:
      "Wipe gently with a soft, slightly damp cloth. No machine washing, no soaking, no harsh solvents, no aggressive scrubbing on painted zones. Every pair ships with its own care card.",
    category: "wear & care",
  },
  {
    question: "Will the paint crack?",
    answer:
      "Painted shoes flex, so hairline creasing on high-flex zones (like toe boxes) can appear over time — that's the nature of hand-painted footwear, and I design around those zones to minimise it. If something genuinely fails early, contact me and we'll fix it.",
    category: "wear & care",
  },
  {
    question: "Can you copy an exact copyrighted artwork, logo, or character?",
    answer:
      "I don't reproduce copyrighted art, brand logos, or characters 1:1 — that work belongs to its creators. What I can do is paint something original inspired by an aesthetic, palette, era, or mood you love. Inspired-by, not copied.",
    category: "designs & rights",
  },
  {
    question: "Can I request anime / cartoon / brand-inspired designs?",
    answer:
      "You can absolutely bring those as inspiration. I'll create an original interpretation of the vibe — colours, atmosphere, motifs — rather than tracing existing frames or logos. It usually ends up more personal anyway.",
    category: "designs & rights",
  },
  {
    question: "Do you accept returns?",
    answer:
      "Because every pair is made to order and personalised to you, custom commissions generally can't be returned for a change of mind — this is standard for personalised handmade goods. If something arrives faulty or damaged, contact me right away and we'll sort it out properly. (Full policies are being finalised and will be published before paid orders open.)",
    category: "policies",
  },
  {
    question: "What if there's a problem with my custom pair?",
    answer:
      "Message me with photos within a few days of delivery. Genuine faults — sealing issues, damage in transit — will be repaired, repainted, or otherwise made right. Your legal rights regarding faulty products are never affected by a piece being custom-made.",
    category: "policies",
  },
  {
    question: "Do you customise fakes/replicas?",
    answer:
      "No. I paint on authentic base shoes only — either sourced new from retail or supplied by you.",
    category: "policies",
  },
];

export const faqCategories = ["ordering", "wear & care", "designs & rights", "policies"] as const;
