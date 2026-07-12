import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

const steps = [
  {
    n: "01",
    title: "Send the mood",
    text: "A photo, a song, a colour, an obsession. However it arrives is fine.",
  },
  {
    n: "02",
    title: "We shape the concept",
    text: "Base shoe, direction, timing — sketched together until it feels like yours.",
  },
  {
    n: "03",
    title: "I paint it by hand",
    text: "Layer by layer, sealed for real life, and quietly documented along the way.",
  },
  {
    n: "04",
    title: "You wear the story",
    text: "One-of-one, made from something that mattered — now on your feet.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-sage-soft/60">
      <div className="mx-auto max-w-[90rem] px-4 py-24 sm:px-6 md:py-32 lg:px-12 xl:px-20">
        <Reveal>
          <SectionHeading
            eyebrow="How it works"
            title="From a moodboard to your doorstep."
            align="center"
            className="mx-auto"
          />
        </Reveal>
        <div className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <div className="flex flex-col">
                <span className="display-italic text-5xl text-gold">{s.n}</span>
                <div className="rule-gold my-5 w-12" />
                <h3 className="display text-2xl text-cream">{s.title}</h3>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-muted">
                  {s.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <div className="mt-16 text-center">
            <Button href="/process" variant="outline">
              See the full process →
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
