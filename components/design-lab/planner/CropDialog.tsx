"use client";

/** Crop a layer's image: drag the box or its corners. */

import { useEffect, useRef, useState } from "react";
import { assetSrc } from "./render";
import { FULL_CROP, type Crop, type Layer } from "./store";

const MIN = 0.04;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
type Drag = { mode: "move" | "tl" | "tr" | "bl" | "br"; sx: number; sy: number; c0: Crop } | null;

export function CropDialog({
  layer,
  onApply,
  onClose,
}: {
  layer: Layer;
  onApply: (crop: Crop) => void;
  onClose: () => void;
}) {
  const [crop, setCrop] = useState<Crop>(layer.crop);
  const boxRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLButtonElement>(null);
  const [drag, setDrag] = useState<Drag>(null);
  const src = assetSrc.get(layer.assetId);

  useEffect(() => {
    firstRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  const start = (mode: NonNullable<Drag>["mode"]) => (e: React.PointerEvent) => {
    e.stopPropagation();
    try {
      (e.target as Element).setPointerCapture(e.pointerId);
    } catch {
      // fine without capture
    }
    setDrag({ mode, sx: e.clientX, sy: e.clientY, c0: crop });
  };
  const move = (e: React.PointerEvent) => {
    const d = drag;
    const box = boxRef.current?.getBoundingClientRect();
    if (!d || !box) return;
    const dx = (e.clientX - d.sx) / box.width, dy = (e.clientY - d.sy) / box.height;
    const c = d.c0;
    let { x, y, w, h } = c;
    if (d.mode === "move") {
      x = clamp(c.x + dx, 0, 1 - c.w);
      y = clamp(c.y + dy, 0, 1 - c.h);
    } else {
      const left = d.mode === "tl" || d.mode === "bl";
      const top = d.mode === "tl" || d.mode === "tr";
      if (left) {
        x = clamp(c.x + dx, 0, c.x + c.w - MIN);
        w = c.x + c.w - x;
      } else w = clamp(c.w + dx, MIN, 1 - c.x);
      if (top) {
        y = clamp(c.y + dy, 0, c.y + c.h - MIN);
        h = c.y + c.h - y;
      } else h = clamp(c.h + dy, MIN, 1 - c.y);
    }
    setCrop({ x, y, w, h });
  };
  const end = () => setDrag(null);

  const corner = (mode: "tl" | "tr" | "bl" | "br", style: React.CSSProperties) => (
    <span
      onPointerDown={start(mode)}
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
      className="absolute flex h-11 w-11 touch-none items-center justify-center"
      style={style}
    >
      <span className="h-4 w-4 rounded-full border-2 border-olive bg-paper shadow-soft" />
    </span>
  );

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-deep/45 p-3 sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Crop the image"
        className="w-full max-w-md rounded-blob border border-line bg-ink p-4 shadow-lift"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="eyebrow mb-3 text-gold-ink">crop</p>
        <div className="flex justify-center rounded-xl bg-cream-soft p-5">
          <div ref={boxRef} className="relative inline-block touch-none select-none">
            {/* eslint-disable-next-line @next/next/no-img-element -- local blob/data URL */}
            <img src={src} alt="" className="block max-h-[50vh] max-w-full" draggable={false} />
            {/* dim outside the crop */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background: "rgba(47,58,47,0.45)",
                clipPath: `polygon(0 0,100% 0,100% 100%,0 100%,0 0,${crop.x * 100}% ${crop.y * 100}%,${crop.x * 100}% ${(crop.y + crop.h) * 100}%,${(crop.x + crop.w) * 100}% ${(crop.y + crop.h) * 100}%,${(crop.x + crop.w) * 100}% ${crop.y * 100}%,${crop.x * 100}% ${crop.y * 100}%)`,
              }}
            />
            <div
              onPointerDown={start("move")}
              onPointerMove={move}
              onPointerUp={end}
              onPointerCancel={end}
              className="absolute cursor-move touch-none border-2 border-paper outline outline-1 outline-olive"
              style={{ left: `${crop.x * 100}%`, top: `${crop.y * 100}%`, width: `${crop.w * 100}%`, height: `${crop.h * 100}%` }}
            >
              {corner("tl", { left: -22, top: -22 })}
              {corner("tr", { right: -22, top: -22 })}
              {corner("bl", { left: -22, bottom: -22 })}
              {corner("br", { right: -22, bottom: -22 })}
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setCrop({ ...FULL_CROP })}
            className="inline-flex min-h-11 items-center px-2 text-sm text-brown underline-offset-4 hover:underline"
          >
            reset
          </button>
          <div className="flex gap-2">
            <button
              ref={firstRef}
              type="button"
              onClick={onClose}
              className="min-h-11 rounded-full border border-olive/35 px-5 text-sm text-deep"
            >
              cancel
            </button>
            <button
              type="button"
              onClick={() => onApply(crop)}
              className="min-h-11 rounded-full bg-olive px-5 text-sm text-paper"
            >
              apply crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
