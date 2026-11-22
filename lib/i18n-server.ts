import { lang } from "next/root-params";
import { defaultLocale, hasLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";

/**
 * The page's language, from the [lang] segment above the root layout
 * (next/root-params): any Server Component can ask, no prop drilling.
 * Server-only: next/root-params fails the build if a Client Component imports it.
 */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  return hasLocale(value) ? value : defaultLocale;
}

/** Language + its interface strings, for Server Components. */
export async function getI18n() {
  const locale = await getLocale();
  return { locale, t: getDictionary(locale) };
}
