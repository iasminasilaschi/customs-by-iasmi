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
  processNote?: string; // short line above the making-of photos, e.g. "video coming soon"
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
    slug: "one-piece-sneakers",
    title: "One Piece, made personal",
    subtitle: "Zoro, Luffy and custom initials in One Piece style: a hand-painted gift, worn hard for a whole year.",
    category: "sneakers",
    year: 2025,
    featured: true,
    baseShoe: "Zara",
    tags: ["hand-painted", "anime", "one piece", "fan art", "custom initials", "gift"],
    cover: {
      src: "/work/one-piece-sneakers/cover.webp",
      alt: "The hand-painted One Piece pair stacked on each other: Zoro with three swords on the right shoe, Luffy in his straw hat with a dragon on the left.",
      cutout: true,
    },
    story:
      "These were a gift for a One Piece lover, and they took a long time: about a month, working on them on and off. He chose the scenes himself. Only the outer side of each shoe is painted, plus the heels: Zoro on the right shoe, and Luffy with a dragon on the left.\n\nI started with the heels. The right one carries the One Piece logo. For the left one I had my favourite idea of the whole project: his initials, R·M·A, designed in the same style as the logo. The little details around the letters are in One Piece spirit, but they're my own ideas, picked to suit the name. I love how matchy and cute the two heels look together, and how personal it made the pair.\n\nThen came the real test. He has worn them for a year now: rain, sunshine, day and night, driving, long walks, no mercy at all. His logic was “if I ruin them, I know who'll fix them.” He brushes them clean often, and a year later the paint still looks impeccable. I'd say they passed with flying colours.",
    processSteps: [
      "Deglazing the whole shoes with acetone and cotton balls",
      "Buffing with sandpaper in several grits, so the paint grips well",
      "Brushing the surface clean",
      "Sketching the designs onto the leather",
      "Heels first: the One Piece logo on the right, the R·M·A initials on the left",
      "Outer panels: Zoro on the right shoe, Luffy and a dragon on the left",
      "Angelus paints in very thin layers, drying in between",
      "Sealing with Angelus flat finisher, plus a coat of sofa leather finisher for extra protection",
    ],
    materials: [
      "Acetone + cotton balls, for deglazing",
      "Sandpaper in several grits",
      "Angelus leather paints",
      "Angelus flat finisher",
      "Leather finisher for sofas, as an extra layer",
    ],
    time: "About a month, working on and off",
    gallery: [
      { src: "/work/one-piece-sneakers/01.jpg", alt: "The left shoe being worn, freshly painted: Luffy in his straw hat with a blue dragon near the heel.", caption: "Freshly painted: Luffy and the dragon on the left shoe." },
      { src: "/work/one-piece-sneakers/02.jpg", alt: "The right shoe being worn, freshly painted: Zoro with his swords and a wanted poster near the heel.", caption: "Freshly painted: Zoro on the right shoe." },
      { src: "/work/one-piece-sneakers/03.jpg", alt: "The backs of both shoes, freshly painted: the initials R·M·A on the left heel and the One Piece logo on the right.", caption: "The heels: R·M·A in One Piece style, next to the real logo." },
      { src: "/work/one-piece-sneakers/04.jpg", alt: "The pair a year later, stacked in a studio shot, with the Zoro and Luffy panels still bright.", caption: "A year of daily wear later." },
      { src: "/work/one-piece-sneakers/05.jpg", alt: "The backs of both shoes a year later: worn soles, but the painted initials and logo still intact.", caption: "The heels a year later. The soles show the miles; the paint doesn't." },
    ],
    processNote: "Video coming soon, once I edit it! For now, two snapshots from the middle of it.",
    processPhotos: [
      { src: "/work/one-piece-sneakers/making-01.jpg", alt: "The right shoe with a pencil sketch of Zoro and a painted wanted poster, masking tape along the edge, and the left shoe's flat base colours behind it.", caption: "Zoro still a pencil sketch, Luffy in flat base colours behind him." },
      { src: "/work/one-piece-sneakers/making-04.jpg", alt: "Close-up of the painted wanted poster and the One Piece logo on the heel.", caption: "The wanted poster and logo, painted in thin layers." },
    ],
  },
  {
    slug: "sushi-cats",
    title: "Sushi cats",
    subtitle: "Four ginger cats as four kinds of sushi, hand-painted on black Air Force 1s for a best friend's birthday.",
    category: "sneakers",
    year: 2022,
    featured: true,
    baseShoe: "Nike Air Force 1",
    tags: ["hand-painted", "sushi", "cats", "black sneakers", "gift"],
    cover: {
      src: "/work/sushi-cats/cover.webp",
      alt: "The pair of black Air Force 1s: a ginger cat peeking out of a nori-wrapped maki on the front shoe, and a cat curled inside a ring of rice on the shoe behind it.",
      cutout: true,
    },
    story:
      "These were a birthday gift for one of my best friends. All she asked for was a pair of black Air Force 1s: she can walk 10,000 steps in them and they're still comfy, and black doesn't get dirty as easily as white. So I got my first real challenge: can I paint on black sneakers? Spoiler alert: oh yes, I can.\n\nThe design was all mine; she had no say in it. I only knew that she loves sushi and she loves cats, so I combined the two: sushi drawn as cats. An orange cat plays the salmon, fluffy white rice gives a great contrast on the black leather, and a black nori sheet in some of them completes the sushi vibe. I found inspiration in cute sushi-cat artwork online, most likely on Pinterest, but sadly I don't remember the artist.\n\nMy first idea was a different cat altogether, holding a fork and a knife. I drew it on tape and tried it on the shoe, and didn't like the vibe. It was too portrait-y for the side of a sneaker, which needs something more landscape-y. And who eats sushi with a fork and knife, anyway?\n\nThe roll and the maki were givens: the most basic sushi, the ones everyone adores. For the other two sides I needed wider shapes, and the only landscape sushi is nigiri. So I made two: a classic nigiri, with the cat lying on its bed of rice, and a nori nigiri, where the cat is tucked in, ready to sleep, with the nori sheet as its blanket. A gunkan was too tall for the shoes, so it ended up on the Nike box instead, as a little extra.\n\nI started on 22 April 2022 and finished on 27 April, at 4:37 in the morning, to be exact. Not the healthiest way to work: I used to leave everything to the last minute, and her birthday was already overdue.",
    processSteps: [
      "Trying a first idea, a cat with a fork and knife, drawn on tape, then dropping it",
      "Deglazing only where the cats would go, so the black finish stays untouched",
      "Outlining each cat with tape and painting the base colours inside, in thin layers",
      "Peeling the tape off",
      "Line details with a black Posca liner: faces, stripes and paws",
      "Sealing",
      "A gunkan cat on the shoe box, as a finishing touch",
    ],
    materials: [
      "Leather paints (not Angelus back then, and I can't remember the brand)",
      "Posca black liner, for the details",
      "Tape, for the cat outlines",
      "A sealer",
    ],
    time: "5 days, from 22 to 27 April 2022 (finished at 4:37 a.m.)",
    learned: [
      "Yes, you can paint on black sneakers.",
      "The side of a sneaker wants wide, landscape designs. Tall ones don't sit right.",
      "Not all leather paints are equal: the ones I used then weren't as good as Angelus.",
      "Painting until 4:37 a.m. gets a gift finished, but it's not a healthy way to work.",
    ],
    gallery: [
      { src: "/work/sushi-cats/01.jpg", alt: "A black sneaker with a ginger cat peeking out of a black nori cup topped with white rice, its paws over the edge.", caption: "The maki cat, peeking out of its nori." },
      { src: "/work/sushi-cats/02.jpg", alt: "Close-up of a ginger cat painted inside a round ring of white rice with a strip of nori, on a black sneaker.", caption: "The roll cat, snug in its ring of rice." },
      { src: "/work/sushi-cats/03.jpg", alt: "Close-up of a ginger striped cat lying on a white bed of rice, painted on black leather.", caption: "The nigiri cat, lying on its bed of rice." },
      { src: "/work/sushi-cats/04.jpg", alt: "A ginger cat asleep on rice under a black nori blanket on the front shoe, with the nigiri cat on the shoe behind it.", caption: "The nori nigiri cat, tucked in under its nori blanket, with the nigiri cat behind." },
      { src: "/work/sushi-cats/05.jpg", alt: "A collage of four photos showing each side of the pair, each with a different sushi cat.", caption: "All four sides, all four cats." },
      { src: "/work/sushi-cats/06.jpg", alt: "The pair on the Nike box, with a gunkan cat painted on the box.", caption: "The pair with the box, where the gunkan idea ended up." },
    ],
    processPhotos: [
      { src: "/work/sushi-cats/making-01.jpg", alt: "A cat holding a fork and knife, drawn on tape and stuck on the side of a black sneaker.", caption: "The first idea, drawn on tape and tried on. Too tall for the shoe, and who eats sushi with a fork and knife?" },
      { src: "/work/sushi-cats/making-02.jpg", alt: "Tape over the shoe with the maki cat's shape cut out and filled with orange and white base colours.", caption: "The maki cat outlined in tape, with the base colours painted inside." },
      { src: "/work/sushi-cats/making-03.jpg", alt: "The roll cat in flat orange and white base colours on black leather, right after the tape came off.", caption: "Tape off: the roll cat in flat base colours." },
      { src: "/work/sushi-cats/making-04.jpg", alt: "The roll cat with its first line details, the maki cat shoe and paint jars in the background.", caption: "Line details on the roll cat, with the maki cat and my paints in the back." },
    ],
  },
  {
    slug: "tattoo-cats",
    title: "Tattoo cats",
    subtitle: "Eight fine-line cat tattoos and two tiny paws on white Air Force 1s, a birthday gift for a best friend.",
    category: "sneakers",
    year: 2023,
    baseShoe: "Nike Air Force 1",
    tags: ["hand-painted", "cats", "tattoo inspo", "fine line", "minimalist", "white sneakers", "gift"],
    cover: {
      src: "/work/tattoo-cats/cover.webp",
      alt: "The pair seen from the heels: a cat sitting on a crescent moon with a red flower on the left shoe, a cat on a looping heart on the right one, and a small black cat paw on each heel under the upside-down Nike Air logo.",
      cutout: true,
    },
    story:
      "A birthday gift for another one of my best friends, from a few of us together. She likes things classy, minimalist and cute, and she loves cats, so the idea was simple, classy, subtle. The base was a pair of Air Force 1s again, but an interesting edition with an upside-down vibe: the Nike Air logo on the heel is flipped.\n\nLooking for cats, I found so many cat tattoos that were sooo cute. So, basically, I tattooed the shoes with cats. I don't remember the artists, sadly; the tattoos most likely came from Pinterest. Doing this, I found out that tattoo inspo is perfect for subtle details on shoes.\n\nEach side of an Air Force 1 is split in two by the middle panel with the Nike logo, so every side has a front panel and a back panel. That made 8 tattoos, 2 on each side, so 8 cats to draw. I printed all the tattoos I liked on my home printer, sized for the panels before printing, then cut them out and placed them on the shoes until it all looked cute and matchy. I only made those paper cutouts to ask the friends I was making the gift with if they liked it, and lucky I even have the photos. As a lovely touch I added cat paws on the heels: they fit sooo nicely, stay subtle, and tie the whole cat vibe together.\n\nI started on 18 November 2023 at 1:48 at night and finished the same day, at 5:02 in the morning. An all-nighter, because her birthday was that very day.\n\nThe thing I'm really proud of: she has machine washed them at least twice, and the drawings are still there, just a bit faded in places. That's with my old paints, not Angelus, and without leaving enough time between coats. With Angelus and better timing, I'm sure I could make them even more durable.",
    processSteps: [
      "Collecting cute cat tattoos and choosing 8: a front and a back panel on each side",
      "Sizing them for the panels and printing them on my home printer",
      "Cutting them out and placing them on the shoes, to plan a matchy layout and ask my friends if they liked it",
      "Deglazing the panels with acetone and cotton balls",
      "Painting the 8 cats in fine black lines with a thin brush, with little touches of red",
      "A small cat paw on each heel",
      "Finisher coats on top",
    ],
    materials: [
      "Leather paints (my old ones, not Angelus)",
      "A thin paintbrush, for the fine lines",
      "Acetone and cotton balls, for deglazing",
      "A finisher",
      "Home printer, paper and scissors, for the mockup",
    ],
    time: "One night: 18 November 2023, from 1:48 to 5:02 a.m.",
    learned: [
      "Tattoo inspo is perfect for subtle details on shoes.",
      "Printed paper cutouts are a quick way to plan a layout and get a yes before painting.",
      "Rushing costs durability: leave proper time between paint coats and finisher coats.",
      "With Angelus paints and better timing, the same design would last even longer.",
    ],
    gallery: [
      { src: "/work/tattoo-cats/01.jpg", alt: "The right shoe's outer side: a cat asleep inside a heart with a crescent moon and a red flower near the heel, and a cat stretching up towards a butterfly near the toe.", caption: "Right shoe, outside: a cat asleep in a heart, and one reaching for a butterfly." },
      { src: "/work/tattoo-cats/02.jpg", alt: "The left shoe's inner side, held in a hand: a cat sitting on a crescent moon with a star and a red flower near the heel, and a cat rolling on its back under a butterfly near the toe.", caption: "Left shoe, inside: the moon cat, and a cat rolling on its back." },
      { src: "/work/tattoo-cats/03.jpg", alt: "The left shoe's outer side, held in a hand: a long stretching cat with a red flower at its tail near the toe, and near the heel a sitting cat with a butterfly above a cat curled in a ring of little red flowers.", caption: "Left shoe, outside: a long stretch, and a cat curled up in flowers." },
      { src: "/work/tattoo-cats/04.jpg", alt: "The right shoe's inner side, held in a hand: a stretching cat near the toe, and near the heel a cat beside a heart drawn in one looping line that ends in a red flower.", caption: "Right shoe, inside: another stretch, and a cat with a looping heart." },
      { src: "/work/tattoo-cats/05.jpg", alt: "The heel of one shoe: the Nike Air logo embossed upside down, and a small black cat paw painted on the heel tab.", caption: "A tiny paw on each heel, under the upside-down logo." },
    ],
    processPhotos: [
      { src: "/work/tattoo-cats/making-01.jpg", alt: "One of the white Air Force 1s before painting, with an iridescent Swoosh.", caption: "Before: clean white, with an iridescent Swoosh." },
      { src: "/work/tattoo-cats/making-02.jpg", alt: "The left shoe's inner side with two printed tattoos cut out and taped on: a cat on a crescent moon on the back panel, and a cat with a butterfly on the front panel.", caption: "The paper mockup: printed tattoos, sized and cut out, placed where the cats would go." },
      { src: "/work/tattoo-cats/making-03.jpg", alt: "The left shoe's outer side with printed tattoos taped on: a cat under a crescent moon on the front panel, and two cats with flowers and a butterfly on the back panel.", caption: "Left shoe, outside, in paper." },
      { src: "/work/tattoo-cats/making-04.jpg", alt: "The right shoe's inner side with printed tattoos taped on: a slim cat with a little flower on the front panel, and a cat with a looping heart and a butterfly on the back panel.", caption: "Right shoe, inside, in paper." },
      { src: "/work/tattoo-cats/making-05.jpg", alt: "The right shoe's outer side with printed tattoos taped on: a cat asleep in a heart on the back panel, and a cat reaching up for a butterfly on the front panel.", caption: "Right shoe, outside, in paper." },
    ],
  },
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
