"use client";

import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { cn } from "@/lib/utils";
import {
  allThemes,
  categoryLabels,
  portfolio,
  type PortfolioCategory,
  type PortfolioPiece,
} from "@/data/portfolio";

/** A filter is "everything", a category, or a theme (e.g. "Anime"). It lives in the URL. */
interface Filter {
  label: string;
  param?: { key: "category" | "theme"; value: string };
  matches: (p: PortfolioPiece) => boolean;
}

// Only offer filters that actually have a piece.
const filters: Filter[] = [
  { label: "Everything", matches: () => true },
  ...(Object.entries(categoryLabels) as Array<[PortfolioCategory, string]>)
    .filter(([value]) => portfolio.some((p) => p.category === value))
    .map(([value, label]): Filter => ({
      label,
      param: { key: "category", value },
      matches: (p) => p.category === value,
    })),
  ...allThemes.map((theme): Filter => ({
    label: theme,
    param: { key: "theme", value: theme },
    matches: (p) => p.themes?.includes(theme) ?? false,
  })),
];

export function ProjectsGrid() {
  // reading the URL needs the browser; until then, show everything
  return (
    <Suspense fallback={<GridView active={filters[0]} />}>
      <UrlProjectsGrid />
    </Suspense>
  );
}

function UrlProjectsGrid() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const active =
    filters.find((f) => f.param && params.get(f.param.key) === f.param.value) ?? filters[0];

  const select = (f: Filter) => {
    const query = f.param ? `?${new URLSearchParams({ [f.param.key]: f.param.value })}` : "";
    router.replace(pathname + query, { scroll: false });
  };

  return <GridView active={active} onSelect={select} />;
}

function GridView({ active, onSelect }: { active: Filter; onSelect?: (f: Filter) => void }) {
  const pieces = portfolio.filter(active.matches);

  return (
    <div>
      <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-2.5">
        {filters.map((f) => (
          <button
            key={f.label}
            type="button"
            onClick={() => onSelect?.(f)}
            aria-pressed={active === f}
            className={cn(
              "rounded-full border px-5 py-2 text-[0.95rem] transition-all duration-300 lg:text-base",
              active === f
                ? "border-olive bg-olive text-paper"
                : "border-line text-muted hover:border-olive/40 hover:text-deep",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {pieces.length === 0 ? (
        <div className="glass grain mt-12 rounded-blob p-12 text-center">
          <p className="hand text-2xl text-lilac">nothing here yet…</p>
          <p className="mt-3 text-sm text-muted">
            The first projects are being photographed and written up. In the
            meantime, you can see everything I post on Instagram.
          </p>
        </div>
      ) : (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {pieces.map((piece) => (
            <ProjectCard key={piece.slug} piece={piece} />
          ))}
        </div>
      )}
    </div>
  );
}
