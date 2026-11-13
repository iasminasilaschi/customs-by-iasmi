"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";

/** Accessible accordion built on buttons + aria; one item open at a time. */
export function Accordion({
  items,
}: {
  items: Array<{ question: string; answer: string }>;
}) {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();

  return (
    <div className="divide-y divide-line rounded-blob border border-line bg-coal">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={`${id}-${i}`}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-cream/[0.03]"
            >
              <span className={cn("text-lg font-medium transition-colors lg:text-xl", isOpen ? "text-brown-ink" : "text-cream")}>
                {item.question}
              </span>
              <span
                aria-hidden
                className={cn(
                  "shrink-0 text-lg text-muted transition-transform duration-300",
                  isOpen && "rotate-45 text-rose-2",
                )}
              >
                +
              </span>
            </button>
            <div
              id={`${id}-${i}`}
              // collapsed answers stay in the DOM for the animation, but not for screen readers
              inert={!isOpen}
              className={cn(
                "grid transition-all duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-6 text-base leading-relaxed text-muted">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
