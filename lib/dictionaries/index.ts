import type { Locale } from "@/lib/i18n";
import { en, type Dictionary } from "./en";
import { ro } from "./ro";

export type { Dictionary };

const dictionaries: Record<Locale, Dictionary> = { en, ro };

/** The interface strings for a language. Plain objects: safe to pass to client components. */
export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];
