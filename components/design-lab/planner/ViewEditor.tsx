"use client";

/**
 * One side of one shoe, with its own art layers.
 *
 * Touch: tap a layer to select it, drag to move, pinch (anywhere) to size
 * and turn the selected layer, or use the corner handle with one finger.
 * Pinch on an empty shoe zooms the stage; drag pans when zoomed.
 * Mouse: wheel sizes the selection (Shift+wheel turns it), or zooms the stage.
 * Keyboard (canvas focused): arrows move, +/- size, [ ] turn, Delete removes.
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { PlannerView } from "@/data/planner";
import { cn } from "@/lib/utils";
import { assetDims } from "./io";
import { hitLayer, layerCorners, layerSize, renderView, viewLoaded } from "./render";
import { usePlanner, type Layer } from "./store";

const MIN_W = 0.02;
const MAX_W = 3;
const HANDLE_R = 22; // css px hit radius (44px target)
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

type Gesture =
  | { type: "drag"; id: string; sx: number; sy: number; x0: number; y0: number; moved: boolean }
  | { type: "handle"; id: string; d0: number; a0: number; w0: number; r0: number }
  | { type: "pinch"; id: string; d0: number; a0: number; mx: number; my: number; w0: number; r0: number; x0: number; y0: number }
  | { type: "pan"; sx: number; sy: number; px: number; py: number; moved: boolean }
  | { type: "stagePinch"; d0: number; z0: number };

export function ViewEditor({ view }: { view: PlannerView }) {
  const layers = usePlanner((s) => s.layers[view.key]);
  const selectedId = usePlanner((s) => s.selectedId);
  const version = usePlanner((s) => s.imagesVersion);
  const select = usePlanner((s) => s.select);
  const updateLayer = usePlanner((s) => s.updateLayer);
  const removeLayer = usePlanner((s) => s.removeLayer);

  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  // re-evaluated on every image load (imagesVersion is subscribed above)
  const ready = viewLoaded(view, version);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<Gesture | null>(null);

  // stage size: fit the shoe's aspect, within sensible heights
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      const maxH = Math.max(260, Math.min(window.innerHeight * 0.62, 720));
      const h = clamp(w * (view.height / view.width) + 32, 220, maxH);
      setBox({ w, h: Math.round(h) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [view.width, view.height]);

  const fit = box.w ? Math.min((box.w - 24) / view.width, (box.h - 24) / view.height) : 1;
  const k = fit * zoom; // view px → css px

  /** view px → css px matrix */
  const cssMatrix = useCallback(
    () =>
      new DOMMatrix()
        .translate(box.w / 2 + pan.x, box.h / 2 + pan.y)
        .scale(k)
        .translate(-view.width / 2, -view.height / 2),
    [box.w, box.h, pan.x, pan.y, k, view.width, view.height],
  );

  const toView = useCallback(
    (cx: number, cy: number) => {
      const p = cssMatrix().inverse().transformPoint({ x: cx, y: cy });
      return { x: p.x, y: p.y };
    },
    [cssMatrix],
  );

  // draw
  useEffect(() => {
    const c = canvasRef.current;
    if (!c || !box.w) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const W = Math.round(box.w * dpr), H = Math.round(box.h * dpr);
    if (c.width !== W) c.width = W;
    if (c.height !== H) c.height = H;
    const ctx = c.getContext("2d")!;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const t = new DOMMatrix().scale(dpr).multiply(cssMatrix());
    const ok = renderView(ctx, view, layers, t);
    const sel = layers.find((l) => l.id === selectedId);
    if (ok && sel && !sel.hidden) {
      const pts = layerCorners(view, sel, assetDims).map((p) => t.transformPoint(p));
      ctx.save();
      ctx.lineWidth = 1.5 * dpr;
      ctx.strokeStyle = "rgba(47,58,47,0.9)";
      ctx.setLineDash([6 * dpr, 5 * dpr]);
      ctx.beginPath();
      pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.closePath();
      ctx.stroke();
      ctx.setLineDash([]);
      const h = pts[2];
      ctx.beginPath();
      ctx.arc(h.x, h.y, 9 * dpr, 0, Math.PI * 2);
      ctx.fillStyle = "#fbf8f0";
      ctx.fill();
      ctx.lineWidth = 2 * dpr;
      ctx.strokeStyle = "#5f6f52";
      ctx.stroke();
      // tiny arrows in the handle: resize + turn
      ctx.beginPath();
      ctx.arc(h.x, h.y, 4 * dpr, -Math.PI * 0.9, Math.PI * 0.4);
      ctx.stroke();
      ctx.restore();
    }
  }, [box, cssMatrix, layers, selectedId, version, view]);

  const selected = layers.find((l) => l.id === selectedId) ?? null;

  const local = (e: React.PointerEvent | PointerEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const startPinch = () => {
    const [a, b] = [...pointers.current.values()];
    const d0 = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    const a0 = Math.atan2(b.y - a.y, b.x - a.x);
    const sel = usePlanner.getState().layers[view.key].find((l) => l.id === usePlanner.getState().selectedId);
    if (sel) {
      gesture.current = { type: "pinch", id: sel.id, d0, a0, mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2, w0: sel.w, r0: sel.rotation, x0: sel.x, y0: sel.y };
    } else {
      gesture.current = { type: "stagePinch", d0, z0: zoom };
    }
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!ready) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // synthetic / already-gone pointer: fine without capture
    }
    const p = local(e);
    pointers.current.set(e.pointerId, p);
    if (pointers.current.size === 2) return startPinch();
    if (pointers.current.size > 2) return;

    // corner handle of the selection?
    if (selected && !selected.hidden) {
      const m = cssMatrix();
      const h = m.transformPoint(layerCorners(view, selected, assetDims)[2]);
      if (Math.hypot(p.x - h.x, p.y - h.y) <= HANDLE_R) {
        const c = m.transformPoint({ x: selected.x * view.width, y: selected.y * view.height });
        gesture.current = {
          type: "handle",
          id: selected.id,
          d0: Math.hypot(p.x - c.x, p.y - c.y) || 1,
          a0: Math.atan2(p.y - c.y, p.x - c.x),
          w0: selected.w,
          r0: selected.rotation,
        };
        return;
      }
    }
    const v = toView(p.x, p.y);
    const hit = hitLayer(view, layers, v.x, v.y, assetDims);
    if (hit) {
      select(hit.id);
      gesture.current = { type: "drag", id: hit.id, sx: p.x, sy: p.y, x0: hit.x, y0: hit.y, moved: false };
    } else {
      gesture.current = { type: "pan", sx: p.x, sy: p.y, px: pan.x, py: pan.y, moved: false };
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    const p = local(e);
    pointers.current.set(e.pointerId, p);
    const g = gesture.current;
    if (!g) return;
    if (g.type === "drag") {
      const dx = p.x - g.sx, dy = p.y - g.sy;
      if (!g.moved && Math.hypot(dx, dy) < 3) return;
      g.moved = true;
      updateLayer(view.key, g.id, {
        x: clamp(g.x0 + dx / k / view.width, -0.5, 1.5),
        y: clamp(g.y0 + dy / k / view.height, -0.5, 1.5),
      });
    } else if (g.type === "handle") {
      const sel = layers.find((l) => l.id === g.id);
      if (!sel) return;
      const c = cssMatrix().transformPoint({ x: sel.x * view.width, y: sel.y * view.height });
      const d = Math.hypot(p.x - c.x, p.y - c.y);
      const a = Math.atan2(p.y - c.y, p.x - c.x);
      updateLayer(view.key, g.id, {
        w: clamp((g.w0 * d) / g.d0, MIN_W, MAX_W),
        rotation: normAngle(g.r0 + ((a - g.a0) * 180) / Math.PI),
      });
    } else if (g.type === "pinch" || g.type === "stagePinch") {
      if (pointers.current.size < 2) return;
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(b.x - a.x, b.y - a.y);
      if (g.type === "stagePinch") {
        setZoom(clamp((g.z0 * d) / g.d0, 1, 5));
        return;
      }
      const ang = Math.atan2(b.y - a.y, b.x - a.x);
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      updateLayer(view.key, g.id, {
        w: clamp((g.w0 * d) / g.d0, MIN_W, MAX_W),
        rotation: normAngle(g.r0 + ((ang - g.a0) * 180) / Math.PI),
        x: clamp(g.x0 + (mx - g.mx) / k / view.width, -0.5, 1.5),
        y: clamp(g.y0 + (my - g.my) / k / view.height, -0.5, 1.5),
      });
    } else if (g.type === "pan") {
      const dx = p.x - g.sx, dy = p.y - g.sy;
      if (!g.moved && Math.hypot(dx, dy) < 4) return;
      g.moved = true;
      if (zoom > 1) setPan({ x: g.px + dx, y: g.py + dy });
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    pointers.current.delete(e.pointerId);
    const g = gesture.current;
    if (g?.type === "pan" && !g.moved) select(null); // a tap on bare shoe clears the selection
    if (pointers.current.size === 0) gesture.current = null;
    else if (g?.type === "pinch" || g?.type === "stagePinch") gesture.current = null; // lifted one finger: stop
  };

  // wheel needs a non-passive listener to stop the page scrolling
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const onWheel = (e: WheelEvent) => {
      const st = usePlanner.getState();
      const sel = st.layers[view.key].find((l) => l.id === st.selectedId);
      if (!sel && zoom === 1 && e.deltaY > 0) return; // let the page scroll out
      e.preventDefault();
      if (sel) {
        if (e.shiftKey) st.updateLayer(view.key, sel.id, { rotation: normAngle(sel.rotation + Math.sign(e.deltaY) * 3) });
        else st.updateLayer(view.key, sel.id, { w: clamp(sel.w * Math.exp(-e.deltaY * 0.0015), MIN_W, MAX_W) });
      } else {
        setZoom((z) => {
          const nz = clamp(z * Math.exp(-e.deltaY * 0.0015), 1, 5);
          if (nz === 1) setPan({ x: 0, y: 0 });
          return nz;
        });
      }
    };
    c.addEventListener("wheel", onWheel, { passive: false });
    return () => c.removeEventListener("wheel", onWheel);
  }, [view.key, zoom]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!selected) return;
    const step = e.shiftKey ? 0.05 : 0.01;
    const patch: Partial<Layer> | null =
      e.key === "ArrowLeft" ? { x: selected.x - step }
      : e.key === "ArrowRight" ? { x: selected.x + step }
      : e.key === "ArrowUp" ? { y: selected.y - step * (view.width / view.height) }
      : e.key === "ArrowDown" ? { y: selected.y + step * (view.width / view.height) }
      : e.key === "+" || e.key === "=" ? { w: clamp(selected.w * 1.05, MIN_W, MAX_W) }
      : e.key === "-" ? { w: clamp(selected.w / 1.05, MIN_W, MAX_W) }
      : e.key === "]" ? { rotation: normAngle(selected.rotation + (e.shiftKey ? 15 : 2)) }
      : e.key === "[" ? { rotation: normAngle(selected.rotation - (e.shiftKey ? 15 : 2)) }
      : null;
    if (patch) {
      e.preventDefault();
      updateLayer(view.key, selected.id, patch);
    } else if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      removeLayer(view.key, selected.id);
    } else if (e.key === "Escape") {
      select(null);
    }
  };

  const zoomBy = (f: number) =>
    setZoom((z) => {
      const nz = clamp(z * f, 1, 5);
      if (nz === 1) setPan({ x: 0, y: 0 });
      return nz;
    });

  const selSize = selected ? layerSize(view, selected, assetDims) : null;

  return (
    <div>
      <div
        ref={wrapRef}
        className="grain relative overflow-hidden rounded-blob border border-line bg-cream-soft shadow-soft"
        style={{ height: box.h || 240 }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(70% 60% at 50% 45%, rgba(143,155,130,0.16), transparent 70%)" }}
        />
        <canvas
          ref={canvasRef}
          tabIndex={0}
          role="img"
          aria-label={`${view.label}: ${layers.length} art layer${layers.length === 1 ? "" : "s"}. ${
            selected ? "A layer is selected: arrows move it, plus and minus size it, brackets turn it, Delete removes it." : "Tap a layer to select it."
          }`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={onKeyDown}
          className="relative block h-full w-full touch-none select-none focus-visible:outline-offset-[-4px]"
          style={{ width: box.w || "100%", height: box.h || 240 }}
        />
        {!ready && (
          <p className="absolute inset-0 flex items-center justify-center text-sm text-muted">loading the shoe…</p>
        )}
        {view.approximate && (
          <p className="pointer-events-none absolute top-2 left-2 max-w-[75%] rounded-full bg-paper/90 px-3 py-1 text-xs leading-snug text-brown-ink shadow-soft">
            Mirrored copy · {view.approximate}
          </p>
        )}
        <div className="absolute right-2 bottom-2 flex gap-1.5">
          <StageButton label="Zoom out" onClick={() => zoomBy(1 / 1.5)} disabled={zoom <= 1}>
            −
          </StageButton>
          <StageButton label="Zoom in" onClick={() => zoomBy(1.5)} disabled={zoom >= 5}>
            +
          </StageButton>
          {zoom > 1 && (
            <StageButton label="Fit the shoe" onClick={() => (setZoom(1), setPan({ x: 0, y: 0 }))} wide>
              fit
            </StageButton>
          )}
        </div>
      </div>
      <p className="mt-2 text-xs text-muted" aria-live="polite">
        {selected && selSize
          ? `Selected · ${Math.round(selected.rotation)}° · ${Math.round((selSize.w / view.width) * 100)}% of the view wide. Drag to move, pinch or use the round handle to size and turn.`
          : layers.length
            ? "Tap a layer to select it. Pinch the shoe to zoom."
            : "Add something from the library."}
      </p>
    </div>
  );
}

function normAngle(a: number) {
  let r = ((a + 180) % 360 + 360) % 360 - 180;
  if (Math.abs(r) < 1.5) r = 0; // snap to level
  return r;
}

function StageButton({
  children,
  label,
  onClick,
  disabled,
  wide,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  wide?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "glass flex h-11 items-center justify-center rounded-full text-lg leading-none text-cream transition-opacity disabled:opacity-40",
        wide ? "px-4 text-sm" : "w-11",
      )}
    >
      {children}
    </button>
  );
}
