import { z } from "zod";

// Zod 4 probes `new Function` to speed up parsing; under the site's CSP that
// probe is refused (and reported). Parsing works the same without it.
z.config({ jitless: true });

/**
 * One smart inquiry schema for all commission types. Conditional
 * requirements stay gentle on purpose — the form should feel like a
 * conversation starter, not a tax return.
 */

export const projectTypes = [
  { value: "sneakers", label: "Custom sneakers" },
  { value: "cap", label: "Custom graduation cap" },
  { value: "collab", label: "Collaboration" },
  { value: "other", label: "Other creative idea" },
] as const;

export type ProjectType = (typeof projectTypes)[number]["value"];

/** Field limits, shared with the form (counter, maxLength). */
export const LIMITS = { idea: 1500, short: 120, phone: 40 } as const;

const tooLong = (max: number) => `Keep this under ${max} characters, please.`;
/** An optional single-line answer: trimmed, capped. */
const short = (max: number = LIMITS.short) =>
  z.string().trim().max(max, tooLong(max)).optional();

/** "@handle", "handle" or an instagram.com/handle link — loosely. */
const INSTAGRAM = /^(?:@?|(?:https?:\/\/)?(?:www\.)?instagram\.com\/)[A-Za-z0-9._]{1,30}\/?$/;

export const inquirySchema = z
  .object({
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
    phone: short(LIMITS.phone),
    instagram: z
      .string()
      .trim()
      .max(LIMITS.short, tooLong(LIMITS.short))
      .refine((v) => v === "" || INSTAGRAM.test(v), "That doesn't look like an Instagram handle, e.g. @yourname.")
      .optional(),
    projectType: z.enum(["sneakers", "cap", "collab", "other"]),

    // sneakers
    baseShoe: short(),
    shoeSize: short(),
    hasShoes: z.enum(["yes", "no", "unsure", ""]).optional(),

    // graduation cap
    graduationDate: short(),
    capTheme: short(),
    schoolColors: short(),
    capNameYear: short(),
    hasCap: z.enum(["yes", "no", ""]).optional(),

    // shared
    budget: short(),
    deadline: short(),
    idea: z
      .string()
      .trim()
      .min(10, "Give me a little more — even two sentences about the vibe help.")
      .max(LIMITS.idea, `That's a lot of love! Keep it under ${LIMITS.idea} characters and send the rest by email.`),
  })
  .superRefine((data, ctx) => {
    if (!data.email?.trim() && !data.phone?.trim() && !data.instagram?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["email"],
        message: "Add at least one way to reach you: email, Instagram or phone.",
      });
    }
    if (data.projectType === "sneakers" && !data.shoeSize?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["shoeSize"],
        message: "Your size helps me quote the right base shoe.",
      });
    }
    if (data.projectType === "cap" && !data.graduationDate?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["graduationDate"],
        message: "The big day matters, caps are painted around deadlines.",
      });
    }
  });

export type InquiryValues = z.infer<typeof inquirySchema>;
