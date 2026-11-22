import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { MosaicTile } from "@/components/ui/MosaicTile";
import { lifeMosaic } from "@/data/mosaic";
import { localePath } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n-server";

export async function AboutTeaser() {
  const { locale, t: d } = await getI18n();
  const t = d.aboutTeaser;
  const tiles = lifeMosaic.slice(0, 4);
  return (
    <section className="gutter mx-auto max-w-[90rem] py-24 md:py-32">
      <div className={tiles.length > 0 ? "grid items-center gap-14 lg:grid-cols-2 lg:gap-20" : ""}>
        {tiles.length > 0 && (
          <Reveal>
            <div className="grid grid-cols-2 gap-4">
              {tiles.map((t, i) => (
                <MosaicTile
                  key={t.id}
                  photo={t.photo}
                  label={t.label}
                  className={i % 2 === 1 ? "aspect-[3/4] translate-y-6" : "aspect-[3/4]"}
                />
              ))}
            </div>
          </Reveal>
        )}
        <Reveal delay={0.15}>
          <div className="max-w-xl">
            <SectionHeading
              eyebrow={t.eyebrow}
              title={
                <>
                  {t.titleA}{" "}
                  <span className="display-italic text-rose-2">{t.titleEm}</span>
                </>
              }
              lede={t.lede}
            />
            <Link
              href={localePath(locale, "/about")}
              className="group mt-6 inline-flex min-h-11 items-center gap-2 font-medium text-olive"
            >
              {t.link}
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
