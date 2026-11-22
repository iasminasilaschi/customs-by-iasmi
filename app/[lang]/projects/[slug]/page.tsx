import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { Photo } from "@/components/ui/Photo";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { PhotoGrid } from "@/components/projects/PhotoGrid";
import { PageVibe } from "@/components/projects/PageVibe";
import { vibeFor } from "@/data/media";
import { pageTokens } from "@/lib/vibe";
import { portfolio, contactHref } from "@/data/portfolio";
import { getPieceFor } from "@/data/localized";
import { getDictionary } from "@/lib/dictionaries";
import { fmt } from "@/lib/i18n-format";
import { hasLocale, localePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return portfolio.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/projects/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const piece = getPieceFor(slug, lang);
  if (!piece) return { title: getDictionary(lang).project.notFound };
  // link previews flatten transparency to black, so prefer a normal photo
  const preview = piece.cover.cutout
    ? (piece.gallery?.find((p) => !p.cutout) ?? piece.cover)
    : piece.cover;
  return pageMetadata({
    locale: lang,
    title: piece.title,
    description: piece.subtitle,
    path: `/projects/${piece.slug}`,
    image: preview.src,
  });
}

export default async function ProjectPage({ params }: PageProps<"/[lang]/projects/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const piece = getPieceFor(slug, lang);
  if (!piece) notFound();
  const d = getDictionary(lang);
  const t = d.project;
  const isCap = piece.category === "graduation-caps";
  // pairs from the homepage rotation keep their colours here too
  const vibe = vibeFor(piece.slug);

  return (
    <div className={vibe ? "vibe-page text-cream" : undefined} style={vibe ? pageTokens(vibe) : undefined}>
    {vibe && <PageVibe vibe={vibe} />}
    <article className="gutter mx-auto max-w-6xl pt-36 pb-20 max-sm:[--gutter:1.25rem] lg:[--gutter:2rem]">
      {/* Header */}
      <Link href={localePath(lang, "/projects")} className="-my-3 inline-flex min-h-11 items-center text-base text-muted transition-colors hover:text-rose-2">
        {t.back}
      </Link>
      <div className="mt-6 grid items-center gap-10 md:grid-cols-[1.15fr_0.85fr] lg:gap-16">
      <header>
        <p className="eyebrow">
          {d.categories[piece.category]} · {piece.year}
          {piece.baseShoe ? ` · ${piece.baseShoe}` : ""}
        </p>
        <h1 className="display mt-3 text-[clamp(2.75rem,1.65rem+3.6vw,4.5rem)]">{piece.title}</h1>
        <p className="mt-4 max-w-xl text-lg text-muted">{piece.subtitle}</p>
        {piece.tags && piece.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {piece.tags.map((t) => (
              <Tag key={t} tone={vibe ? "gold" : "rose"}>{t}</Tag>
            ))}
          </div>
        )}
      </header>

      {/* Hero visual: a cutout floats on the pair's colours; a photo gets a portrait frame */}
      {piece.cover.cutout ? (
        <div className="relative aspect-[5/4] md:scale-110">
          <Photo photo={piece.cover} priority sizes="(min-width: 768px) 45vw, 100vw" />
        </div>
      ) : (
        <div className="relative aspect-[4/5] overflow-hidden rounded-blob border border-line bg-cream-soft shadow-soft">
          <Photo photo={piece.cover} priority sizes="(min-width: 768px) 40vw, 100vw" />
        </div>
      )}
      </div>

      {/* Story + facts */}
      <div className="mt-12 grid gap-10 md:grid-cols-[1.6fr_1fr]">
        <div>
          {piece.story && (
            <>
              <h2 className="display text-2xl text-cream">{t.story}</h2>
              {piece.story.split("\n\n").map((para) => (
                <p key={para} className="mt-4 leading-relaxed text-cream/80">
                  {para}
                </p>
              ))}
            </>
          )}

          {piece.processSteps && piece.processSteps.length > 0 && (
            <>
              <h2 className="display mt-10 text-2xl text-cream">{t.process}</h2>
              <ol className="mt-4 space-y-3">
                {piece.processSteps.map((step, i) => (
                  <li key={step} className="flex gap-4 text-base leading-relaxed text-cream/80">
                    <span className="display-italic shrink-0 text-lg text-rose-ink">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </>
          )}

          {piece.learned && piece.learned.length > 0 && (
            <>
              <h2 className="display mt-10 text-2xl text-cream">{t.learned}</h2>
              <ul className="mt-4 space-y-3">
                {piece.learned.map((l) => (
                  <li key={l} className="flex gap-3 text-base leading-relaxed text-cream/80">
                    <span aria-hidden className="text-gold">✦</span>
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {piece.instagram && piece.instagram.length > 0 && (
            <ul className="mt-9 flex flex-wrap gap-x-8">
              {piece.instagram.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center font-medium text-olive hover:underline"
                  >
                    {link.label} <span aria-hidden>→</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="space-y-6">
          {piece.materials && piece.materials.length > 0 && (
            <div className="glass grain rounded-blob p-6">
              <p className="eyebrow mb-3">{t.materials}</p>
              <ul className="space-y-1.5 text-base text-cream/80">
                {piece.materials.map((m) => (
                  <li key={m}>· {m}</li>
                ))}
              </ul>
            </div>
          )}
          {piece.time && (
            <div className="glass grain rounded-blob p-6">
              <p className="eyebrow mb-3">{t.time}</p>
              <p className="text-base text-cream/80">{piece.time}</p>
            </div>
          )}
          {piece.video && (
            <div className="aspect-[4/5]">
              <VideoPlayer video={piece.video} label={fmt(t.makingOfVideo, { title: piece.title })} />
            </div>
          )}
        </aside>
      </div>

      {/* Before / after */}
      {piece.before && piece.after && (
        <section className="mt-14">
          <h2 className="display text-2xl text-cream">{t.beforeAfter}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-blob border border-line">
                <Photo photo={piece.before} sizes="(min-width: 640px) 50vw, 100vw" />
              </div>
              <p className="mt-2 text-center text-sm uppercase tracking-widest text-muted">
                {piece.before.caption ?? t.before}
              </p>
            </div>
            <div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-blob border border-line">
                <Photo photo={piece.after} sizes="(min-width: 640px) 50vw, 100vw" />
              </div>
              <p className="mt-2 text-center text-sm uppercase tracking-widest text-rose-2">
                {piece.after.caption ?? t.after}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Galleries */}
      {piece.gallery && piece.gallery.length > 0 && <PhotoGrid title={t.gallery} photos={piece.gallery} labels={d.photos} />}
      {piece.chapters?.map((c) => (
        <PhotoGrid key={c.title} title={c.title} note={c.note} photos={c.photos} labels={d.photos} />
      ))}
      {piece.processPhotos && piece.processPhotos.length > 0 && (
        <PhotoGrid title={t.makingOf} note={piece.processNote} photos={piece.processPhotos} labels={d.photos} />
      )}

      {/* CTA */}
      <div className="glass grain mt-16 rounded-blob p-8 text-center sm:p-12">
        <p className="hand text-2xl text-lilac">{t.ctaKicker}</p>
        <h2 className="display mt-3 text-3xl text-cream">
          {isCap ? t.ctaTitleCap : t.ctaTitlePair}
          <span className="display-italic text-rose-2">{t.ctaTitleEm}</span>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base text-muted">
          {isCap ? t.ctaTextCap : t.ctaTextPair}
        </p>
        <div className="mt-7">
          <Button href={contactHref(piece, lang)} size="lg">
            {isCap ? t.ctaButtonCap : t.ctaButtonPair}
          </Button>
        </div>
      </div>
    </article>
    </div>
  );
}
