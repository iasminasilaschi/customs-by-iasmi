"use client";

/**
 * The paintable sneaker — the licensed GLB from public/models, one mesh
 * per piece, each tagged with its ShoePartKey (see model-parts.ts). Hover
 * highlights, click selects, colours + finishes come live from the studio
 * store. In "placing" mode a click drops the waiting photo/lettering onto
 * the surface instead of selecting.
 */

import { useMemo } from "react";
import * as THREE from "three";
import { useCursor, useGLTF, Outlines } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { finishes, type ShoePartKey } from "@/data/shoe";
import { useStudio } from "./store";
import { ARTWORK_PARTS, MODEL_URL } from "./model-parts";
import { ShoeDecal } from "./DecalLayer";

interface Piece {
  name: string;
  part: ShoePartKey;
  geometry: THREE.BufferGeometry;
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  scale: THREE.Vector3;
  normalMap: THREE.Texture | null;
}

export function ShoeModel() {
  // meshopt decoder is bundled; no Draco (avoids a CDN decoder fetch)
  const { scene } = useGLTF(MODEL_URL, false);
  const pieces = useMemo(() => {
    const out: Piece[] = [];
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh || !m.userData.part) return;
      out.push({
        name: m.name,
        part: m.userData.part as ShoePartKey,
        geometry: m.geometry,
        position: m.position,
        quaternion: m.quaternion,
        scale: m.scale,
        normalMap: (m.material as THREE.MeshStandardMaterial).normalMap ?? null,
      });
    });
    return out;
  }, [scene]);

  const colors = useStudio((s) => s.colors);
  const finish = useStudio((s) => s.finish);
  const artwork = useStudio((s) => s.artwork);
  const selected = useStudio((s) => s.selected);
  const hovered = useStudio((s) => s.hovered);
  const placing = useStudio((s) => s.placing);
  const select = useStudio((s) => s.select);
  const hover = useStudio((s) => s.hover);
  const placeArtwork = useStudio((s) => s.placeArtwork);

  const canPlaceHere = hovered !== null && ARTWORK_PARTS.has(hovered);
  useCursor(hovered !== null, placing ? (canPlaceHere ? "crosshair" : "not-allowed") : "pointer");

  const over = (key: ShoePartKey) => (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    hover(key);
  };
  const out = (key: ShoePartKey) => () => {
    // only clear if we're still the hovered part (avoids flicker between parts)
    if (useStudio.getState().hovered === key) hover(null);
  };
  const click = (piece: Piece) => (e: ThreeEvent<MouseEvent>) => {
    // ignore "clicks" that were actually orbit drags
    if (e.delta > 5) return;
    e.stopPropagation();
    const waiting = useStudio.getState().placing;
    if (!waiting) {
      select(piece.part);
      return;
    }
    if (!ARTWORK_PARTS.has(piece.part) || !e.face) return;
    // anchor in the mesh's local space; face normals are local already —
    // flip it if we hit the back of a double-sided face
    const point = e.object.worldToLocal(e.point.clone());
    const normal = e.face.normal.clone();
    const worldNormal = normal.clone().transformDirection(e.object.matrixWorld);
    if (worldNormal.dot(e.ray.direction) > 0) normal.negate();
    placeArtwork(waiting, piece.name, piece.part, point.toArray(), normal.toArray());
  };

  return (
    <group>
      {pieces.map((piece) => {
        const { part } = piece;
        const isSelected = selected === part && !placing;
        const isHovered = hovered === part && (!placing || ARTWORK_PARTS.has(part));
        const f = finishes[finish[part]];
        return (
          <mesh
            key={piece.name}
            name={piece.name}
            geometry={piece.geometry}
            position={piece.position}
            quaternion={piece.quaternion}
            scale={piece.scale}
            castShadow
            receiveShadow
            onPointerOver={over(part)}
            onPointerOut={out(part)}
            onClick={click(piece)}
          >
            <meshPhysicalMaterial
              color={colors[part]}
              roughness={f.roughness}
              metalness={f.metalness}
              clearcoat={f.clearcoat}
              clearcoatRoughness={0.3}
              normalMap={piece.normalMap}
              envMapIntensity={0.8}
              side={THREE.DoubleSide}
              emissive="#8f9b82"
              emissiveIntensity={isHovered ? 0.16 : isSelected ? 0.07 : 0}
            />
            {isSelected && (
              <Outlines angle={0} thickness={0.01} color="#5f6f52" transparent opacity={0.85} />
            )}
            {artwork
              .filter((a) => a.mesh === piece.name)
              .map((a) => (
                <ShoeDecal key={a.id} art={a} meshScale={piece.scale.x} />
              ))}
          </mesh>
        );
      })}
    </group>
  );
}

useGLTF.preload(MODEL_URL, false);
