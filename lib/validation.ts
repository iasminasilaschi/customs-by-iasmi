import { z } from "zod";
import { en, type Dictionary } from "@/lib/dictionaries/en";
import { fmt } from "@/lib/i18n-format";
import { locales } from "@/lib/i18n";

// Zod 4 probes `new Function` to speed up parsing; under the site's CSP that
// probe is refused (and reported). Parsing works the same without it.
z.config({ jitless: true });

/**
 * The contact form's schema, shared by the browser (instant feedback) and
 * the /api/contact route (the real check). Short and friendly on purpose.
 * Messages come in the visitor's language (makeContactSchema); the form
 * sends its `lang`, so the server answers in the same one.
 */

export const paintChoices = ["sneakers", "cap", "other"] as const;
export type PaintChoice = (typeof paintChoices)[number];

/** English label, for the email I get (labels on the form come from the dictionary). */
export function paintLabel(value: PaintChoice): string {
  return en.form.paint[value]?.label ?? value;
}

/** Field limits, shared with the form (counter, maxLength). */
export const LIMITS = { short: 120, idea: 1500, link: 300, ref: 80 } as const;


/** "@handle", "handle" or an instagram.com/handle link — loosely. */
export const INSTAGRAM = /^(?:@?|(?:https?:\/\/)?(?:www\.)?instagram\.com\/)([A-Za-z0-9._]{1,30})\/?$/;
/** A web link, with or without https:// (e.g. pinterest.com/pin/123). */
export const LINK = /^(?:https?:\/\/)?(?:[\w-]+\.)+[a-z]{2,}(?:[/?#]\S*)?$/i;

export function makeContactSchema(m: Dictionary["validation"] = en.validation) {
  const tooLong = (max: number) => fmt(m.tooLong, { max });
  return z
  .object({
    paint: z.enum(paintChoices),
    idea: z
      .string()
      .trim()
      .min(10, m.ideaShort)
      .max(LIMITS.idea, fmt(m.ideaLong, { max: LIMITS.idea })),
    inspo: z
      .string()
      .trim()
      .max(LIMITS.link, tooLong(LIMITS.link))
      .refine((v) => v === "" || LINK.test(v), m.inspo)
      .optional(),
    name: z
      .string()
      .trim()
      .min(2, m.name)
      .max(LIMITS.short, tooLong(LIMITS.short)),
    email: z
      .string()
      .trim()
      .max(LIMITS.short, tooLong(LIMITS.short))
      .pipe(z.union([z.literal(""), z.email(m.email)]))
      .optional(),
    instagram: z
      .string()
      .trim()
      .max(LIMITS.short, tooLong(LIMITS.short))
      .refine((v) => v === "" || INSTAGRAM.test(v), m.instagram)
      .optional(),
    /** The project slug from a "dream up one like this" link (?ref=…). */
    ref: z
      .string()
      .trim()
      .max(LIMITS.ref)
      .regex(/^[a-z0-9-]*$/)
      .optional(),
    /** The page's language: the server answers (and I reply) in it. */
    lang: z.enum(locales).optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.email && !data.instagram) {
      ctx.addIssue({
        code: "custom",
        path: ["email"],
        message: m.needContact,
      });
    }
  });
}

/** The English schema (the type source). */
export const contactSchema = makeContactSchema();
export type ContactValues = z.infer<typeof contactSchema>;

/** "@name", "name" or an instagram.com link → "name". */
export function instagramHandle(value: string): string {
  return value.match(INSTAGRAM)?.[1] ?? value.replace(/^@/, "");
}
