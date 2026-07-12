"use client";

/**
 * The 3D stage: canvas, warm studio lighting, orbit controls, preset
 * camera angles and the paintable shoe. Loaded client-only (dynamic,
 * ssr:false) from DesignLabStudio.
 *
 * No external assets — lighting is procedural (Lightformers), the shoe is
 * generated, so the stage appears instantly and works offline.
 */

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  Environment,
  Lightformer,
} from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { damp3 } from "maath/easing";
import { cn } from "@/lib/utils";
import { shoeParts } from "@/data/shoe";
import { useStudio, type ViewKey } from "./store";
import { ShoeModel } from "./ShoeModel";
import { SneakerPreview } from "@/components/design-lab/SneakerPreview";

const TARGET: [number, number, number] = [0, 0.42, 0];

const VIEWS: Record<ViewKey, [number, number, number]> = {
  threeQuarter: [3.35, 1.65, 3.45],
  lateral: [0.15, 0.75, 5.0],
  medial: [0.15, 0.75, -5.0],
  front: [4.9, 0.75, 0.8],
  back: [-4.85, 1.0, 0.7],
  top: [0.35, 5.0, 0.4],
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

/** Flat fallback if WebGL is unavailable — the 2D concept sketch instead. */
function FlatFallback() {
  const colors = useStudio((s) => s.colors);
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
      <SneakerPreview
        palette={[colors.toeBox, colors.sideMark, colors.heelTab, colors.vamp]}
        className="w-full max-w-md"
      />
      <p className="max-w-sm text-center text-sm text-muted">
        Your browser can&apos;t show the 3D shoe, so here&apos;s the flat
        concept sketch — every colour still reaches the commission request.
      </p>
    </div>
  );
}

export default function ShoeViewer() {
  const selected = useStudio((s) => s.selected);
  const hovered = useStudio((s) => s.hovered);
  const autoSpin = useStudio((s) => s.autoSpin);
  const colors = useStudio((s) => s.colors);
  const view = useStudio((s) => s.view);
  const requestView = useStudio((s) => s.requestView);
  const stopSpin = useStudio((s) => s.stopSpin);
  const select = useStudio((s) => s.select);
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

  const activePart = shoeParts.find((p) => p.key === (hovered ?? selected));

  return (
    <div className="relative h-full w-full">
      <Canvas
        dpr={[1, 1.8]}
        camera={{ position: VIEWS.threeQuarter, fov: 30, near: 0.1, far: 40 }}
        gl={{ antialias: true, alpha: true }}
        fallback={<FlatFallback />}
        onCreated={() => setReady(true)}
        onPointerMissed={() => select(null)}
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

        <FloatIn>
          <ShoeModel />
        </FloatIn>

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
      </Canvas>

      {/* active part chip */}
      <div
        className={cn(
          "pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full border border-line bg-cream-soft/85 px-4 py-1.5 backdrop-blur-sm transition-opacity duration-300",
          activePart ? "opacity-100" : "opacity-0",
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
