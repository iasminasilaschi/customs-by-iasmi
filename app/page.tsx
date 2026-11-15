import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { InstagramGrid } from "@/components/sections/InstagramGrid";
import { ContactCTA } from "@/components/sections/ContactCTA";

// title, description and og: tags come from the root layout
export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedWork />
      <InstagramGrid />
      <AboutTeaser />
      <ContactCTA />
    </>
  );
}
