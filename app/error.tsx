"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="gutter flex min-h-[70vh] flex-col items-center justify-center pt-24 text-center">
      <p className="hand rotate-[-2deg] text-3xl text-lilac">oops — paint everywhere</p>
      <h1 className="display mt-4 text-[clamp(2.5rem,1.5rem+3.4vw,4.25rem)]">
        Something{" "}
        <span className="display-italic text-rose-2">smudged.</span>
      </h1>
      <p className="mt-4 max-w-sm text-sm text-muted">
        This page tripped over its own brush. Give it another go, or head back
        to the studio. If it keeps happening, tell me and I&apos;ll fix it.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button type="button" onClick={() => retry()}>
          Try again
        </Button>
        <Button href="/" variant="outline">
          Back home
        </Button>
      </div>
    </div>
  );
}
