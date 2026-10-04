import { Photo } from "@/components/ui/Photo";
import { cn } from "@/lib/utils";
import type { PhotoData } from "@/data/media";

/**
 * A single curated tile in the life mosaic — a real photo in a soft frame
 * with an optional quiet caption.
 */
export function MosaicTile({
  photo,
  label,
  className,
}: {
  photo: PhotoData;
  label?: string;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "group relative overflow-hidden rounded-card border border-line shadow-soft",
        className,
      )}
    >
      <Photo
        photo={photo}
        sizes="(min-width: 1024px) 20vw, 45vw"
        className="transition-transform duration-700 group-hover:scale-[1.05]"
      />
      {label && (
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-deep/70 to-transparent px-4 pb-3 pt-8 text-[0.78rem] font-medium tracking-wide text-paper">
          {label}
        </figcaption>
      )}
    </figure>
  );
}
