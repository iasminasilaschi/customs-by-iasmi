import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { Photo } from "@/components/ui/Photo";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { categoryLabels, getPiece, portfolio, requestHref } from "@/data/portfolio";
import type { PhotoData } from "@/data/media";

export function generateStaticParams() {
  return portfolio.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const piece = getPiece(slug);
  if (!piece) return { title: "Not found" };
  return {
    title: piece.title,
    description: piece.subtitle,
    openGraph: { images: [piece.cover.src] },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const piece = getPiece(slug);
  if (!piece) notFound();
  const isCap = piece.category === "graduation-caps";

  return (
    <article className="mx-auto max-w-6xl px-5 pt-36 pb-20 sm:px-6 lg:px-8">
      {/* Header */}
      <Link href="/projects" className="text-base text-muted transition-colors hover:text-rose-2">
        ← Back to projects
      </Link>
      <div className="mt-6 grid items-center gap-10 md:grid-cols-[1.15fr_0.85fr] lg:gap-16">
      <header>
        <p className="eyebrow">
          {categoryLabels[piece.category]} · {piece.year}
          {piece.baseShoe ? ` · ${piece.baseShoe}` : ""}
        </p>
        <h1 className="display mt-3 text-[clamp(2.75rem,1.65rem+3.6vw,4.5rem)]">{piece.title}</h1>
        <p className="mt-4 max-w-xl text-lg text-muted">{piece.subtitle}</p>
        {piece.tags && piece.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {piece.tags.map((t) => (
              <Tag key={t} tone="rose">{t}</Tag>
            ))}
          </div>
        )}
      </header>

      {/* Hero visual — portrait, so the whole piece stays in frame */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-blob border border-line shadow-soft">
        <Photo photo={piece.cover} priority sizes="(min-width: 768px) 40vw, 100vw" />
      </div>
      </div>

      {/* Story + facts */}
      <div className="mt-12 grid gap-10 md:grid-cols-[1.6fr_1fr]">
        <div>
          {piece.story && (
            <>
              <h2 className="display text-2xl text-cream">The story</h2>
              {piece.story.split("\n\n").map((para) => (
                <p key={para} className="mt-4 leading-relaxed text-cream/80">
                  {para}
                </p>
              ))}
            </>
          )}

          {piece.processSteps && piece.processSteps.length > 0 && (
            <>
              <h2 className="display mt-10 text-2xl text-cream">Process</h2>
              <ol className="mt-4 space-y-3">
                {piece.processSteps.map((step, i) => (
                  <li key={step} className="flex gap-4 text-base leading-relaxed text-cream/80">
                    <span className="display-italic shrink-0 text-lg text-rose/70">
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
              <h2 className="display mt-10 text-2xl text-cream">What I learned</h2>
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

          {(piece.instagramUrl || piece.reelUrl) && (
            <p className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              {piece.instagramUrl && (
                <a
                  href={piece.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-olive hover:underline"
                >
                  See the post on Instagram →
                </a>
              )}
              {piece.reelUrl && (
                <a
                  href={piece.reelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-olive hover:underline"
                >
                  Watch the making-of reel →
                </a>
              )}
            </p>
          )}
        </div>

        <aside className="space-y-6">
          {piece.materials && piece.materials.length > 0 && (
            <div className="glass grain rounded-blob p-6">
              <p className="eyebrow mb-3">Materials</p>
              <ul className="space-y-1.5 text-base text-cream/80">
                {piece.materials.map((m) => (
                  <li key={m}>· {m}</li>
                ))}
              </ul>
            </div>
          )}
          {piece.time && (
            <div className="glass grain rounded-blob p-6">
              <p className="eyebrow mb-3">Time</p>
              <p className="text-base text-cream/80">{piece.time}</p>
            </div>
          )}
          {piece.video && (
            <div className="aspect-[4/5]">
              <VideoPlayer video={piece.video} label={`${piece.title} — making of`} />
            </div>
          )}
        </aside>
      </div>

      {/* Before / after */}
      {piece.before && piece.after && (
        <section className="mt-14">
          <h2 className="display text-2xl text-cream">Before / after</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <div className="relative aspect-[3/4] overflow-hidden rounded-blob border border-line">
                <Photo photo={piece.before} sizes="(min-width: 640px) 50vw, 100vw" />
              </div>
              <p className="mt-2 text-center text-sm uppercase tracking-widest text-muted">before</p>
            </div>
            <div>
              <div className="relative aspect-[3/4] overflow-hidden rounded-blob border border-line">
                <Photo photo={piece.after} sizes="(min-width: 640px) 50vw, 100vw" />
              </div>
              <p className="mt-2 text-center text-sm uppercase tracking-widest text-rose-2">after</p>
            </div>
          </div>
        </section>
      )}

      {/* Galleries */}
      {piece.gallery && piece.gallery.length > 0 && <PhotoGrid title="Gallery" photos={piece.gallery} />}
      {piece.processPhotos && piece.processPhotos.length > 0 && (
        <PhotoGrid title="Making of" photos={piece.processPhotos} />
      )}

      {/* CTA */}
      <div className="glass grain mt-16 rounded-blob p-8 text-center sm:p-12">
        <p className="hand text-2xl text-lilac">liked this one?</p>
        <h2 className="display mt-3 text-3xl text-cream">
          {isCap ? "Want a cap like this — " : "Commission a similar pair — "}
          <span className="display-italic text-rose-2">but yours.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base text-muted">
          {isCap
            ? "Tell me your words, your field and the things you love, and we'll design a cap around them."
            : "No two commissions are the same. We take the mood of this project and rebuild it around your story, your colours, your shoes."}
        </p>
        <div className="mt-7">
          <Button href={requestHref(piece)} size="lg">
            Request something like this
          </Button>
        </div>
      </div>
    </article>
  );
}

function PhotoGrid({ title, photos }: { title: string; photos: PhotoData[] }) {
  return (
    <section className="mt-14">
      <h2 className="display text-2xl text-cream">{title}</h2>
      <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">
        {photos.map((photo) => (
          <figure key={photo.src}>
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-line">
              <Photo photo={photo} sizes="(min-width: 768px) 33vw, 50vw" />
            </div>
            {photo.caption && (
              <figcaption className="mt-2 text-sm leading-snug text-muted">{photo.caption}</figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}
