"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navLinks } from "@/data/site";
import type { Dictionary } from "@/lib/dictionaries";
import { localePath, splitLocale, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { LanguageSwitch } from "./LanguageSwitch";

export function Nav({ locale, t }: { locale: Locale; t: Dictionary["nav"] }) {
  // the language-neutral path: "/ro/projects" and "/projects" are both "/projects"
  const { path: pathname } = splitLocale(usePathname() || "/");
  const privateArea = pathname.startsWith("/design-lab");
  const links = navLinks.map((l) => ({ href: localePath(locale, l.href), path: l.href, label: t[l.key] }));
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  // Escape closes the open menu and puts focus back on the toggle
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggle.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)]">
      <div className="gutter mx-auto flex max-w-[90rem] items-center justify-between py-5">
        <Link
          href={localePath(locale, "/")}
          className="vibe-glass group flex items-baseline gap-1.5 rounded-full px-5 py-2.5 text-(--vibe-ink) transition-colors hover:text-(--vibe-accent)"
        >
          <span className="hand text-lg leading-none text-(--vibe-muted) transition-colors group-hover:text-(--vibe-accent)">
            customs by
          </span>
          <span className="hand text-[1.4rem] leading-none">Iasmi</span>
        </Link>

        <nav aria-label={t.main} className="hidden items-center gap-2.5 lg:flex">
          <div className="vibe-glass flex items-center gap-1 rounded-full p-1.5">
            {links.map((l) => {
              const active = pathname === l.path || (l.path !== "/" && pathname.startsWith(l.path + "/"));
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-full px-4 py-2.5 text-[0.95rem] transition-colors lg:text-base",
                    active ? "bg-(--vibe-tint) text-(--vibe-ink)" : "text-(--vibe-ink)/70 hover:text-(--vibe-ink)",
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
          {!privateArea && <LanguageSwitch locale={locale} label={t.language} />}
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
        {!privateArea && <LanguageSwitch locale={locale} label={t.language} />}
        <button
          ref={toggle}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? t.closeMenu : t.openMenu}
          className="vibe-glass grid size-11 place-items-center rounded-full text-(--vibe-ink) lg:hidden"
        >
          {/*
            All three lines sit on the exact centre of the button and only move
            with translate/rotate, so the X turns around that centre: the
            hamburger's outer lines slide 6px up/down from it, the X is the
            same two lines rotated in place (a touch longer, so it carries the
            same weight as the three lines).
          */}
          <span aria-hidden className="relative block size-5">
            <span
              className={cn(
                "absolute inset-x-0.5 top-1/2 -mt-[0.75px] h-[1.5px] rounded-full bg-current transition-[translate,rotate,scale] duration-300 ease-out",
                open ? "rotate-45 scale-x-[1.15]" : "-translate-y-1.5",
              )}
            />
            <span
              className={cn(
                "absolute inset-x-0.5 top-1/2 -mt-[0.75px] h-[1.5px] rounded-full bg-current transition-[opacity,scale] duration-300 ease-out",
                open && "scale-x-0 opacity-0",
              )}
            />
            <span
              className={cn(
                "absolute inset-x-0.5 top-1/2 -mt-[0.75px] h-[1.5px] rounded-full bg-current transition-[translate,rotate,scale] duration-300 ease-out",
                open ? "-rotate-45 scale-x-[1.15]" : "translate-y-1.5",
              )}
            />
          </span>
        </button>
        </div>
      </div>

      {/* Mobile menu (lined up with the bar above by the same gutter) */}
      <div className="gutter lg:hidden">
        <div
          id="mobile-menu"
          // closed: invisible, so also out of the tab order and the accessibility tree
          inert={!open}
          className={cn(
            "overflow-hidden rounded-blob transition-all duration-300",
            open ? "max-h-[26rem] opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <nav aria-label={t.mobile} className="vibe-glass rounded-blob p-4">
            <ul className="flex flex-col">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-3 text-lg text-(--vibe-ink)/85 transition-colors hover:bg-(--vibe-tint) hover:text-(--vibe-ink)"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
