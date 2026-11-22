import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { localePath } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n-server";

export async function ContactCTA() {
  const { locale, t: d } = await getI18n();
  const t = d.contactCta;
  return (
    <section className="gutter relative overflow-hidden py-28 md:py-36">
      <div
        aria-hidden
        className="glow-gold pointer-events-none absolute inset-x-0 top-1/2 mx-auto h-[28rem] w-[40rem] -translate-y-1/2"
      />
      <Reveal>
        <div className="relative mx-auto max-w-2xl text-center">
          <p className="hand rotate-[-2deg] text-2xl text-sage-ink">
            {t.kicker}
          </p>
          <h2 className="display mt-5 text-[clamp(2.5rem,1.5rem+3.4vw,4.25rem)]">
            {t.titleA}{" "}
            <span className="display-italic text-rose-2">{t.titleEm}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-lg text-muted">
            {t.lede}
          </p>
          <div className="mt-10 flex justify-center">
            <Button href={localePath(locale, "/contact")} size="lg">
              {t.button}
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
