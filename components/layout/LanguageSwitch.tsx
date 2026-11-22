"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { localeNames, localePath, locales, localeShort, rememberLocale, splitLocale, type Locale } from "@/lib/i18n";

/** Go to the same page in another language, remembering the choice first. */
export function switchLanguage(target: Locale, path: string) {
  rememberLocale(target);
  window.location.assign(localePath(target, path) + window.location.search + window.location.hash);
}

/**
 * EN | RO: the current language highlighted, the other one a link to the same
 * page in that language. A full page load on purpose: the whole tree, from
 * <html lang> down, belongs to one language.
 */
export function LanguageSwitch({ locale, label, className }: { locale: Locale; label: string; className?: string }) {
  // usePathname may hold the internal /en/… path on the server: splitLocale handles both
  const { path } = splitLocale(usePathname() || "/");
  return (
    <div role="group" aria-label={label} className={cn("vibe-glass flex items-center rounded-full p-1", className)}>
      {locales.map((l) =>
        l === locale ? (
          <span
            key={l}
            aria-current="true"
            lang={l}
            title={localeNames[l]}
            className="grid h-9 min-w-9 place-items-center rounded-full bg-(--vibe-tint) px-2.5 text-sm font-medium text-(--vibe-ink)"
          >
            <span aria-hidden>{localeShort[l]}</span>
            <span className="sr-only">{localeNames[l]}</span>
          </span>
        ) : (
          <a
            key={l}
            href={localePath(l, path)}
            hrefLang={l}
            lang={l}
            title={localeNames[l]}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
              e.preventDefault();
              switchLanguage(l, path);
            }}
            // 44px tall tap target around the 36px pill
            className="relative grid h-9 min-w-9 place-items-center rounded-full px-2.5 text-sm text-(--vibe-ink)/70 transition-colors before:absolute before:-inset-y-1 before:inset-x-0 hover:text-(--vibe-ink)"
          >
            <span aria-hidden>{localeShort[l]}</span>
            <span className="sr-only">{localeNames[l]}</span>
          </a>
        ),
      )}
    </div>
  );
}
