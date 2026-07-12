import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { faqCategories, faqItems } from "@/data/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Everything about ordering custom hand-painted sneakers: sourcing, wearability, care, timelines, design rights and policies.",
};

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-32 pb-16 sm:px-6">
      <SectionHeading
        eyebrow="Questions & honesty"
        title={
          <>
            Everything you&apos;d{" "}
            <span className="display-italic text-rose-2">want to ask.</span>
          </>
        }
        lede="Custom products deserve clear answers. If yours isn't here, just ask — there are no silly questions about wearable art."
      />

      <div className="mt-12 space-y-12">
        {faqCategories.map((cat) => (
          <section key={cat} aria-label={cat}>
            <p className="eyebrow mb-4">{cat}</p>
            <Accordion
              items={faqItems
                .filter((f) => f.category === cat)
                .map((f) => ({ question: f.question, answer: f.answer }))}
            />
          </section>
        ))}
      </div>

      <p className="mt-10 rounded-2xl border border-gold/25 bg-gold/5 p-5 text-sm leading-relaxed text-muted">
        ✦ Transparency note: Customs by Iasmi is an emerging studio. Final order,
        return and privacy policies are being reviewed and will be published
        in full before paid orders open. Nothing on this page limits your
        statutory rights regarding faulty products.
      </p>

      <div className="mt-12 text-center">
        <p className="hand text-2xl text-lilac">question answered?</p>
        <div className="mt-4">
          <Button href="/design-lab" size="lg">
            Start a commission
          </Button>
        </div>
      </div>
    </div>
  );
}
