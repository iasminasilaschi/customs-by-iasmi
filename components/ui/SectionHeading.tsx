import { cn } from "@/lib/utils";

/** Eyebrow + editorial display heading + optional lede. */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  wide = false,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: string;
  align?: "left" | "center";
  /** Roomier measure for page-level headings (e.g. the Projects page). */
  wide?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        wide ? "max-w-3xl" : "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h2 className="display text-cream text-[clamp(2.5rem,1.4rem+3.2vw,3.75rem)]">
        {title}
      </h2>
      {lede && (
        <p className="mt-6 text-lg leading-relaxed text-muted">{lede}</p>
      )}
    </div>
  );
}
