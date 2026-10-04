import Image from "next/image";
import { cn } from "@/lib/utils";
import type { PhotoData } from "@/data/media";

/**
 * A real photo that fills its parent (which sets the shape, e.g. an
 * `aspect-[4/5]` box). Optimized by next/image from files in /public.
 */
export function Photo({
  photo,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority,
  className,
}: {
  photo: PhotoData;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={photo.src}
      alt={photo.alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn("object-cover", className)}
    />
  );
}
