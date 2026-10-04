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
        </div>
      </div>

      <div className="mt-12">
        <DesignLabStudio initialIdea={initialIdea} />
      </div>
    </div>
  );
}
