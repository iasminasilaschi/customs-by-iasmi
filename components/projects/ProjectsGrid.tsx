"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { cn } from "@/lib/utils";
import type { PortfolioCategory, PortfolioPiece } from "@/data/portfolio";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

export function ProjectsGrid({
  pieces: all,
  locale,
  t,
}: {
  /** Every project, already in this language. */
  pieces: PortfolioPiece[];
  locale: Locale;
  t: Pick<Dictionary, "projects" | "card" | "categories">;
}) {
  const [active, setActive] = useState<PortfolioCategory | "all">("all");

  // Only offer filters for categories that actually have a piece.
  const filters: Array<{ value: PortfolioCategory | "all"; label: string }> = [
    { value: "all", label: t.projects.everything },
    ...(Object.entries(t.categories) as Array<[PortfolioCategory, string]>)
      .filter(([value]) => all.some((p) => p.category === value))
      .map(([value, label]) => ({ value, label })),
  ];

  const pieces = useMemo(
    () => (active === "all" ? all : all.filter((p) => p.category === active)),
    [active, all],
  );

  return (
    <div>
      <div role="group" aria-label={t.projects.filterLabel} className="flex flex-wrap gap-2.5">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setActive(f.value)}
            aria-pressed={active === f.value}
            className={cn(
              "min-h-11 rounded-full border px-5 py-2 text-[0.95rem] transition-all duration-300 lg:text-base",
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
          <p className="hand text-2xl text-lilac">{t.projects.emptyTitle}</p>
          <p className="mt-3 text-sm text-muted">{t.projects.emptyText}</p>
        </div>
      ) : (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {pieces.map((piece) => (
            <ProjectCard key={piece.slug} piece={piece} locale={locale} t={t.card} categories={t.categories} headingLevel={2} />
          ))}
        </div>
      )}
    </div>
  );
}
