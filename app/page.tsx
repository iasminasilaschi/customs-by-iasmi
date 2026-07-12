import { Hero } from "@/components/sections/Hero";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { DesignLabTeaser } from "@/components/sections/DesignLabTeaser";
import { BeyondSneakers } from "@/components/sections/BeyondSneakers";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { ContactCTA } from "@/components/sections/ContactCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedWork />
      <HowItWorks />
      <DesignLabTeaser />
      <BeyondSneakers />
      <AboutTeaser />
      <ContactCTA />
    </>
  );
}
