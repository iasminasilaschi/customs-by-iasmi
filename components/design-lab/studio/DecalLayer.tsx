"use client";

/**
 * Photos and lettering on the shoe — each one a drei <Decal> projected onto
 * its target mesh. Anchor point and normal live in the mesh's local space
 * (see store `Artwork`), so decals stay glued to the part however the shoe
 * moves. The decal mesh ignores raycasts: clicks fall through to the part.
 */

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { Decal } from "@react-three/drei";
import type { Artwork } from "./store";

function useArtTexture(src: string) {
  const texture = useMemo(() => {
    const t = new THREE.TextureLoader().load(src);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, [src]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

export function ShoeDecal({ art, meshScale }: { art: Artwork; meshScale: number }) {
  const texture = useArtTexture(art.src);

  const { rotation, scale } = useMemo(() => {
    const o = new THREE.Object3D();
    const n = new THREE.Vector3().fromArray(art.normal);
    // on up-facing surfaces (tongue, top of the toe) "up" can't be world-Y:
    // point the image's top towards the toe instead
    if (Math.abs(n.y) > 0.9) o.up.set(1, 0, 0);
    o.position.fromArray(art.point);
    o.lookAt(o.position.clone().add(n));
    o.rotateZ(THREE.MathUtils.degToRad(-art.angle));
    // size is in scene units; the decal box lives in the mesh's local units
    const w = art.size / meshScale;
    const h = w * art.aspect;
    return {
      rotation: [o.rotation.x, o.rotation.y, o.rotation.z] as [number, number, number],
      // shallow projection box — deep enough for the curve, not the far wall
      scale: [w, h, Math.max(w, h) * 0.5] as [number, number, number],
    };
  }, [art.point, art.normal, art.angle, art.size, art.aspect, meshScale]);

  return (
    <Decal position={art.point} rotation={rotation} scale={scale} raycast={() => null}>
      <meshStandardMaterial
        map={texture}
        transparent
        roughness={0.55}
        polygonOffset
        polygonOffsetFactor={-10}
        depthWrite={false}
      />
    </Decal>
  );
}
