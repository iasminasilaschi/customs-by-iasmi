"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Photo } from "@/components/ui/Photo";
import { cn } from "@/lib/utils";
import type { PhotoData } from "@/data/media";

/**
 * A titled grid of photos. Tapping one opens it whole (nothing cropped) in a
 * full-screen viewer: arrows / swipe to move through the set, pinch to zoom
 * on phones, click to zoom with a mouse.
 */
export function PhotoGrid({
  title,
  note,
  photos,
}: {
  title: string;
  note?: string;
  photos: PhotoData[];
}) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="mt-14">
      <h2 className="display text-2xl text-cream">{title}</h2>
      {note && <p className="mt-2 text-base text-muted">{note}</p>}
      <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">
        {photos.map((photo, i) => (
          <figure key={photo.src}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`View full photo: ${photo.alt}`}
              className="group relative block aspect-[3/4] w-full cursor-zoom-in overflow-hidden rounded-2xl border border-line bg-cream-soft"
            >
              <Photo
                photo={photo}
                sizes="(min-width: 768px) 33vw, 50vw"
                className="transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </button>
            {photo.caption && (
              <figcaption className="mt-2 text-sm leading-snug text-muted">{photo.caption}</figcaption>
            )}
          </figure>
        ))}
      </div>
      {open !== null && (
        <Viewer photos={photos} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
      )}
    </section>
  );
}

function Viewer({
  photos,
  index,
  onIndex,
  onClose,
}: {
  photos: PhotoData[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const photo = photos[index];
  const many = photos.length > 1;

  const go = (step: number) => {
    setZoom(null);
    onIndex((index + step + photos.length) % photos.length);
  };

  // native modal: Esc, focus trap, top layer; keep the page behind from scrolling
  useEffect(() => {
    const d = dialog.current;
    d?.showModal();
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
      d?.close();
    };
  }, []);

  const origin = (e: React.PointerEvent | React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 };
  };

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onKeyDown={(e) => {
        if (many && e.key === "ArrowRight") go(1);
        if (many && e.key === "ArrowLeft") go(-1);
      }}
      aria-label={photo.caption ?? photo.alt}
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-deep-2/90 p-0 text-paper backdrop-blur-md backdrop:bg-transparent"
    >
      <div
        className="flex h-full flex-col"
        // a tap on the dark area (not the photo or a button) closes
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div
          className="relative min-h-0 flex-1 overflow-hidden"
          onClick={(e) => e.target === e.currentTarget && onClose()}
          onTouchStart={(e) => {
            const t = e.touches[0];
            swipeStart.current = e.touches.length === 1 ? { x: t.clientX, y: t.clientY } : null;
          }}
          onTouchEnd={(e) => {
            const s = swipeStart.current;
            swipeStart.current = null;
            // leave pinch-zoomed panning alone; only a clear sideways swipe changes photo
            if (!s || !many || (window.visualViewport?.scale ?? 1) > 1.01) return;
            const t = e.changedTouches[0];
            const dx = t.clientX - s.x;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(t.clientY - s.y) * 1.5) go(dx < 0 ? 1 : -1);
          }}
        >
          <div className="absolute inset-3 sm:inset-6">
            <Image
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="100vw"
              className={cn(
                "object-contain transition-transform duration-300",
                zoom ? "cursor-zoom-out" : "cursor-zoom-in",
              )}
              style={zoom ? { transform: "scale(2.5)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
              onClick={(e) => {
                // touch screens pinch natively; click-to-zoom is for mice
                if (window.matchMedia("(pointer: coarse)").matches) return;
                setZoom(zoom ? null : origin(e));
              }}
              onPointerMove={(e) => zoom && e.pointerType === "mouse" && setZoom(origin(e))}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
          {many && (
            <ViewerButton label="Previous photo" onClick={() => go(-1)}>
              ←
            </ViewerButton>
          )}
          <p className="min-w-0 flex-1 text-center text-sm leading-snug text-paper/80">
            {photo.caption}
            {many && <span className="ml-2 text-paper/50">{index + 1} / {photos.length}</span>}
          </p>
          {many && (
            <ViewerButton label="Next photo" onClick={() => go(1)}>
              →
            </ViewerButton>
          )}
        </div>
      </div>

      <ViewerButton label="Close" onClick={onClose} className="absolute top-[max(0.75rem,env(safe-area-inset-top))] right-3 sm:right-5">
        ✕
      </ViewerButton>
    </dialog>
  );
}

function ViewerButton({
  label,
  onClick,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-full border border-paper/25 bg-deep/60 text-lg text-paper transition-colors hover:bg-paper/15",
        className,
      )}
    >
      {children}
    </button>
  );
}
