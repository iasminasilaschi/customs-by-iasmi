/**
 * Hand-picked real posts from @customsbyiasmi. Each tile shows one of my own
 * photos from that post and links to it. Add new posts to the top.
 */
import type { PhotoData } from "@/data/media";

export interface InstagramPost {
  url: string;
  kind: "post" | "reel";
  caption: string;
  image: PhotoData;
}

export const instagramPosts: InstagramPost[] = [
  {
    url: "https://www.instagram.com/reel/Dd1_4IEtR9P/",
    kind: "reel",
    caption: "Patri's cap coming to life: “this is what I want to be”.",
    image: {
      src: "/work/doctor-cu-suflet-si-ratiune/03.jpg",
      alt: "Close-up of a pink lily and the shaded gold stethoscope on Patri's cap.",
    },
  },
  {
    url: "https://www.instagram.com/p/DduCNfajTcy/",
    kind: "post",
    caption: "Patri on graduation day, then the process in reverse, back to the sketch.",
    image: {
      src: "/work/doctor-cu-suflet-si-ratiune/01.jpg",
      alt: "Patri, seen from behind, wearing her cap in front of a flower-covered swing.",
    },
  },
  {
    url: "https://www.instagram.com/p/DddqoOLDYcu/",
    kind: "post",
    caption: "Andreea at her graduation, then the full behind the scenes.",
    image: {
      src: "/work/superpower-called-empathy/01.jpg",
      alt: "Andreea, seen from behind, wearing her cap on a flower-covered swing.",
    },
  },
  {
    url: "https://www.instagram.com/p/Dd2CVFTjbWe/",
    kind: "post",
    caption: "Custom grad caps: both of them, finished, in the studio.",
    image: {
      src: "/work/graduation-caps/both-caps-holding.jpg",
      alt: "Both finished caps photographed together, one held in hand.",
    },
  },
];
