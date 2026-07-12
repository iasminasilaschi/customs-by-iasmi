import { ArtPlaceholder } from "./ArtPlaceholder";
import { cn } from "@/lib/utils";

/**
 * Cinematic video placeholder card: palette background + play button +
 * "coming soon" chip. Swap for a real <video>/embed when reels exist.
 */
export function VideoPlaceholder({
  colors,
  label,
  duration = "0:42",
  className,
}: {
  colors: string[];
  label: string;
  duration?: string;
  className?: string;
}) {
  return (
    <div className={cn("group relative overflow-hidden rounded-blob", className)}>
      <ArtPlaceholder colors={colors} className="absolute inset-0" showLabel={false} />
      <div className="absolute inset-0 bg-deep/30 transition-colors duration-500 group-hover:bg-deep/20" />
      <div className="relative flex h-full flex-col justify-between p-4">
        <span className="self-end rounded-full bg-deep/55 px-2.5 py-1 text-[0.78rem] tracking-widest uppercase text-paper/80 backdrop-blur-sm">
          reel coming soon
        </span>
        <div className="flex items-end justify-between">
          <div>
            <span
              aria-hidden
              className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-paper/90 text-deep transition-transform duration-500 group-hover:scale-110"
            >
              <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor">
                <path d="M0 0l14 8-14 8V0z" />
              </svg>
            </span>
            <p className="text-sm font-medium text-paper">{label}</p>
          </div>
          <span className="rounded-full bg-deep/55 px-2 py-0.5 text-[0.78rem] text-paper/80 backdrop-blur-sm">
            {duration}
          </span>
        </div>
      </div>
    </div>
  );
}
