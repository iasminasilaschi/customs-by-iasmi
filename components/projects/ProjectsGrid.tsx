"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { cn } from "@/lib/utils";
import {
  categoryLabels,
  portfolio,
  type PortfolioCategory,
} from "@/data/portfolio";

const filters: Array<{ value: PortfolioCategory | "all"; label: string }> = [
  { value: "all", label: "Everything" },
  ...(
    Object.entries(categoryLabels) as Array<[PortfolioCategory, string]>
  ).map(([value, label]) => ({ value, label })),
];

export function ProjectsGrid() {
  const [active, setActive] = useState<PortfolioCategory | "all">("all");

  const pieces = useMemo(
    () => (active === "all" ? portfolio : portfolio.filter((p) => p.category === active)),
    [active],
  );

  return (
    <div>
      <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2.5">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setActive(f.value)}
            aria-pressed={active === f.value}
            className={cn(
              "rounded-full border px-5 py-2 text-[0.95rem] transition-all duration-300 lg:text-base",
              active === f.value
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
            This corner of the studio is still being painted. Check back soon —
            or be the reason it fills up.
          </p>
        </div>
      ) : (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {pieces.map((piece) => (
            <ProjectCard key={piece.id} piece={piece} />
          ))}
        </div>
      )}
    </div>
  );
}
