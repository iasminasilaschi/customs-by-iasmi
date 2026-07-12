import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { ArtPlaceholder } from "@/components/mosaic/ArtPlaceholder";
import { VideoPlaceholder } from "@/components/mosaic/VideoPlaceholder";
import { categoryLabels, getPiece, portfolio } from "@/data/portfolio";

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
  return { title: piece.title, description: piece.subtitle };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const piece = getPiece(slug);
  if (!piece) notFound();

  return (
    <article className="mx-auto max-w-6xl px-5 pt-36 pb-20 sm:px-6 lg:px-8">
      {/* Header */}
      <Link href="/projects" className="text-base text-muted transition-colors hover:text-rose-2">
        ← Back to projects
      </Link>
      <header className="mt-6">
        <p className="eyebrow">
          {categoryLabels[piece.category]} · {piece.year}
          {piece.baseShoe ? ` · ${piece.baseShoe}` : ""}
        </p>
        <h1 className="display mt-3 text-[clamp(2.75rem,1.65rem+3.6vw,4.5rem)]">{piece.title}</h1>
        <p className="mt-4 max-w-xl text-lg text-muted">{piece.subtitle}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {piece.tags.map((t) => (
            <Tag key={t} tone="rose">{t}</Tag>
          ))}
        </div>
      </header>

      {/* Hero visual */}
      <ArtPlaceholder
        colors={piece.colors}
        label={piece.images[0]}
        className="mt-10 aspect-[16/9] rounded-blob border border-line"
      />

      {/* Story + facts */}
      <div className="mt-12 grid gap-10 md:grid-cols-[1.6fr_1fr]">
        <div>
          <h2 className="display text-2xl text-cream">The story</h2>
          <p className="mt-4 leading-relaxed text-cream/80">{piece.story ?? piece.description}</p>

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
        </div>

        <aside className="space-y-6">
          {piece.materials && (
            <div className="glass grain rounded-blob p-6">
              <p className="eyebrow mb-3">Materials</p>
              <ul className="space-y-1.5 text-base text-cream/80">
                {piece.materials.map((m) => (
                  <li key={m}>· {m}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="glass grain rounded-blob p-6">
            <p className="eyebrow mb-3">Palette</p>
            <div className="flex gap-2" aria-label="Colour palette used in this project">
              {piece.colors.map((c) => (
                <span
                  key={c}
                  className="h-9 w-9 rounded-full border border-line"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>
          {piece.hasVideo && (
            <VideoPlaceholder colors={piece.colors} label={`${piece.title} — process reel`} className="aspect-[4/5]" />
          )}
        </aside>
      </div>

      {/* Before / after */}
      {piece.beforeLabel && piece.afterLabel && (
        <section className="mt-14">
          <h2 className="display text-2xl text-cream">Before / after</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <ArtPlaceholder
                colors={["#2a2a30", "#4a4a52", "#6b6b74"]}
                label={piece.beforeLabel}
                className="aspect-[4/3] rounded-blob border border-line opacity-80"
              />
              <p className="mt-2 text-center text-sm uppercase tracking-widest text-muted">before</p>
            </div>
            <div>
              <ArtPlaceholder
                colors={piece.colors}
                label={piece.afterLabel}
                className="aspect-[4/3] rounded-blob border border-line"
              />
              <p className="mt-2 text-center text-sm uppercase tracking-widest text-rose-2">after</p>
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      <section className="mt-14">
        <h2 className="display text-2xl text-cream">Gallery</h2>
        <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">
          {piece.images.map((img, i) => (
            <ArtPlaceholder
              key={img}
              colors={[...piece.colors.slice(i % piece.colors.length), ...piece.colors]}
              label={img}
              className={`rounded-2xl border border-line ${i === 0 ? "col-span-2 aspect-[16/9] md:col-span-1 md:aspect-square" : "aspect-square"}`}
            />
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="glass grain mt-16 rounded-blob p-8 text-center sm:p-12">
        <p className="hand text-2xl text-lilac">liked this one?</p>
        <h2 className="display mt-3 text-3xl text-cream">
          Commission a similar pair — <span className="display-italic text-rose-2">but yours.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base text-muted">
          No two commissions are the same. We take the mood of this project and
          rebuild it around your story, your colours, your shoes.
        </p>
        <div className="mt-7">
          <Button href={`/design-lab?ref=${piece.slug}`} size="lg">
            Request something like this
          </Button>
        </div>
      </div>
    </article>
  );
}
