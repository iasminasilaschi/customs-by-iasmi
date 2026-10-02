"use client";

/**
 * The 3D stage: canvas, warm studio lighting, orbit controls, preset
 * camera angles and the paintable sneaker. Loaded client-only (dynamic,
 * ssr:false) from DesignLabStudio.
 *
 * Lighting is procedural (Lightformers); the only asset is the ~1.5 MB
 * sneaker GLB, shown with a progress ring while it streams in.
 */

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  Environment,
  Lightformer,
  useProgress,
} from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { damp3 } from "maath/easing";
import { cn } from "@/lib/utils";
import { baseShoe, shoeParts } from "@/data/shoe";
import { useStudio, type ViewKey } from "./store";
import { ShoeModel } from "./ShoeModel";
import { SHOE_HEIGHT } from "./model-parts";
import { SneakerPreview } from "@/components/design-lab/SneakerPreview";

const TARGET: [number, number, number] = [0, SHOE_HEIGHT * 0.42, 0];

const VIEWS: Record<ViewKey, [number, number, number]> = {
  threeQuarter: [3.35, 1.65, 3.45],
  lateral: [0.15, 0.75, 5.0],
  medial: [0.15, 0.75, -5.0],
  front: [4.9, 0.85, 0.8],
  back: [-4.85, 1.1, 0.7],
  top: [0.35, 6.2, 0.4],
};

const VIEW_BUTTONS: Array<{ view: ViewKey; label: string }> = [
  { view: "threeQuarter", label: "¾" },
  { view: "lateral", label: "side" },
  { view: "medial", label: "inside" },
  { view: "front", label: "front" },
  { view: "back", label: "back" },
  { view: "top", label: "top" },
];

/** Eases the camera to the requested preset, then hands back control. */
function CameraRig() {
  const view = useStudio((s) => s.view);
  const nonce = useStudio((s) => s.viewNonce);
  const dest = useRef(new THREE.Vector3());
  const animating = useRef(false);

  useEffect(() => {
    if (nonce === 0) return; // initial position comes from <Canvas camera>
    dest.current.set(...VIEWS[view]);
    animating.current = true;
  }, [view, nonce]);

  useFrame((state, delta) => {
    if (!animating.current) return;
    const controls = state.controls as OrbitControlsImpl | null;
    if (controls) controls.enabled = false;
    damp3(state.camera.position, dest.current, 0.24, delta);
    state.camera.lookAt(TARGET[0], TARGET[1], TARGET[2]);
    if (state.camera.position.distanceTo(dest.current) < 0.02) {
      animating.current = false;
      if (controls) {
        controls.enabled = true;
        controls.update();
      }
    }
  });
  return null;
}

/** Gentle drop-and-settle entrance for the shoe. */
function FloatIn({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const settled = useRef(false);
  useFrame((_, delta) => {
    const g = group.current;
    if (!g || settled.current) return;
    damp3(g.position, [0, 0, 0], 0.35, delta);
    damp3(g.scale, [1, 1, 1], 0.3, delta);
    if (Math.abs(g.position.y) < 0.002 && Math.abs(1 - g.scale.x) < 0.002) {
      g.position.set(0, 0, 0);
      g.scale.setScalar(1);
      settled.current = true;
    }
  });
  return (
    <group ref={group} position={[0, 0.45, 0]} scale={0.86}>
      {children}
    </group>
  );
}

const nextFrame = () =>
  new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));

/**
 * Registers `snapshot()` in the store: a clean render (no hover/selection
 * glow) composed onto the studio's cream ground with a small caption.
 */
function SnapshotBridge() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const setSnapshot = useStudio((s) => s.setSnapshot);

  useEffect(() => {
    setSnapshot(async () => {
      const { selected, hovered } = useStudio.getState();
      useStudio.setState({ selected: null, hovered: null });
      await nextFrame();
      gl.render(scene, camera);
      const src = gl.domElement;
      const out = document.createElement("canvas");
      out.width = src.width;
      out.height = src.height;
      const ctx = out.getContext("2d");
      if (!ctx) return null;
      ctx.fillStyle = "#ece2d1";
      ctx.fillRect(0, 0, out.width, out.height);
      const glow = ctx.createRadialGradient(
        out.width / 2, out.height * 0.42, 0,
        out.width / 2, out.height * 0.42, out.width * 0.6,
      );
      glow.addColorStop(0, "rgba(143,155,130,0.22)");
      glow.addColorStop(1, "rgba(143,155,130,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, out.width, out.height);
      ctx.drawImage(src, 0, 0);
      const px = Math.round(out.width / 60);
      ctx.fillStyle = "#7a7060";
      ctx.font = `${px}px system-ui, sans-serif`;
      ctx.fillText(`${baseShoe.name} concept · customs by iasmi · iasmi.ro`, px * 1.5, out.height - px * 1.5);
      useStudio.setState({ selected, hovered });
      return out.toDataURL("image/png");
    });
    return () => setSnapshot(null);
  }, [gl, scene, camera, setSnapshot]);
  return null;
}

/** Flat fallback if WebGL is unavailable — the 2D concept sketch instead. */
function FlatFallback() {
  const colors = useStudio((s) => s.colors);
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
      <SneakerPreview
        palette={[colors.toeCap, colors.heel, colors.sole, colors.sideOuter]}
        className="w-full max-w-md"
      />
      <p className="max-w-sm text-center text-sm text-muted">
        Your browser can&apos;t show the 3D shoe, so here&apos;s the flat
        concept sketch — every colour still reaches the commission request.
      </p>
    </div>
  );
}

/** Progress ring while the sneaker model streams in. */
function LoadingVeil() {
  const { active, progress } = useProgress();
  const [shown, setShown] = useState(true);
  useEffect(() => {
    if (!active && progress === 100) {
      const t = setTimeout(() => setShown(false), 250);
      return () => clearTimeout(t);
    }
  }, [active, progress]);
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-500",
        shown ? "opacity-100" : "opacity-0",
      )}
      aria-hidden={!shown}
    >
      <div className="text-center">
        <div
          aria-hidden
          className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-sage border-t-transparent"
        />
        <p className="text-sm text-muted">warming up the studio… {Math.round(progress)}%</p>
      </div>
    </div>
  );
}

export default function ShoeViewer() {
  const selected = useStudio((s) => s.selected);
  const hovered = useStudio((s) => s.hovered);
  const autoSpin = useStudio((s) => s.autoSpin);
  const colors = useStudio((s) => s.colors);
  const view = useStudio((s) => s.view);
  const placing = useStudio((s) => s.placing);
  const placingArt = useStudio((s) => s.artwork.find((a) => a.id === s.placing));
  const requestView = useStudio((s) => s.requestView);
  const stopSpin = useStudio((s) => s.stopSpin);
  const select = useStudio((s) => s.select);
  const startPlacing = useStudio((s) => s.startPlacing);
  const removeArtwork = useStudio((s) => s.removeArtwork);
  const [ready, setReady] = useState(false);

  // Respect prefers-reduced-motion: no idle auto-spin.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) stopSpin();
  }, [stopSpin]);

  // Deep-linkable angle, e.g. /design-lab?v=lateral
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("v");
    if (v && v in VIEWS) requestView(v as ViewKey);
  }, [requestView]);

  const cancelPlacing = () => {
    // a brand-new piece that never landed is dropped; a "move" just stops
    if (placingArt && placingArt.mesh === null) removeArtwork(placingArt.id);
    else startPlacing(null);
  };

  // On stacked (mobile) layouts the panels sit below the stage — bring
  // the shoe back into view when it's waiting for a click.
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (placing && window.innerWidth < 1024) {
      root.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [placing]);

  // Esc cancels placing
  useEffect(() => {
    if (!placing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cancelPlacing();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const activePart = shoeParts.find((p) => p.key === (hovered ?? selected));

  return (
    <div ref={root} className="relative h-full w-full">
      <LoadingVeil />
      <Canvas
        dpr={[1, 1.8]}
        camera={{ position: VIEWS.threeQuarter, fov: 30, near: 0.1, far: 40 }}
        gl={{
          antialias: true,
          alpha: true,
          // Neutral keeps white leather white (ACES greys it out)
          toneMapping: THREE.NeutralToneMapping,
        }}
        fallback={<FlatFallback />}
        onCreated={() => setReady(true)}
        onPointerMissed={() => {
          if (!useStudio.getState().placing) select(null);
        }}
        className="!touch-none"
      >
        {/* warm, calm studio light — no harsh contrast */}
        <hemisphereLight args={["#fdfbf4", "#cabd9e", 0.65]} />
        <directionalLight position={[3.5, 4.5, 2.5]} intensity={1.2} color="#fff3e0" />
        <directionalLight position={[-3, 2.5, -3]} intensity={0.35} color="#dfe6d3" />
        <Environment resolution={64} frames={1}>
          <Lightformer intensity={0.9} rotation-x={Math.PI / 2} position={[0, 4, 0]} scale={[6, 6, 1]} color="#fff8ea" />
          <Lightformer intensity={0.5} rotation-y={Math.PI / 2} position={[-4, 1, 0]} scale={[4, 2, 1]} color="#f2ecdf" />
          <Lightformer intensity={0.4} rotation-y={-Math.PI / 2} position={[4, 1, -1]} scale={[4, 2, 1]} color="#e9edda" />
        </Environment>

        <Suspense fallback={null}>
          <FloatIn>
            <ShoeModel />
          </FloatIn>
        </Suspense>

        <ContactShadows
          position={[0, 0.001, 0]}
          opacity={0.35}
          scale={6.5}
          blur={2.7}
          far={2.4}
          resolution={512}
          color="#3a3222"
        />

        <OrbitControls
          makeDefault
          target={TARGET}
          enablePan={false}
          autoRotate={autoSpin}
          autoRotateSpeed={0.9}
          minDistance={3.1}
          maxDistance={7.5}
          minPolarAngle={0.15}
          maxPolarAngle={Math.PI / 2 - 0.05}
          onStart={stopSpin}
        />
        <CameraRig />
        <SnapshotBridge />
      </Canvas>

      {/* active part chip */}
      <div
        className={cn(
          "pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full border border-line bg-cream-soft/85 px-4 py-1.5 backdrop-blur-sm transition-opacity duration-300",
          activePart && !placing ? "opacity-100" : "opacity-0",
        )}
        aria-live="polite"
      >
        {activePart && (
          <>
            <span
              className="h-3 w-3 rounded-full border border-line"
              style={{ backgroundColor: colors[activePart.key] }}
            />
            <span className="text-sm text-cream">{activePart.label.toLowerCase()}</span>
          </>
        )}
      </div>

      {/* placing hint */}
      {placing && (
        <div
          className="absolute left-1/2 top-4 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap rounded-full border border-olive/40 bg-cream-soft/90 py-1.5 pl-4 pr-1.5 text-sm text-cream shadow-soft backdrop-blur-sm"
          role="status"
        >
          <span>
            click the shoe where your {placingArt?.kind === "text" ? "text" : "photo"} should go
          </span>
          <button
            type="button"
            onClick={cancelPlacing}
            className="rounded-full px-3 py-1 text-muted transition-colors hover:bg-sage/15 hover:text-cream"
          >
            cancel
          </button>
        </div>
      )}

      {/* rotate hint — fades once the visitor takes over */}
      <p
        className={cn(
          "pointer-events-none absolute bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm text-muted transition-opacity duration-700",
          ready && autoSpin && !selected ? "opacity-100" : "opacity-0",
        )}
      >
        drag to turn · click a part to paint it
      </p>

      {/* preset angles */}
      <div
        className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border border-line bg-cream-soft/85 p-1 backdrop-blur-sm"
        role="group"
        aria-label="Camera angles"
      >
        {VIEW_BUTTONS.map((b) => (
          <button
            key={b.view}
            type="button"
            onClick={() => requestView(b.view)}
            aria-pressed={view === b.view}
            className={cn(
              "rounded-full px-3 py-1 text-sm lowercase transition-colors",
              view === b.view
                ? "bg-olive text-paper"
                : "text-muted hover:bg-sage/15 hover:text-cream",
            )}
          >
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
}
