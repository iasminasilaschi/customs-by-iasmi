"use client";

import { cn } from "@/lib/utils";
import type { DesignStarter } from "@/data/starters";

/** Selectable design starter — a vibe to begin a commission from. */
export function StarterCard({
  starter,
  selected,
  onSelect,
}: {
  starter: DesignStarter;
  selected?: boolean;
  onSelect?: (s: DesignStarter) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(starter)}
      aria-pressed={selected}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300",
        selected
          ? "border-rose bg-rose/10 shadow-[0_0_0_1px_var(--color-rose)]"
          : "border-line bg-coal hover:border-cream/30 hover:-translate-y-0.5",
      )}
    >
      <div className="flex items-center gap-3">
        <span aria-hidden className="flex shrink-0 -space-x-1.5">
          {starter.palette.map((c) => (
            <span
              key={c}
              className="h-6 w-6 rounded-full border border-ink/40"
              style={{ backgroundColor: c }}
            />
          ))}
        </span>
        <div className="min-w-0">
          <p className="truncate font-medium text-cream">{starter.title}</p>
          <p className="hand truncate text-lilac">{starter.vibe}</p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">{starter.description}</p>
      <div className="mt-3 flex items-center justify-between text-[0.78rem] uppercase tracking-widest text-muted">
        <span>{starter.complexity}</span>
        <span className="text-gold">{starter.estimatedBudgetRange}</span>
      </div>
      {selected && (
        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-rose text-[0.72rem] text-ink">
          ✓
        </span>
      )}
    </button>
  );
}
