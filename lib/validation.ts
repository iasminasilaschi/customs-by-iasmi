import { z } from "zod";

// Zod 4 probes `new Function` to speed up parsing; under the site's CSP that
// probe is refused (and reported). Parsing works the same without it.
z.config({ jitless: true });

/**
 * The contact form's schema, shared by the browser (instant feedback) and
 * the /api/contact route (the real check). Short and friendly on purpose.
 */

export const paintOptions = [
  { value: "sneakers", label: "Sneakers", blurb: "a pair of shoes, painted by hand" },
  { value: "cap", label: "A graduation cap", blurb: "a small canvas for a big day" },
  { value: "other", label: "Something else", blurb: "surprise me with the idea" },
] as const;

export type PaintChoice = (typeof paintOptions)[number]["value"];

export function paintLabel(value: PaintChoice): string {
  return paintOptions.find((o) => o.value === value)?.label ?? value;
}

/** Field limits, shared with the form (counter, maxLength). */
export const LIMITS = { short: 120, idea: 1500, link: 300, ref: 80 } as const;

const tooLong = (max: number) => `Keep this under ${max} characters, please.`;

/** "@handle", "handle" or an instagram.com/handle link — loosely. */
export const INSTAGRAM = /^(?:@?|(?:https?:\/\/)?(?:www\.)?instagram\.com\/)([A-Za-z0-9._]{1,30})\/?$/;
/** A web link, with or without https:// (e.g. pinterest.com/pin/123). */
export const LINK = /^(?:https?:\/\/)?(?:[\w-]+\.)+[a-z]{2,}(?:[/?#]\S*)?$/i;

export const contactSchema = z
  .object({
    paint: z.enum(["sneakers", "cap", "other"]),
    idea: z
      .string()
      .trim()
      .min(10, "Give me a little more, even two sentences about the vibe help.")
      .max(LIMITS.idea, `That's a lot of love! Keep it under ${LIMITS.idea} characters and send the rest by email.`),
    inspo: z
      .string()
      .trim()
      .max(LIMITS.link, tooLong(LIMITS.link))
      .refine((v) => v === "" || LINK.test(v), "That doesn't look like a link, e.g. pinterest.com/…")
      .optional(),
    name: z
      .string()
      .trim()
      .min(2, "Tell me your name, even just a first name.")
      .max(LIMITS.short, tooLong(LIMITS.short)),
    email: z
      .string()
      .trim()
      .max(LIMITS.short, tooLong(LIMITS.short))
      .pipe(z.union([z.literal(""), z.email("That email doesn't look right.")]))
      .optional(),
    instagram: z
      .string()
      .trim()
      .max(LIMITS.short, tooLong(LIMITS.short))
      .refine((v) => v === "" || INSTAGRAM.test(v), "That doesn't look like an Instagram handle, e.g. @yourname.")
      .optional(),
    /** The project slug from a "dream up one like this" link (?ref=…). */
    ref: z
      .string()
      .trim()
      .max(LIMITS.ref)
      .regex(/^[a-z0-9-]*$/)
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.email && !data.instagram) {
      ctx.addIssue({
        code: "custom",
        path: ["email"],
        message: "Add an email or your Instagram, so I can write back.",
      });
    }
  });

export type ContactValues = z.infer<typeof contactSchema>;

/** "@name", "name" or an instagram.com link → "name". */
export function instagramHandle(value: string): string {
  return value.match(INSTAGRAM)?.[1] ?? value.replace(/^@/, "");
}
