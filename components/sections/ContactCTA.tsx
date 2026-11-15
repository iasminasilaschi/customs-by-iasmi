import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function ContactCTA() {
  return (
    <section className="gutter relative overflow-hidden py-28 md:py-36">
      <div
        aria-hidden
        className="glow-gold pointer-events-none absolute inset-x-0 top-1/2 mx-auto h-[28rem] w-[40rem] -translate-y-1/2"
      />
      <Reveal>
        <div className="relative mx-auto max-w-2xl text-center">
          <p className="hand rotate-[-2deg] text-2xl text-sage-ink">
            have an idea for a pair?
          </p>
          <h2 className="display mt-5 text-[clamp(2.5rem,1.5rem+3.4vw,4.25rem)]">
            Send me the mood.{" "}
            <span className="display-italic text-rose-2">I&apos;ll help shape it.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-lg text-muted">
            No pressure, no order forms. Tell me what refuses to leave your
            brain, or just come say hi.
          </p>
          <div className="mt-10 flex justify-center">
            <Button href="/contact" size="lg">
              Say hi
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
