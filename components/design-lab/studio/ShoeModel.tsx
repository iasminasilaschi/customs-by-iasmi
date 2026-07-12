"use client";

/**
 * The paintable concept shoe. Every part is a group of meshes keyed by
 * ShoePartKey — hover highlights, click selects, colours come live from
 * the studio store. Swap `buildShoe()` for a GLTF later and keep the keys.
 */

import { useMemo } from "react";
import { useCursor, Outlines } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useStudio } from "./store";
import { buildShoe, SHOE_LIFT } from "./shoe-geometry";
import type { ShoePartKey } from "@/data/shoe";

/** Material feel per part — leather panels, waxy laces, rubber soles. */
const ROUGHNESS: Partial<Record<ShoePartKey, number>> = {
  laces: 0.8,
  tongue: 0.62,
  midsole: 0.5,
  outsole: 0.68,
  sideMark: 0.44,
};

export function ShoeModel() {
  const parts = useMemo(() => buildShoe(), []);
  const colors = useStudio((s) => s.colors);
  const selected = useStudio((s) => s.selected);
  const hovered = useStudio((s) => s.hovered);
  const select = useStudio((s) => s.select);
  const hover = useStudio((s) => s.hover);

  useCursor(hovered !== null);

  const over = (key: ShoePartKey) => (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    hover(key);
  };
  const out = (key: ShoePartKey) => () => {
    // only clear if we're still the hovered part (avoids flicker between parts)
    if (useStudio.getState().hovered === key) hover(null);
  };
  const click = (key: ShoePartKey) => (e: ThreeEvent<MouseEvent>) => {
    // ignore "clicks" that were actually orbit drags
    if (e.delta > 5) return;
    e.stopPropagation();
    select(key);
  };

  return (
    <group position={[0, SHOE_LIFT, 0]}>
      {/* dark ankle-opening inset — pure illusion so the top reads open;
          not paintable, clicks pass through */}
      <mesh
        position={[-0.44, 0.61, 0]}
        rotation={[0, 0, -0.24]}
        scale={[0.56, 0.08, 0.2]}
        raycast={() => null}
      >
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial color="#332e24" roughness={0.95} />
      </mesh>
      {parts.map(({ key, geometries }) => {
        const isSelected = selected === key;
        const isHovered = hovered === key;
        return (
          <group
            key={key}
            name={key}
            onPointerOver={over(key)}
            onPointerOut={out(key)}
            onClick={click(key)}
          >
            {geometries.map((geo, i) => (
              <mesh key={i} geometry={geo} castShadow receiveShadow>
                <meshStandardMaterial
                  color={colors[key]}
                  roughness={ROUGHNESS[key] ?? 0.52}
                  metalness={0}
                  envMapIntensity={0.65}
                  emissive="#8f9b82"
                  emissiveIntensity={isHovered ? 0.16 : isSelected ? 0.07 : 0}
                />
                {isSelected && (
                  <Outlines thickness={0.018} color="#5f6f52" transparent opacity={0.85} />
                )}
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}
