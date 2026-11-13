import { cn } from "@/lib/utils";

/** Small tag chip. `tone` shifts the warm accent. */
export function Tag({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "rose" | "lilac" | "gold";
  className?: string;
}) {
  const tones = {
    neutral: "border-line text-muted bg-coal-2/50",
    rose: "border-rose/30 text-rose-ink bg-rose/10",
    lilac: "border-sage/40 text-olive-ink bg-sage/12",
    gold: "border-gold/35 text-gold-tag bg-gold/10",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[0.8rem] tracking-wide lowercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
