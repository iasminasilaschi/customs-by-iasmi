"use client";

import { useState } from "react";
import { StarterCard } from "@/components/cards/StarterCard";
import { SneakerPreview } from "@/components/design-lab/SneakerPreview";
import { ArtPlaceholder } from "@/components/mosaic/ArtPlaceholder";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { UploadPlaceholder } from "@/components/forms/fields";
import { Tag } from "@/components/ui/Tag";
import { designStarters, type DesignStarter } from "@/data/starters";
import { cn } from "@/lib/utils";

const moodTags = [
  "dreamy",
  "dark",
  "y2k",
  "floral",
  "minimal",
  "loud",
  "elegant",
  "playful",
  "nostalgic",
  "sporty",
] as const;

/**
 * Design Lab v1 shell: starter selection repaints the concept sneaker and
 * flows into the commission form as context. 3D rotation, real moodboard
 * uploads, palette extraction and AI concepts are future phases — labelled
 * as such, never faked.
 */
export function DesignLabShell({ initialIdea = "" }: { initialIdea?: string }) {
  const [starter, setStarter] = useState<DesignStarter>(designStarters[0]);
  const [tags, setTags] = useState<string[]>([]);

  const toggleTag = (t: string) =>
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const context = `${starter.title} (${starter.vibe})${tags.length ? ` · mood: ${tags.join(", ")}` : ""}`;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left — start with a vibe */}
        <section aria-label="Start with a vibe" className="space-y-4 lg:col-span-4">
          <div className="rounded-blob border border-line bg-coal p-5">
            <p className="eyebrow mb-1">01 · start with a vibe</p>
            <p className="text-sm text-muted">
              Pick a starter — it&apos;s a direction, not a template. Everything
              gets rebuilt around your story.
            </p>
            <div className="mt-4 space-y-3">
              {designStarters.map((s) => (
                <StarterCard key={s.id} starter={s} selected={starter.id === s.id} onSelect={setStarter} />
              ))}
            </div>
          </div>

          <div className="rounded-blob border border-line bg-coal p-5">
            <p className="eyebrow mb-3">02 · set the mood</p>
            <div className="flex flex-wrap gap-2">
              {moodTags.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTag(t)}
                  aria-pressed={tags.includes(t)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-sm lowercase transition-all",
                    tags.includes(t)
                      ? "border-lilac bg-lilac/15 text-lilac"
                      : "border-line text-muted hover:border-cream/40 hover:text-cream",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-blob border border-line bg-coal p-5">
            <p className="eyebrow mb-3">03 · your references</p>
            <UploadPlaceholder label="Moodboard" />
          </div>
        </section>

        {/* Center/right — concept preview */}
        <section aria-label="Concept preview" className="lg:col-span-8">
          <div className="grain sticky top-24 overflow-hidden rounded-blob border border-line bg-coal p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="eyebrow">concept preview</p>
                <h2 className="display mt-1 text-2xl text-cream">{starter.title}</h2>
                <p className="hand text-lilac">{starter.vibe}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Tag tone="gold">rotate / 3D — coming soon</Tag>
                <Tag tone="neutral">before/after — coming soon</Tag>
              </div>
            </div>

            <div
              className="relative mt-6 rounded-2xl p-4 sm:p-8"
              style={{
                background: `radial-gradient(80% 90% at 50% 10%, ${starter.palette[1]}22, transparent 70%)`,
              }}
            >
              <SneakerPreview palette={starter.palette} annotated className="mx-auto w-full max-w-xl" />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2" aria-label="Selected palette">
                {starter.palette.map((c) => (
                  <span key={c} className="h-8 w-8 rounded-full border border-line" style={{ backgroundColor: c }} title={c} />
                ))}
                <span className="ml-2 text-sm text-muted">palette extraction from your images — future phase</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[...starter.tags, ...tags].map((t) => (
                  <Tag key={t} tone="lilac">{t}</Tag>
                ))}
              </div>
            </div>

            {/* mini moodboard strip */}
            <div className="mt-6 grid grid-cols-3 gap-3" aria-hidden>
              {[0, 1, 2].map((i) => (
                <ArtPlaceholder
                  key={`${starter.id}-${i}`}
                  colors={[...starter.palette.slice(i % starter.palette.length), ...starter.palette]}
                  label={i === 1 ? "your moodboard here" : undefined}
                  className="aspect-[16/10] rounded-xl border border-line"
                />
              ))}
            </div>

            <p className="mt-5 text-sm leading-relaxed text-muted">
              ✦ This preview is only a concept — the real pair is hand-painted:
              textured, layered, alive. The AI design lab (generated concepts,
              zone-aware mockups, palette extraction) is on the roadmap below.
            </p>
          </div>
        </section>
      </div>

      {/* Order details */}
      <section
        aria-label="Order details"
        id="request"
        className="grain rounded-blob border border-line bg-coal p-6 sm:p-10"
      >
        <div className="mb-8 max-w-xl">
          <p className="eyebrow mb-2">04 · make it real</p>
          <h2 className="display text-3xl text-cream">
            Request a custom <span className="display-italic text-rose-2">concept.</span>
          </h2>
          <p className="mt-3 text-sm text-muted">
            Your starter and mood tags come with the request automatically.
            I&apos;ll reply with thoughts, a rough quote, and next steps — no
            commitment yet.
          </p>
        </div>
        <InquiryForm defaultType="sneakers" initialIdea={initialIdea} context={context} />
      </section>
    </div>
  );
}
