"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import {
  SelectField,
  TextAreaField,
  TextField,
  UploadPlaceholder,
} from "@/components/forms/fields";
import {
  inquirySchema,
  projectTypes,
  type InquiryValues,
  type ProjectType,
} from "@/lib/validation";
import { site } from "@/data/site";

/**
 * The single smart intake form. There is intentionally NO backend yet:
 * submissions are validated client-side, then the user is handed a
 * pre-filled mailto link. Swap `deliver()` for a real API route /
 * Resend integration later (see docs/ROADMAP.md).
 */
export function InquiryForm({
  defaultType = "sneakers",
  initialIdea = "",
  compact = false,
  context,
}: {
  defaultType?: ProjectType;
  initialIdea?: string;
  compact?: boolean;
  /** Live summary from the Design Lab (starter + mood tags), included in the request. */
  context?: string;
}) {
  const [sent, setSent] = useState<InquiryValues | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<InquiryValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { projectType: defaultType, idea: initialIdea },
  });

  const type = useWatch({ control, name: "projectType" });

  function buildMailto(v: InquiryValues) {
    const label = projectTypes.find((t) => t.value === v.projectType)?.label;
    let lines = Object.entries(v)
      .filter(([, val]) => typeof val === "string" && val.trim() !== "")
      .map(([key, val]) => `${key}: ${val}`)
      .join("\n");
    if (context) lines += `\ndesign lab selection: ${context}`;
    const subject = encodeURIComponent(`Commission request — ${label}`);
    const body = encodeURIComponent(`Hi Iasmi!\n\n${lines}\n\n(sent from the Customs by Iasmi site)`);
    return `mailto:${site.email}?subject=${subject}&body=${body}`;
  }

  async function onSubmit(values: InquiryValues) {
    // Simulated delivery: no fake backend, no silent data loss.
    await new Promise((r) => setTimeout(r, 600));
    setSent(values);
  }

  if (sent) {
    return (
      <div className="glass grain rounded-blob p-8 text-center" role="status">
        <p className="hand text-3xl text-lilac">love it already.</p>
        <h3 className="display mt-3 text-2xl text-cream">Your request is ready to send</h3>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
          The studio inbox isn&apos;t wired up yet, so the last step is yours:
          the button below opens a pre-filled email with everything you wrote.
          You can also DM the same idea on Instagram.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button href={buildMailto(sent)}>Open pre-filled email</Button>
          <Button href={site.instagram} variant="outline">
            DM on Instagram
          </Button>
        </div>
        <button
          type="button"
          onClick={() => setSent(null)}
          className="mt-5 text-sm text-muted underline-offset-2 hover:text-cream hover:underline"
        >
          ← edit my request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Name" placeholder="Your name" {...register("name")} error={errors.name?.message} />
        <TextField label="Email" type="email" placeholder="you@example.com" {...register("email")} error={errors.email?.message} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Phone" optional placeholder="+40 ..." {...register("phone")} error={errors.phone?.message} />
        <TextField label="Instagram" optional placeholder="@yourhandle" {...register("instagram")} error={errors.instagram?.message} />
      </div>

      <SelectField
        label="What are we making?"
        options={projectTypes}
        {...register("projectType")}
        error={errors.projectType?.message}
      />

      {type === "sneakers" && (
        <fieldset className="space-y-5 rounded-2xl border border-rose/25 bg-rose/5 p-5">
          <legend className="eyebrow px-2">sneaker details</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="Base shoe"
              optional
              placeholder="e.g. AF1, Old Skool, no idea yet"
              {...register("baseShoe")}
              error={errors.baseShoe?.message}
            />
            <TextField
              label="Shoe size"
              placeholder="EU 38 / US 7.5"
              {...register("shoeSize")}
              error={errors.shoeSize?.message}
            />
          </div>
          <SelectField
            label="Do you already have the shoes?"
            options={[
              { value: "yes", label: "Yes — I'll send my pair" },
              { value: "no", label: "No — please source them" },
              { value: "unsure", label: "Not sure, let's discuss" },
            ]}
            placeholder="Choose one"
            {...register("hasShoes")}
            error={errors.hasShoes?.message}
          />
        </fieldset>
      )}

      {type === "cap" && (
        <fieldset className="space-y-5 rounded-2xl border border-lilac/25 bg-lilac/5 p-5">
          <legend className="eyebrow px-2">graduation cap details</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="Graduation date"
              placeholder="e.g. 12 September 2026"
              {...register("graduationDate")}
              error={errors.graduationDate?.message}
            />
            <TextField
              label="School / university colours"
              optional
              placeholder="e.g. navy & gold"
              {...register("schoolColors")}
              error={errors.schoolColors?.message}
            />
          </div>
          <TextField
            label="Theme, quote or symbols"
            optional
            placeholder="a quote, an inside joke, a dream"
            {...register("capTheme")}
            error={errors.capTheme?.message}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="Name / year on the cap"
              optional
              placeholder="e.g. Ana · 2026"
              {...register("capNameYear")}
              error={errors.capNameYear?.message}
            />
            <SelectField
              label="Do you already have the cap?"
              options={[
                { value: "yes", label: "Yes, I have it" },
                { value: "no", label: "No — let's figure it out" },
              ]}
              placeholder="Choose one"
              {...register("hasCap")}
              error={errors.hasCap?.message}
            />
          </div>
        </fieldset>
      )}

      {type === "web" && (
        <fieldset className="space-y-5 rounded-2xl border border-gold/25 bg-gold/5 p-5">
          <legend className="eyebrow px-2">website / digital details</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="Business / project name"
              optional
              placeholder="what's it called?"
              {...register("projectName")}
              error={errors.projectName?.message}
            />
            <TextField
              label="Type of website / app"
              optional
              placeholder="portfolio, landing page, tiny app…"
              {...register("siteType")}
              error={errors.siteType?.message}
            />
          </div>
          <TextField
            label="Main goal"
            optional
            placeholder="what should it do for you?"
            {...register("goal")}
            error={errors.goal?.message}
          />
          <SelectField
            label="Do you already have content (text, photos, logo)?"
            options={[
              { value: "yes", label: "Yes, mostly ready" },
              { value: "partly", label: "Some of it" },
              { value: "no", label: "Starting from zero" },
            ]}
            placeholder="Choose one"
            {...register("hasContent")}
            error={errors.hasContent?.message}
          />
          <p className="text-sm leading-relaxed text-muted">
            Honest note: this side of the studio is young — small, personal
            projects built in collaboration, not agency work. If that sounds
            right, I&apos;d love to hear the idea.
          </p>
        </fieldset>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Budget range"
          optional
          placeholder="e.g. €150–250"
          hint="Rough ranges are fine — it helps me suggest the right scope."
          {...register("budget")}
          error={errors.budget?.message}
        />
        <TextField
          label="Deadline"
          optional
          placeholder="a date, an event, or 'no rush'"
          {...register("deadline")}
          error={errors.deadline?.message}
        />
      </div>

      {context && (
        <p className="rounded-xl border border-lilac/25 bg-lilac/5 px-4 py-3 text-sm text-lilac">
          ✦ attached from the Design Lab: {context}
        </p>
      )}

      <TextAreaField
        label="Your idea"
        placeholder="The mood, the story, the colours, the obsession. References welcome — songs and films count."
        rows={compact ? 4 : 6}
        {...register("idea")}
        error={errors.idea?.message}
      />

      <UploadPlaceholder />

      <div className="pt-1">
        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? "Preparing…" : "Request a custom concept"}
        </Button>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          This is a hand-painted commission — any preview is a concept, not the
          final result. The final piece is handmade, textured, and alive.
        </p>
      </div>
    </form>
  );
}
