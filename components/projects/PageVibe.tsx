"use client";

import { useEffect } from "react";
import type { VibePalette } from "@/data/media";
import { applyRootVibe, clearRootVibe } from "@/lib/vibe";

/** Gives the nav the pair's colours while its project page is open. */
export function PageVibe({ vibe }: { vibe: VibePalette }) {
  // a passive effect: it runs after the homepage hero has cleaned up its own
  useEffect(() => {
    applyRootVibe(vibe);
    return clearRootVibe;
  }, [vibe]);
  return null;
}
