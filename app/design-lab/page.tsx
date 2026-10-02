import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DesignLabStudio } from "@/components/design-lab/studio/DesignLabStudio";
import { Tag } from "@/components/ui/Tag";
import { getPiece } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Design Lab",
  description:
    "Spin a real 3D sneaker, paint every panel, add your photos and initials, and send the concept as a real commission request — the interactive Design Lab studio.",
};

const roadmap = [
  {
    phase: "Phase 1",
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
    phase: "Phase 3 — now",
    title: "Design Lab — 3D studio",
    items: ["Real 3D sneaker, nine paintable parts", "Photos, initials & finishes on the shoe", "Concept image → commission handoff", "Saved in your browser as you play"],
    status: "live",
  },
  {
    phase: "Phase 4",
    title: "More services",
    items: ["Dedicated caps page", "Digital studio page", "Collaboration case studies"],
    status: "planned",
  },
  {
    phase: "Phase 5",
    title: "AI + deeper lab",
    items: ["AI-assisted concepts", "Moodboard & palette extraction", "Leather textures & artwork tools", "Deposits & dashboard"],
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
          eyebrow="The Design Lab · v3"
          title={
            <>
              Paint the pair{" "}
              <span className="display-italic text-rose-2">before it exists.</span>
            </>
          }
          lede="Turn the shoe in your hands, click a part, build a colour story. A concept first — a hand-painted commission next."
        />
        <div className="flex flex-wrap gap-2">
          <Tag tone="lilac">new · interactive 3D</Tag>
          <Tag tone="gold">AI concepts — next phase</Tag>
        </div>
      </div>

      <div className="mt-12">
        <DesignLabStudio initialIdea={initialIdea} />
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
