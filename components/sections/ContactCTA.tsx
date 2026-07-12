import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/data/site";

export function ContactCTA() {
  return (
    <section className="relative overflow-hidden px-4 py-28 sm:px-6 md:py-36">
      <div
        aria-hidden
        className="glow-gold pointer-events-none absolute inset-x-0 top-1/2 mx-auto h-[28rem] w-[40rem] -translate-y-1/2"
      />
      <Reveal>
        <div className="relative mx-auto max-w-2xl text-center">
          <p className="hand rotate-[-2deg] text-2xl text-sage">
            have an idea for a pair?
          </p>
          <h2 className="display mt-5 text-[clamp(2.5rem,1.5rem+3.4vw,4.25rem)]">
            Send me the mood.{" "}
            <span className="display-italic text-rose-2">I&apos;ll help shape it.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-lg text-muted">
            {site.monthlySlots} commissions a month, so every pair gets the time
            it deserves. Tell me what refuses to leave your brain.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href="/design-lab" size="lg">
              Start a custom request
            </Button>
            <Button href="/contact" variant="outline" size="lg">
              Just say hi
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
