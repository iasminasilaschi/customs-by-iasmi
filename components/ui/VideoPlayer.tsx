import { cn } from "@/lib/utils";
import type { VideoData } from "@/data/media";

/** A real, native video with controls. No autoplay, no fake chrome. */
export function VideoPlayer({
  video,
  label,
  className,
}: {
  video: VideoData;
  label: string;
  className?: string;
}) {
  return (
    <video
      controls
      playsInline
      preload="metadata"
      poster={video.poster}
      aria-label={label}
      className={cn("h-full w-full rounded-blob border border-line bg-deep object-cover", className)}
    >
      <source src={video.src} type="video/mp4" />
    </video>
  );
}
