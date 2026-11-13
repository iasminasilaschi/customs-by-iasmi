import { cn } from "@/lib/utils";

/** Eyebrow + editorial display heading + optional lede. */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  wide = false,
  as: Heading = "h2",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: string;
  align?: "left" | "center";
  /** Roomier measure for page-level headings (e.g. the Projects page). */
  wide?: boolean;
  /** "h1" for the heading at the top of a page; sections keep the default h2. */
  as?: "h1" | "h2";
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
      <Heading className="display text-cream text-[clamp(2.5rem,1.4rem+3.2vw,3.75rem)]">
        {title}
      </Heading>
      {lede && (
        <p className="mt-6 text-lg leading-relaxed text-muted">{lede}</p>
      )}
    </div>
  );
}
