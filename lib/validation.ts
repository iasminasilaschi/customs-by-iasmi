import { z } from "zod";

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

export const inquirySchema = z
  .object({
    name: z.string().min(2, "Tell me your name — even just a first name."),
    email: z.email("I need a real email to reply to."),
    phone: z.string().optional(),
    instagram: z.string().optional(),
    projectType: z.enum(["sneakers", "cap", "collab", "other"]),

    // sneakers
    baseShoe: z.string().optional(),
    shoeSize: z.string().optional(),
    hasShoes: z.enum(["yes", "no", "unsure"]).optional(),

    // graduation cap
    graduationDate: z.string().optional(),
    capTheme: z.string().optional(),
    schoolColors: z.string().optional(),
    capNameYear: z.string().optional(),
    hasCap: z.enum(["yes", "no"]).optional(),

    // shared
    budget: z.string().optional(),
    deadline: z.string().optional(),
    idea: z
      .string()
      .min(10, "Give me a little more — even two sentences about the vibe help."),
  })
  .superRefine((data, ctx) => {
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
        message: "The big day matters — caps are painted around deadlines.",
      });
    }
  });

export type InquiryValues = z.infer<typeof inquirySchema>;
