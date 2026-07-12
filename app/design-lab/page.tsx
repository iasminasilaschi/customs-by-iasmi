import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DesignLabShell } from "@/components/design-lab/DesignLabShell";
import { Tag } from "@/components/ui/Tag";
import { getPiece } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Design Lab",
  description:
    "Start a custom sneaker commission: pick a vibe, preview the concept, send your idea. The AI + 3D design lab is on the roadmap — this is its first room.",
};

const roadmap = [
  {
    phase: "Phase 1 — now",
    title: "Creative identity site",
    items: ["Studio homepage", "Projects & process", "Commission intake", "Caps as emerging service"],
    status: "live",
  },
  {
    phase: "Phase 2",
    title: "Real portfolio growth",
    items: ["The two September caps", "Process videos", "Before/after case studies", "First real testimonials"],
    status: "next",
  },
  {
    phase: "Phase 3",
    title: "Design Lab v2",
    items: ["Moodboard uploads", "Save & share concepts", "Palette extraction", "Richer starters"],
    status: "planned",
  },
  {
    phase: "Phase 4",
    title: "More services",
    items: ["Dedicated caps page", "Digital studio page", "Collaboration case studies"],
    status: "planned",
  },
  {
    phase: "Phase 5",
    title: "AI + 3D",
    items: ["AI-assisted concepts", "Zone-aware mockups", "3D customizer", "Deposits & dashboard"],
    status: "dreaming",
  },
];

export default async function DesignLabPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const refPiece = ref ? getPiece(ref) : undefined;
  const initialIdea = refPiece
    ? `I saw "${refPiece.title}" in your projects and I'd love something in that direction — but made mine. `
    : "";

  return (
    <div className="mx-auto max-w-[90rem] px-5 pt-36 pb-20 sm:px-6 lg:px-12 xl:px-20">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="The Design Lab · v1"
          title={
            <>
              Design your{" "}
              <span className="display-italic text-rose-2">custom pair.</span>
            </>
          }
          lede="Pick a vibe, set the mood, watch the concept repaint itself — then send the real request. This is the first small room of a much bigger lab."
        />
        <Tag tone="gold">AI design lab — coming soon</Tag>
      </div>

      <div className="mt-12">
        <DesignLabShell initialIdea={initialIdea} />
      </div>

      {/* Roadmap */}
      <section aria-label="Studio roadmap" className="mt-24">
        <SectionHeading
          eyebrow="Where this is going"
          title={
            <>
              The lab will{" "}
              <span className="display-italic text-lilac">grow rooms.</span>
            </>
          }
          lede="An honest roadmap — nothing here is promised for a date, but everything here is being built toward."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {roadmap.map((r) => (
            <div key={r.phase} className="flex flex-col rounded-2xl border border-line bg-coal p-5">
              <p className="eyebrow">{r.phase}</p>
              <h3 className="mt-2 font-medium text-cream">{r.title}</h3>
              <ul className="mt-3 flex-1 space-y-1.5 text-sm leading-relaxed text-muted">
                {r.items.map((i) => (
                  <li key={i}>· {i}</li>
                ))}
              </ul>
              <Tag
                tone={r.status === "live" ? "rose" : r.status === "next" ? "lilac" : "neutral"}
                className="mt-4 self-start"
              >
                {r.status}
              </Tag>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
