"use client";

/**
 * Photos & words — upload a picture or set some lettering, then click the
 * shoe to place it. Each piece gets size / rotate / move / remove controls.
 * Images are downscaled in the browser (nothing is uploaded anywhere);
 * lettering is rendered to an image with the site's own fonts.
 */

import { useRef, useState } from "react";
import {
  letteringFonts,
  MAX_ARTWORK,
  paintSwatches,
  shoeParts,
  type LetteringFontId,
} from "@/data/shoe";
import { cn } from "@/lib/utils";
import { useStudio, type Artwork } from "./store";

const MAX_SIDE = 1024;
const MAX_FILE_BYTES = 15 * 1024 * 1024;
const INKS = ["#17150f", "#4a382a", "#a14e32", "#e2745f", "#c9a35c", "#2b3a67", "#5f6f52", "#d98ba0", "#f9f6ee"];

/** Downscale an uploaded image to a compact data URL (keeps transparency). */
async function fileToArt(file: File): Promise<{ src: string; aspect: number }> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const k = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.max(1, Math.round(img.naturalWidth * k));
    const h = Math.max(1, Math.round(img.naturalHeight * k));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
    let src = canvas.toDataURL("image/webp", 0.85);
    if (!src.startsWith("data:image/webp")) src = canvas.toDataURL("image/png");
    return { src, aspect: h / w };
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Render lettering to a transparent image with one of the site fonts. */
async function textToArt(text: string, fontId: LetteringFontId, ink: string) {
  const def = letteringFonts.find((f) => f.id === fontId)!;
  const family =
    getComputedStyle(document.documentElement).getPropertyValue(def.cssVar).trim() || def.fallback;
  const px = 180;
  const font = `${def.weight} ${px}px ${family}, ${def.fallback}`;
  try {
    await document.fonts.load(font, text);
  } catch {
    // fall back to whatever is available
  }
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  ctx.font = font;
  const pad = px * 0.25;
  canvas.width = Math.ceil(ctx.measureText(text).width + pad * 2);
  canvas.height = Math.ceil(px * 1.45);
  ctx.font = font; // resizing the canvas resets the context
  ctx.fillStyle = ink;
  ctx.textBaseline = "middle";
  ctx.fillText(text, pad, canvas.height / 2);
  return { src: canvas.toDataURL("image/png"), aspect: canvas.height / canvas.width };
}

const partLabel = (a: Artwork) =>
  a.part ? shoeParts.find((p) => p.key === a.part)!.label.toLowerCase() : "waiting to be placed";

export function ArtPanel() {
  const artwork = useStudio((s) => s.artwork);
  const activeArt = useStudio((s) => s.activeArt);
  const placing = useStudio((s) => s.placing);
  const addArtwork = useStudio((s) => s.addArtwork);
  const updateArtwork = useStudio((s) => s.updateArtwork);
  const removeArtwork = useStudio((s) => s.removeArtwork);
  const startPlacing = useStudio((s) => s.startPlacing);
  const setActiveArt = useStudio((s) => s.setActiveArt);

  const fileInput = useRef<HTMLInputElement>(null);
  const [composing, setComposing] = useState(false);
  const [text, setText] = useState("");
  const [font, setFont] = useState<LetteringFontId>("serif");
  const [ink, setInk] = useState(INKS[0]);
  const [error, setError] = useState<string | null>(null);

  const full = artwork.length >= MAX_ARTWORK;

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow picking the same file again
    if (!file) return;
    setError(null);
    if (!file.type.startsWith("image/")) return setError("That doesn't look like an image.");
    if (file.size > MAX_FILE_BYTES) return setError("That image is over 15 MB — try a smaller one.");
    try {
      const art = await fileToArt(file);
      addArtwork({ kind: "photo", ...art });
    } catch {
      setError("Couldn't read that image — try a JPG or PNG.");
    }
  };

  const placeText = async () => {
    const t = text.trim();
    if (!t) return;
    const art = await textToArt(t, font, ink);
    addArtwork({ kind: "text", text: t, font, ink, ...art });
    setComposing(false);
    setText("");
  };

  return (
    <section aria-label="Photos and lettering" className="rounded-blob border border-line bg-coal p-5">
      <p className="eyebrow mb-1">03 · photos &amp; words</p>
      <p className="text-sm text-muted">
        A photo, a pet, a sketch, your initials — click the shoe to place it.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={full}
          onClick={() => fileInput.current?.click()}
          className="rounded-full border border-line bg-cream-soft/70 px-4 py-1.5 text-sm text-cream transition-colors hover:border-olive/50 disabled:opacity-50"
        >
          + photo
        </button>
        <button
          type="button"
          disabled={full}
          onClick={() => setComposing((c) => !c)}
          aria-expanded={composing}
          className="rounded-full border border-line bg-cream-soft/70 px-4 py-1.5 text-sm text-cream transition-colors hover:border-olive/50 disabled:opacity-50"
        >
          + text
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={onFile}
          className="hidden"
          aria-label="Upload a photo for the shoe"
        />
      </div>
      {full && <p className="mt-2 text-sm text-muted">{MAX_ARTWORK} pieces is the max — remove one to add more.</p>}
      {error && <p className="mt-2 text-sm text-rose" role="alert">{error}</p>}

      {composing && (
        <div className="mt-3 space-y-3 rounded-xl border border-line bg-cream-soft/60 p-3">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && placeText()}
            maxLength={24}
            placeholder="initials, a word, a date…"
            aria-label="Text for the shoe"
            className="w-full rounded-lg border border-line bg-cream-soft px-3 py-2 text-base text-cream placeholder:text-muted/70 focus:border-olive focus:outline-none"
          />
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Lettering style">
            {letteringFonts.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFont(f.id)}
                aria-pressed={font === f.id}
                style={{ fontFamily: `var(${f.cssVar}), ${f.fallback}` }}
                className={cn(
                  "rounded-full border px-3 py-1 text-sm transition-colors",
                  font === f.id ? "border-olive/50 bg-sage/15 text-cream" : "border-line text-muted hover:text-cream",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Ink colour">
            {INKS.map((hex) => {
              const name = paintSwatches.find((p) => p.hex === hex)?.name ?? hex;
              return (
                <button
                  key={hex}
                  type="button"
                  title={name}
                  aria-label={`Ink ${name}`}
                  aria-pressed={ink === hex}
                  onClick={() => setInk(hex)}
                  className={cn(
                    "h-6 w-6 rounded-full border border-line transition-transform hover:scale-110",
                    ink === hex && "ring-2 ring-olive ring-offset-2 ring-offset-cream-soft",
                  )}
                  style={{ backgroundColor: hex }}
                />
              );
            })}
          </div>
          <button
            type="button"
            onClick={placeText}
            disabled={!text.trim()}
            className="rounded-full bg-olive px-4 py-1.5 text-sm text-paper transition-opacity disabled:opacity-50"
          >
            place it on the shoe →
          </button>
        </div>
      )}

      {artwork.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {artwork.map((a) => {
            const open = activeArt === a.id;
            return (
              <li key={a.id} className={cn("rounded-xl border", open ? "border-olive/40 bg-sage/10" : "border-transparent")}>
                <button
                  type="button"
                  onClick={() => setActiveArt(open ? null : a.id)}
                  aria-expanded={open}
                  className="flex w-full items-center gap-3 px-2.5 py-2 text-left text-sm"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- local data URL */}
                  <img
                    src={a.src}
                    alt=""
                    className="h-8 w-8 shrink-0 rounded-md border border-line bg-cream-soft object-contain"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-cream">
                      {a.kind === "text" ? `“${a.text}”` : "photo"}
                    </span>
                    <span className="block text-muted">
                      {placing === a.id ? "click the shoe…" : partLabel(a)}
                    </span>
                  </span>
                </button>
                {open && a.mesh && (
                  <div className="space-y-2.5 px-2.5 pb-3">
                    <label className="block text-sm text-muted">
                      size
                      <input
                        type="range"
                        min={0.1}
                        max={1.1}
                        step={0.01}
                        value={a.size}
                        onChange={(e) => updateArtwork(a.id, { size: Number(e.target.value) })}
                        className="mt-1 block w-full accent-olive"
                      />
                    </label>
                    <label className="block text-sm text-muted">
                      rotate
                      <input
                        type="range"
                        min={-180}
                        max={180}
                        step={1}
                        value={a.angle}
                        onChange={(e) => updateArtwork(a.id, { angle: Number(e.target.value) })}
                        className="mt-1 block w-full accent-olive"
                      />
                    </label>
                    <div className="flex gap-4 text-sm">
                      <button
                        type="button"
                        onClick={() => startPlacing(a.id)}
                        className="text-brown underline-offset-4 hover:text-olive hover:underline"
                      >
                        move
                      </button>
                      <button
                        type="button"
                        onClick={() => removeArtwork(a.id)}
                        className="text-brown underline-offset-4 hover:text-olive hover:underline"
                      >
                        remove
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-3 text-sm text-muted/80">
        Only use images you have the rights to — your photos stay in this browser.
      </p>
    </section>
  );
}
