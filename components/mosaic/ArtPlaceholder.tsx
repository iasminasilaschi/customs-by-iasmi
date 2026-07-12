import { cn } from "@/lib/utils";

/**
 * Placeholder "artwork" rendered from a colour palette: layered gradients +
 * grain, with a small label. Looks intentional (editorial colour field)
 * instead of a grey box, and is swapped for a real <Image> once real media
 * exists. Decorative only — meaning is carried by the label text.
 */
export function ArtPlaceholder({
  colors,
  label,
  className,
  showLabel = true,
}: {
  colors: string[];
  label?: string;
  className?: string;
  showLabel?: boolean;
}) {
  const [c1, c2 = c1, c3 = c2, c4 = c3] = colors;
  return (
    <div
      className={cn("grain relative overflow-hidden", className)}
      role={label ? "img" : undefined}
      aria-label={label ? `Placeholder image: ${label}` : undefined}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(120% 90% at 15% 10%, ${c1} 0%, transparent 55%),
            radial-gradient(110% 100% at 90% 20%, ${c2} 0%, transparent 60%),
            radial-gradient(130% 110% at 70% 95%, ${c3} 0%, transparent 55%),
            linear-gradient(160deg, ${c4} 0%, ${c1} 100%)
          `,
        }}
      />
      {/* soft brush-stroke sweep */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          background: `linear-gradient(115deg, transparent 30%, ${c2}66 45%, transparent 62%)`,
        }}
      />
      {showLabel && label && (
        <span className="absolute bottom-2.5 left-3 z-10 rounded-full bg-deep/55 px-2.5 py-1 text-[0.78rem] tracking-wide text-paper/90 backdrop-blur-sm">
          {label}
        </span>
      )}
    </div>
  );
}
