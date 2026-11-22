/**
 * Languages: English (the default, at the plain URLs) and Romanian (under
 * /ro). Safe to import anywhere, client or server.
 *
 * URLs: /projects is English, /ro/projects is Romanian. Internally every
 * page lives in app/[lang]/; proxy.ts rewrites the plain URLs to /en/… so
 * English links never change.
 */

export const locales = ["en", "ro"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/** Remembers a visitor's choice (set by the language card / switch). */
export const LOCALE_COOKIE = "lang";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const hasLocale = (value: string | undefined | null): value is Locale =>
  !!value && (locales as readonly string[]).includes(value);

/** Names shown in the switcher, each in its own language. */
export const localeNames: Record<Locale, string> = { en: "English", ro: "Română" };
export const localeShort: Record<Locale, string> = { en: "EN", ro: "RO" };
/** Open Graph locale codes. */
export const ogLocale: Record<Locale, string> = { en: "en_GB", ro: "ro_RO" };

/** "/projects" → "/projects" (en) or "/ro/projects" (ro). Keeps ?query and #hash. */
export function localePath(locale: Locale, path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return p;
  if (p === "/") return `/${locale}`;
  if (p.startsWith("/?") || p.startsWith("/#")) return `/${locale}${p.slice(1)}`;
  return `/${locale}${p}`;
}

/** "/ro/projects" → { locale: "ro", path: "/projects" }; "/about" → { locale: "en", path: "/about" }. */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  const [, first, ...rest] = pathname.split("/");
  if (hasLocale(first) && first !== defaultLocale) {
    return { locale: first, path: `/${rest.join("/")}` };
  }
  if (first === defaultLocale) return { locale: defaultLocale, path: `/${rest.join("/")}` };
  return { locale: defaultLocale, path: pathname || "/" };
}

/** Remember the choice for a year (functional cookie, no tracking). */
export function rememberLocale(locale: Locale) {
  try {
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
  } catch {
    // cookies blocked: the choice just isn't remembered
  }
}

export function readLocaleCookie(): Locale | null {
  try {
    const m = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`));
    const v = m?.[1];
    return hasLocale(v) ? v : null;
  } catch {
    return null;
  }
}

/** Does this browser prefer Romanian? */
export function browserPrefersRomanian(): boolean {
  try {
    const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
    return langs.some((l) => l?.toLowerCase().startsWith("ro"));
  } catch {
    return false;
  }
}
