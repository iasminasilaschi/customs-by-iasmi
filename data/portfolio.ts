/**
 * REAL pieces only. To add one:
 *   1. put its photos in /public/work/<slug>/ (see public/work/README.md)
 *   2. add an entry to `portfolio` below
 * Every optional field (story, steps, materials, video, before/after) is
 * simply hidden on the page when left out — never invent them.
 */
import type { PhotoData, VideoData } from "@/data/media";

export type PortfolioCategory =
  | "sneakers"
  | "graduation-caps"
  | "process"
  | "sketches";

export const categoryLabels: Record<PortfolioCategory, string> = {
  sneakers: "Sneakers",
  "graduation-caps": "Graduation caps",
  process: "Process",
  sketches: "Sketches",
};

export interface PortfolioPiece {
  slug: string; // also the folder name in /public/work/
  title: string;
  subtitle: string; // one line, shown on cards
  category: PortfolioCategory;
  year: number;
  cover: PhotoData; // card + page hero
  gallery?: PhotoData[]; // finished-piece photos
  processPhotos?: PhotoData[]; // making-of photos
  video?: VideoData; // making-of video
  before?: PhotoData;
  after?: PhotoData;
  instagramUrl?: string; // link to the real post, if it was posted
  reelUrl?: string; // link to a reel
  tags?: string[];
  baseShoe?: string;
  story?: string; // her own words
  processSteps?: string[];
  materials?: string[];
  time?: string; // rough hands-on time, e.g. "about 20 hours"
  learned?: string[]; // honest lessons from making it
  featured?: boolean; // shown on the homepage (max 3)
}

export const portfolio: PortfolioPiece[] = [
  {
    slug: "doctor-cu-suflet-si-ratiune",
    title: "Doctor cu suflet și rațiune",
    subtitle: "Flowers, a stethoscope and her own words: a delicate pink cap, painted by hand for Patri.",
    category: "graduation-caps",
    year: 2026,
    featured: true,
    tags: ["hand-painted", "graduation cap", "medicine", "florals"],
    cover: {
      src: "/work/doctor-cu-suflet-si-ratiune/cover.jpg",
      alt: "Close-up of the finished graduation cap, held out to the camera: pink flowers, green leaves, a gold and pink stethoscope and the words “doctor cu suflet și rațiune 2026”.",
    },
    story:
      "Patri found an inspiration picture online and used ChatGPT to make it hers, with her own words already in place: “doctor cu suflet și rațiune”, a doctor with soul and reason. That picture was the whole brief, and honestly, it's a lovely way to use AI: take something you love and personalise it. AI pictures aren't always realistic to paint, but this time it was the happy, useful kind. My part was turning AI into reality, 1:1, with my own two hands, and I think the real cap turned out even better than the reference: accurate, but real and cute, and very her.\n\nThe stethoscope is the part I'm proudest of. I spent ages on its shadows so it pops almost 3D instead of looking flat, and the tiny white dots all over the cap gave it so much life. I fussed over the leaves way too much, mixing Angelus Avocado and Olive until the green felt right, then giving them differently coloured edges and details. The flowers took so many shades of pink and darker burgundy before the palette matched. And the year got its own little custom touch at the bottom of the cap.",
    processSteps: [
      "Patri's reference: an inspiration picture she personalised with ChatGPT",
      "Sketch on paper, transferred onto the cap with white graphite paper",
      "White base layers, so the colours stay bright on black",
      "Base colours: pinks, greens and gold",
      "Shadows and highlights on the stethoscope",
      "Flower and leaf details, tiny white dots",
      "Touch-ups and sharper edges with black paint",
      "Angelus flat finisher, in case it rained on the day",
    ],
    materials: [
      "Angelus leather paints",
      "Angelus Avocado + Olive, mixed for the leaves",
      "Angelus 2-Soft",
      "White graphite transfer paper",
      "Angelus flat finisher",
    ],
    time: "Roughly 20 hours of painting, over about two weeks (alongside a second cap)",
    instagramUrl: "https://www.instagram.com/p/DduCNfajTcy/",
    reelUrl: "https://www.instagram.com/reel/Dd1_4IEtR9P/",
    learned: [
      "Regular graphite transfer paper is basically invisible on a black cap, and going over it with white crayon didn't save it. White graphite paper was life-changing.",
      "Black paint is my eraser: I used it to fix stray spots, sharpen blurry edges and even reshape letters. The two o's in “doctor” looked like cousins, not sisters, until I blacked parts of them out.",
    ],
    gallery: [
      { src: "/work/doctor-cu-suflet-si-ratiune/01.jpg", alt: "Patri, seen from behind on graduation day, wearing the cap in front of a flower-covered swing." },
      { src: "/work/doctor-cu-suflet-si-ratiune/02.jpg", alt: "The finished cap photographed flat against a light background." },
      { src: "/work/doctor-cu-suflet-si-ratiune/03.jpg", alt: "Close-up of a pink lily and the shaded gold stethoscope chestpiece." },
      { src: "/work/doctor-cu-suflet-si-ratiune/04.jpg", alt: "Close-up of the flower crown and the hand-lettered “doctor”." },
      { src: "/work/doctor-cu-suflet-si-ratiune/05.jpg", alt: "The right side of the cap with the stethoscope tubing and the year 2026 at the bottom." },
      { src: "/work/doctor-cu-suflet-si-ratiune/06.jpg", alt: "Angled close-up of the lettering, flowers and stethoscope." },
      { src: "/work/doctor-cu-suflet-si-ratiune/07.jpg", alt: "The finished cap held up outdoors in natural light." },
      { src: "/work/doctor-cu-suflet-si-ratiune/08.jpg", alt: "The cap at the graduation ceremony, with fireworks and confetti behind it." },
      { src: "/work/doctor-cu-suflet-si-ratiune/09.jpg", alt: "The finished cap held up against a white wall." },
    ],
    processPhotos: [
      { src: "/work/doctor-cu-suflet-si-ratiune/making-01.jpg", alt: "A blank cap held in front of a monitor showing the reference.", caption: "The blank cap, with Patri's reference on screen." },
      { src: "/work/doctor-cu-suflet-si-ratiune/making-02.jpg", alt: "A faint, partial white sketch on the cap.", caption: "First try: regular graphite paper plus white crayon. I could barely see a thing." },
      { src: "/work/doctor-cu-suflet-si-ratiune/making-03.jpg", alt: "A pencil sketch on paper taped over the cap.", caption: "The sketch on paper, taped over the cap for transfer." },
      { src: "/work/doctor-cu-suflet-si-ratiune/making-04.jpg", alt: "The full design transferred in thin white lines onto the cap.", caption: "Second try, with white graphite paper. So much better." },
      { src: "/work/doctor-cu-suflet-si-ratiune/making-05.jpg", alt: "The design blocked in with a first thin white layer.", caption: "First white base layer, so the colours stay bright on black." },
      { src: "/work/doctor-cu-suflet-si-ratiune/making-06.jpg", alt: "The white base layer, more opaque.", caption: "More white. The black fabric drinks paint." },
      { src: "/work/doctor-cu-suflet-si-ratiune/making-07.jpg", alt: "Flat pink, green and gold base colours on the cap.", caption: "Base colours: pinks, greens and gold." },
      { src: "/work/doctor-cu-suflet-si-ratiune/making-08.jpg", alt: "Close-up of the gold stethoscope chestpiece with shading in progress.", caption: "Shading the stethoscope chestpiece, my favourite part." },
      { src: "/work/doctor-cu-suflet-si-ratiune/making-09.jpg", alt: "Close-up of the stethoscope earpieces with highlights, paints in the background.", caption: "The earpieces getting their shadows and shine." },
      { src: "/work/doctor-cu-suflet-si-ratiune/making-10.jpg", alt: "The cap with some flowers detailed and others still flat.", caption: "Flower details, one by one." },
      { src: "/work/doctor-cu-suflet-si-ratiune/making-11.jpg", alt: "The cap with all flowers detailed.", caption: "All the flowers done." },
      { src: "/work/doctor-cu-suflet-si-ratiune/making-12.jpg", alt: "The cap with tiny white dot details on part of the design.", caption: "Halfway through the tiny white dots." },
      { src: "/work/doctor-cu-suflet-si-ratiune/making-13.jpg", alt: "The finished cap against a white wall.", caption: "Finished." },
    ],
  },
  {
    slug: "superpower-called-empathy",
    title: "You have a superpower",
    subtitle: "…and it's called empathy. An anatomical heart blooming with flowers, painted for Andreea.",
    category: "graduation-caps",
    year: 2026,
    featured: true,
    tags: ["hand-painted", "graduation cap", "medicine", "anatomical heart", "florals"],
    cover: {
      src: "/work/superpower-called-empathy/cover.jpg",
      alt: "Andreea wearing the finished cap at her graduation: a red anatomical heart with pink flowers and the words “You have a superpower and it's called empathy”.",
    },
    story:
      "Andreea fell for a cap she found on Pinterest, a heart with flowers growing out of it like a vase, but she loved the words from a different cap. So she sent me both: the design from one, the text from the other. Fitting them together was up to me.\n\nMy first draft put the text too low, and it looked off-centre. (I jokingly asked if we could just delete a word.) Instead I erased the whole text and started again until all of it sat nicely next to the heart.\n\nThe most fun part was the blending. The heart needed a lot of it so the shadows and very subtle highlights felt cohesive, and on the flowers I blended pink at the petal edges into white at the centres. A little Angelus 2-Soft made the paint more liquid, so the colours melted into each other even more nicely.",
    processSteps: [
      "Two Pinterest references: the design from one, the words from another",
      "Paper sketch, then redrawn when the first text sat too low",
      "Sketch transferred onto the cap in white",
      "White base layers under everything",
      "Colour, with lots of blending on the heart and petals",
      "Heart and flower details",
      "Clean-up and sharper edges with black paint",
      "Angelus flat finisher, in case it rained on the day",
    ],
    materials: [
      "Angelus leather paints",
      "Angelus 2-Soft, for smoother blending",
      "White graphite transfer paper",
      "Angelus flat finisher",
    ],
    time: "Roughly 20 hours of painting, over about two weeks (alongside a second cap)",
    instagramUrl: "https://www.instagram.com/p/DddqoOLDYcu/",
    learned: [
      "Angelus 2-Soft thins the paint and keeps it flexible. Great for blending, terrible for sharp details, and caps don't need to bend anyway, so most details ended up in bare paint.",
      "Mixed 1:1 with 2-Soft, my white base was so thin the black cap soaked it up. Some of the lettering took about seven layers.",
      "The graduation was outdoors in a park, so both caps got a coat of Angelus flat finisher, just in case it rained.",
    ],
    gallery: [
      { src: "/work/superpower-called-empathy/01.jpg", alt: "Andreea, seen from behind on graduation day, wearing the cap on a flower-covered swing." },
      { src: "/work/superpower-called-empathy/02.jpg", alt: "The cap on Andreea's head at the graduation, in natural light." },
      { src: "/work/superpower-called-empathy/03.jpg", alt: "The finished cap lying in its box." },
      { src: "/work/superpower-called-empathy/04.jpg", alt: "Angled close-up of the heart, flowers and white lettering." },
      { src: "/work/superpower-called-empathy/05.jpg", alt: "Close-up of the blended red heart with pink flowers and white dots." },
      { src: "/work/superpower-called-empathy/06.jpg", alt: "Close-up of the pink-and-white blended flower petals." },
      { src: "/work/superpower-called-empathy/07.jpg", alt: "The finished cap photographed flat against a light background." },
    ],
    processPhotos: [
      { src: "/work/superpower-called-empathy/making-01.jpg", alt: "A pencil sketch on paper held over the cap, with the text faint and low.", caption: "First paper sketch. The text sat too low and looked off-centre." },
      { src: "/work/superpower-called-empathy/making-02.jpg", alt: "A redrawn paper sketch with bolder text placed beside the heart.", caption: "Redrawn from scratch, so the words fit next to the heart." },
      { src: "/work/superpower-called-empathy/making-03.jpg", alt: "The design transferred in thin white lines onto the cap.", caption: "The sketch transferred onto the cap in white." },
      { src: "/work/superpower-called-empathy/making-04.jpg", alt: "The design partly filled with white base paint.", caption: "White base layers going in." },
      { src: "/work/superpower-called-empathy/making-05.jpg", alt: "Close-up of white lettering on black fabric, still uneven.", caption: "The lettering a few layers in. The cap soaked up so much white." },
      { src: "/work/superpower-called-empathy/making-06.jpg", alt: "The whole design painted in white.", caption: "The whole design in white." },
      { src: "/work/superpower-called-empathy/making-07.jpg", alt: "First pink tones going onto the heart and flowers.", caption: "Colour starts going on." },
      { src: "/work/superpower-called-empathy/making-08.jpg", alt: "Close-up of the heart in a flat pink base colour with dark vein lines.", caption: "The heart's base colour, before the blending." },
      { src: "/work/superpower-called-empathy/making-09.jpg", alt: "The cap with all base colours down.", caption: "All the colours down." },
      { src: "/work/superpower-called-empathy/making-10.jpg", alt: "The heart with shading and veins detailed.", caption: "Heart details: veins, shadows and highlights." },
      { src: "/work/superpower-called-empathy/making-11.jpg", alt: "The cap with detailed flowers around the heart.", caption: "Flower details, pink edges blended into white centres." },
      { src: "/work/superpower-called-empathy/making-12.jpg", alt: "The finished cap against a light background.", caption: "Finished." },
    ],
  },
];

export function getPiece(slug: string): PortfolioPiece | undefined {
  return portfolio.find((p) => p.slug === slug);
}

/** Where "Request something like this" goes: caps → contact form, rest → Design Lab. */
export function requestHref(piece: PortfolioPiece): string {
  return piece.category === "graduation-caps"
    ? "/contact?type=cap"
    : `/design-lab?ref=${piece.slug}`;
}

export const featuredPieces = portfolio.filter((p) => p.featured);
