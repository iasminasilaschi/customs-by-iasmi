import type { Metadata } from "next";
import Link from "next/link";
import { PhotoPlanner } from "@/components/design-lab/planner/PhotoPlanner";

/**
 * Private, like the rest of /design-lab (password via proxy.ts, noindex,
 * not linked from the public site). Plans a pair on real photos.
 */
export const metadata: Metadata = {
  title: "Photo planner",
  robots: { index: false, follow: false },
};

export default function PhotoPlannerPage() {
  return (
    <div className="gutter mx-auto max-w-[90rem] pt-28 pb-20 sm:pt-36">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div>
          <p className="eyebrow text-gold-ink">The Design Lab · private</p>
          <h1 className="mt-2 font-display text-3xl leading-tight text-cream sm:text-4xl">
            Photo planner <span className="display-italic text-rose-2">· Japan pair</span>
          </h1>
        </div>
        <Link
          href="/design-lab"
          className="inline-flex min-h-11 items-center text-sm text-brown underline-offset-4 hover:text-olive hover:underline"
        >
          ← 3D studio
        </Link>
      </div>
      <PhotoPlanner />
    </div>
  );
}
