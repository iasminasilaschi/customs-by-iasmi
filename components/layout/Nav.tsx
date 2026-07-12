"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navLinks } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-[90rem] items-center justify-between px-4 py-5 sm:px-6 lg:px-12 xl:px-20">
        <Link
          href="/"
          className="glass group flex items-baseline gap-1.5 rounded-full px-5 py-2.5 text-cream transition-colors hover:text-olive"
        >
          <span className="hand text-lg leading-none text-sage transition-colors group-hover:text-olive">
            customs by
          </span>
          <span className="display text-xl leading-none tracking-tight">Iasmi</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-2.5 md:flex">
          <div className="glass flex items-center gap-1 rounded-full p-1.5">
            {navLinks.map((l) => {
              const active = pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-full px-4 py-2.5 text-[0.95rem] transition-colors lg:text-base",
                    active ? "bg-olive/12 text-deep" : "text-cream/70 hover:text-deep",
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
          <Button href="/design-lab" className="ml-1">
            Start a commission
          </Button>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="glass flex h-11 w-11 items-center justify-center rounded-full text-cream md:hidden"
        >
          <span aria-hidden className="relative block h-3 w-4">
            <span
              className={cn(
                "absolute left-0 top-0 h-px w-full bg-current transition-transform duration-300",
                open && "top-1.5 rotate-45",
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-1.5 h-px w-full bg-current transition-opacity duration-300",
                open && "opacity-0",
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-3 h-px w-full bg-current transition-transform duration-300",
                open && "top-1.5 -rotate-45",
              )}
            />
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          "mx-4 overflow-hidden rounded-blob transition-all duration-300 md:hidden",
          open ? "max-h-[26rem] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav aria-label="Mobile" className="glass rounded-blob p-4">
          <ul className="flex flex-col">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-3 text-lg text-cream/85 transition-colors hover:bg-olive/8 hover:text-deep"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button href="/design-lab" className="mt-3 w-full">
            Start a commission
          </Button>
        </nav>
      </div>
    </header>
  );
}
