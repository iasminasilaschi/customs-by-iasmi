import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DesignLabStudio } from "@/components/design-lab/studio/DesignLabStudio";
import { Tag } from "@/components/ui/Tag";

/**
 * Private: password-protected by proxy.ts, not linked anywhere, kept out of
 * the sitemap and disallowed in robots.txt. A sketching tool for me.
 */
export const metadata: Metadata = {
  title: "Design Lab",
  robots: { index: false, follow: false },
};

export default function DesignLabPage() {
  return (
    <div className="mx-auto max-w-[90rem] px-5 pt-36 pb-20 sm:px-6 lg:px-12 xl:px-20">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          as="h1"
          eyebrow="The Design Lab · private"
          title={
            <>
              Paint the pair{" "}
              <span className="display-italic text-rose-2">before it exists.</span>
            </>
          }
          lede="Turn the shoe, click a part, build a colour story. Save the image or copy the summary to plan a pair."
        />
        <div className="flex flex-wrap gap-2">
          <Tag tone="lilac">just for me</Tag>
        </div>
      </div>

      <div className="mt-12">
        <DesignLabStudio />
      </div>
    </div>
  );
}
