import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { Tag } from "@/components/ui/Tag";
import { processVideo } from "@/data/media";

export const metadata: Metadata = {
  title: "Process",
  description:
    "How a custom sneaker commission works at Customs by Iasmi — from moodboard to deposit to hand-painted, sealed, documented pair.",
};

const steps = [
  {
    n: "01",
    title: "You send the idea",
    text: "A moodboard, a story, three photos and a song — whatever carries the vibe. The Design Lab form, email, or a DM all work.",
  },
  {
    n: "02",
    title: "We shape the project",
    text: "Base shoe (yours or sourced), budget range, timing. I'll tell you honestly what will work on leather and what won't.",
  },
  {
    n: "03",
    title: "Concept sketch",
    text: "I sketch or mock up the direction and map it onto the shoe zones. We adjust until it feels like yours.",
  },
  {
    n: "04",
    title: "Deposit confirms your slot",
    text: "Commissions are deposit-based, with limited slots each month. The deposit covers materials and reserves the calendar.",
  },
  {
    n: "05",
    title: "Paint, seal, document",
    text: "Layers of flexible leather acrylic, heat-set, detailed, sealed. The process is filmed — you'll see your pair come alive.",
  },
  {
    n: "06",
    title: "Your pair arrives",
    text: "Flex-tested, water-bead-tested, packed with a care card. One-of-one, made from your story.",
  },
];

const careDo = [
  "Wipe gently with a soft, damp cloth",
  "Store away from direct sunlight",
  "Use a horn or loosen laces when putting them on",
  "Message me first if something needs a repair",
];

const careDont = [
  "No machine washing or soaking",
  "No harsh solvents or aggressive scrubbing",
  "Avoid deep mud, heavy rain, and heat sources",
  "Don't fold or crush painted zones in storage",
];

export default function ProcessPage() {
  return (
    <div className="mx-auto max-w-[90rem] px-5 pt-36 pb-20 sm:px-6 lg:px-12 xl:px-20">
      <SectionHeading
        eyebrow="The process"
        title={
          <>
            Slow on purpose,{" "}
            <span className="display-italic text-rose-2">yours forever.</span>
          </>
        }
        lede="Every commission follows the same honest path, from first message to the last coat of sealer."
      />

      {/* Steps */}
      <ol className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={(i % 3) * 0.08}>
            <li className="glass grain h-full rounded-blob p-7">
              <span className="display-italic text-4xl text-rose/70">{s.n}</span>
              <h2 className="display mt-3 text-xl text-cream">{s.title}</h2>
              <p className="mt-3 text-base leading-relaxed text-muted">{s.text}</p>
            </li>
          </Reveal>
        ))}
      </ol>

      {/* Handmade honesty */}
      <Reveal>
        <section className="mt-20 grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Realistic expectations"
              title={
                <>
                  Painted by hand,{" "}
                  <span className="display-italic text-lilac">not factory perfect.</span>
                </>
              }
              lede="Tiny brush textures, slight asymmetries, layered depth — that's not a flaw, that's the point. A printed shoe is a copy; a painted shoe is an original."
            />
            <div className="mt-6 flex flex-wrap gap-2">
              <Tag tone="rose">hand-painted</Tag>
              <Tag tone="rose">made-to-order</Tag>
              <Tag tone="lilac">sealed & wearable</Tag>
              <Tag tone="lilac">process documented</Tag>
              <Tag tone="gold">authentic base shoes only</Tag>
            </div>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted">
              Base shoes are always authentic — sourced new from retail or
              supplied by you. Customization is done independently by this
              studio and is not affiliated with or endorsed by the original
              shoe brands.
            </p>
          </div>
          {processVideo && (
            <div className="aspect-[4/3]">
              <VideoPlayer video={processVideo} label="Materials and sealing walkthrough" />
            </div>
          )}
        </section>
      </Reveal>

      {/* Care */}
      <Reveal>
        <section className="mt-20">
          <SectionHeading
            eyebrow="Materials & care"
            title="Keep the artwork alive."
            lede="Every pair ships with its own care card. The short version:"
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="rounded-blob border border-line bg-coal p-7">
              <p className="eyebrow mb-4 text-rose-2">do</p>
              <ul className="space-y-2.5 text-base text-cream/80">
                {careDo.map((c) => (
                  <li key={c} className="flex gap-2.5">
                    <span aria-hidden className="text-rose-2">✓</span> {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-blob border border-line bg-coal p-7">
              <p className="eyebrow mb-4">don&apos;t</p>
              <ul className="space-y-2.5 text-base text-cream/80">
                {careDont.map((c) => (
                  <li key={c} className="flex gap-2.5">
                    <span aria-hidden className="text-muted">✕</span> {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </Reveal>

      {/* CTA */}
      <div className="mt-20 text-center">
        <p className="hand text-2xl text-lilac">sounds good?</p>
        <div className="mt-5 flex flex-wrap justify-center gap-4">
          <Button href="/design-lab" size="lg">
            Start a commission
          </Button>
          <Button href="/faq" variant="outline" size="lg">
            Read the FAQ
          </Button>
        </div>
      </div>
    </div>
  );
}
