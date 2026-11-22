import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { InstagramGrid } from "@/components/sections/InstagramGrid";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { heroShowcaseFor } from "@/data/localized";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale } from "@/lib/i18n";
import { languageAlternates } from "@/lib/metadata";

// title, description and og: tags come from the root layout
export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  return hasLocale(lang) ? { alternates: languageAlternates(lang, "/") } : {};
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return null;
  return (
    <>
      <Hero locale={lang} t={getDictionary(lang).hero} slides={heroShowcaseFor(lang)} />
      <FeaturedWork />
      <InstagramGrid />
      <AboutTeaser />
      <ContactCTA />
    </>
  );
}
