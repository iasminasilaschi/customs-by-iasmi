import { ArtPlaceholder } from "@/components/mosaic/ArtPlaceholder";
import { cn } from "@/lib/utils";

/**
 * A single curated tile in the life mosaic — a soft framed colour field with
 * a small quiet caption. Calm and even, never a chaotic collage.
 */
export function MosaicTile({
  colors,
  label,
  className,
}: {
  colors: string[];
  label: string;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "group relative overflow-hidden rounded-card border border-line shadow-soft",
        className,
      )}
    >
      <ArtPlaceholder
        colors={colors}
        showLabel={false}
        className="h-full w-full transition-transform duration-700 group-hover:scale-[1.05]"
      />
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-deep/70 to-transparent px-4 pb-3 pt-8 text-[0.78rem] font-medium tracking-wide text-paper">
        {label}
      </figcaption>
    </figure>
  );
}
