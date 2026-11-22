"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  browserPrefersRomanian,
  localeNames,
  readLocaleCookie,
  rememberLocale,
  splitLocale,
  type Locale,
} from "@/lib/i18n";
import { switchLanguage } from "./LanguageSwitch";

/**
 * First visit only: a small card at the bottom, in both languages, with two
 * big buttons. The language the browser prefers comes first. Choosing (or
 * closing the card) is remembered, so it never shows again; the EN | RO
 * switch in the header is there for later changes.
 *
 * Never blocks the page, never steals focus, and search engines (which keep
 * no cookies) just see the page as it is.
 */
export function LanguagePrompt({ locale }: { locale: Locale }) {
  const { path } = splitLocale(usePathname() || "/");
  const [state, setState] = useState<"hidden" | "shown" | "leaving">("hidden");
  const [order, setOrder] = useState<Locale[]>(["en", "ro"]);
  const leaveTimer = useRef<number | undefined>(undefined);
  const privateArea = path.startsWith("/design-lab");

  useEffect(() => {
    if (privateArea || readLocaleCookie()) return;
    // a beat after load, so it doesn't fight the page for attention
    const t = window.setTimeout(() => {
      setOrder(browserPrefersRomanian() ? ["ro", "en"] : ["en", "ro"]);
      setState("shown");
    }, 900);
    return () => window.clearTimeout(t);
  }, [privateArea]);
  useEffect(() => () => window.clearTimeout(leaveTimer.current), []);

  if (state === "hidden") return null;

  const close = () => {
    rememberLocale(locale);
    setState("leaving");
    leaveTimer.current = window.setTimeout(() => setState("hidden"), 250);
  };
  const choose = (l: Locale) => (l === locale ? close() : switchLanguage(l, path));

  return (
    <section
      aria-label="Language · Limba"
      className={cn(
        "fixed inset-x-0 z-[60] px-4 transition-[opacity,translate] duration-300 ease-out motion-reduce:transition-none",
        "bottom-[max(1rem,env(safe-area-inset-bottom))]",
        state === "shown" ? "translate-y-0 opacity-100 starting:translate-y-4 starting:opacity-0" : "translate-y-4 opacity-0",
      )}
    >
      <div className="glass relative mx-auto max-w-sm rounded-blob p-5 pr-12 shadow-lift">
        <p className="eyebrow text-gold-ink">
          <span lang="en">Language</span> · <span lang="ro">Limba</span>
        </p>
        <p className="mt-1.5 text-[0.95rem] leading-snug text-cream">
          <span lang="en" className="block">Which language do you prefer?</span>
          <span lang="ro" className="block text-cream-2">Ce limbă preferi?</span>
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {order.map((l, i) => (
            <button
              key={l}
              type="button"
              lang={l}
              onClick={() => choose(l)}
              className={cn(
                "min-h-11 rounded-full px-4 text-[0.95rem] font-medium transition-colors",
                i === 0
                  ? "bg-olive text-paper shadow-[0_10px_30px_-14px_rgba(47,58,47,0.7)] hover:bg-deep"
                  : "border border-olive/35 text-deep hover:border-olive hover:bg-olive/5",
              )}
            >
              {localeNames[l]}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs leading-snug text-muted">
          <span lang="en" className="block">You can switch any time at the top.</span>
          <span lang="ro" className="block">Poți schimba oricând, sus.</span>
        </p>
        <button
          type="button"
          onClick={close}
          aria-label="Close · Închide"
          className="absolute top-2 right-2 grid size-11 place-items-center rounded-full text-lg text-muted transition-colors hover:text-cream"
        >
          <span aria-hidden>×</span>
        </button>
      </div>
    </section>
  );
}
