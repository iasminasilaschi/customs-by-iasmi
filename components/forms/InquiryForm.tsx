"use client";

import { useEffect, useRef, useState } from "react";
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
import { cn } from "@/lib/utils";
import { site } from "@/data/site";

/**
 * The single smart intake form, shown one small step at a time so it never
 * feels like a wall of fields. The fun part (what are we making, what's the
 * idea) comes first; contact details come last. Progress is saved in the
 * visitor's browser.
 *
 * There is intentionally NO backend yet: submissions are validated
 * client-side, then the user picks how to send them (pre-filled email
 * or Instagram). Swap `onSubmit` for a real API route later
 * (see docs/ROADMAP.md).
 */

const DRAFT_KEY = "iasmi-inquiry-draft-v1";

const steps = [
  { title: "What are we making?", sub: "Pick the closest one, we can always adjust." },
  { title: "Tell me the idea", sub: "The mood, the story, the colours. Messy is fine." },
  { title: "A few details", sub: "Just what I need to plan it." },
  { title: "How can I reach you?", sub: "Last step. One way is enough." },
] as const;
const LAST = steps.length - 1;

const typeBlurbs: Record<ProjectType, string> = {
  sneakers: "Hand-painted on a pair of shoes",
  cap: "A small square canvas for a big day",
  collab: "Something we make together",
  other: "An idea that doesn't fit a box",
};

function readDraft(): { values?: Partial<InquiryValues>; step?: number } | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function writeDraft(values: Partial<InquiryValues>, step: number) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ values, step }));
  } catch {
    // storage full or blocked: progress just isn't saved
  }
}
function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // nothing to clear
  }
}

export function InquiryForm({
  defaultType = "sneakers",
  typeFromLink = false,
  initialIdea = "",
  compact = false,
  context,
}: {
  defaultType?: ProjectType;
  /** True when the type was picked by a link (e.g. ?type=cap) and should beat a saved draft. */
  typeFromLink?: boolean;
  initialIdea?: string;
  compact?: boolean;
  /** Live summary from the Design Lab (starter + mood tags), included in the request. */
  context?: string;
}) {
  const [sent, setSent] = useState<InquiryValues | null>(null);
  const [step, setStep] = useState(0);
  const hydrated = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const stepChanged = useRef(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    trigger,
    getValues,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<InquiryValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { projectType: defaultType, idea: initialIdea },
  });

  const type = useWatch({ control, name: "projectType" });

  // Restore a saved draft after mount (SSR-safe), then start saving.
  useEffect(() => {
    const draft = readDraft();
    if (draft?.values) {
      reset({
        ...draft.values,
        projectType: typeFromLink ? defaultType : draft.values.projectType ?? defaultType,
        idea: initialIdea || draft.values.idea || "",
      } as InquiryValues);
      if (typeof draft.step === "number" && draft.step >= 0 && draft.step <= LAST) {
        // rehydrating after mount keeps SSR output identical
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStep(draft.step);
      }
    }
    hydrated.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const all = useWatch({ control });
  useEffect(() => {
    if (hydrated.current) writeDraft(all as Partial<InquiryValues>, step);
  }, [all, step]);

  useEffect(() => {
    if (stepChanged.current) headingRef.current?.focus();
    stepChanged.current = true;
  }, [step]);

  async function next() {
    if (step === 1 && !(await trigger("idea"))) return;
    if (step === 2) {
      const v = getValues();
      if (v.projectType === "sneakers" && !v.shoeSize?.trim()) {
        setError("shoeSize", { message: "Your size helps me quote the right base shoe." });
        return;
      }
      if (v.projectType === "cap" && !v.graduationDate?.trim()) {
        setError("graduationDate", { message: "The big day matters, caps are painted around deadlines." });
        return;
      }
    }
    setStep((s) => Math.min(s + 1, LAST));
  }

  function onInvalid(errs: typeof errors) {
    if (errs.idea) setStep(1);
    else if (errs.shoeSize || errs.graduationDate || errs.hasShoes || errs.hasCap) setStep(2);
  }

  function summaryLines(v: InquiryValues) {
    let lines = Object.entries(v)
      .filter(([, val]) => typeof val === "string" && val.trim() !== "")
      .map(([key, val]) => `${key}: ${val}`)
      .join("\n");
    if (context) lines += `\ndesign lab selection: ${context}`;
    return lines;
  }

  function buildMailto(v: InquiryValues) {
    const label = projectTypes.find((t) => t.value === v.projectType)?.label;
    const subject = encodeURIComponent(`Commission request: ${label}`);
    const body = encodeURIComponent(
      `Hi Iasmi!\n\n${summaryLines(v)}\n\n(sent from the Customs by Iasmi site)`,
    );
    return `mailto:${site.email}?subject=${subject}&body=${body}`;
  }

  async function onSubmit(values: InquiryValues) {
    // Simulated delivery: no fake backend, no silent data loss.
    await new Promise((r) => setTimeout(r, 400));
    clearDraft();
    setSent(values);
  }

  if (sent) {
    return (
      <div className="glass grain rounded-blob p-8 text-center" role="status">
        <p className="hand text-3xl text-lilac">love it already.</p>
        <h3 className="display mt-3 text-2xl text-cream">Your request is ready to send</h3>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
          The studio inbox isn&apos;t wired up yet, so the last step is yours.
          Pick whichever is easiest: each button carries everything you wrote.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button href={buildMailto(sent)}>
            Open pre-filled email
          </Button>
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (step < LAST) void next();
        else void handleSubmit(onSubmit, onInvalid)(e);
      }}
      noValidate
      className="space-y-6"
    >
      {/* Progress */}
      <div>
        <div className="flex items-baseline justify-between text-sm text-muted">
          <span>
            Step {step + 1} of {steps.length}
          </span>
          <span>saved as you go</span>
        </div>
        <div
          className="mt-2 flex gap-1.5"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={step + 1}
          aria-label="Form progress"
        >
          {steps.map((s, i) => (
            <span
              key={s.title}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors duration-500",
                i <= step ? "bg-olive" : "bg-line",
              )}
            />
          ))}
        </div>
        <h3
          ref={headingRef}
          tabIndex={-1}
          className="display mt-6 text-2xl text-cream outline-none"
        >
          {steps[step].title}
        </h3>
        <p className="mt-1 text-sm text-muted">{steps[step].sub}</p>
      </div>

      {/* Step 1: what */}
      {step === 0 && (
        <fieldset>
          <legend className="sr-only">What are we making?</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {projectTypes.map((t) => (
              <label
                key={t.value}
                className={cn(
                  "cursor-pointer rounded-2xl border p-4 transition-all duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-olive",
                  type === t.value
                    ? "border-olive bg-olive/10"
                    : "border-line bg-ink/40 hover:border-olive/40",
                )}
              >
                <input
                  type="radio"
                  value={t.value}
                  className="sr-only"
                  {...register("projectType")}
                />
                <span className="block font-medium text-cream">{t.label}</span>
                <span className="mt-1 block text-sm text-muted">{typeBlurbs[t.value]}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {/* Step 2: the idea */}
      {step === 1 && (
        <div className="space-y-5">
          {context && (
            <p className="rounded-xl border border-lilac/25 bg-lilac/5 px-4 py-3 text-sm text-lilac">
              ✦ attached from the Design Lab: {context}
            </p>
          )}
          <TextAreaField
            label="Your idea"
            placeholder="The mood, the story, the colours, the obsession. References welcome, songs and films count."
            rows={compact ? 5 : 7}
            {...register("idea")}
            error={errors.idea?.message}
          />
          <UploadPlaceholder />
        </div>
      )}

      {/* Step 3: details */}
      {step === 2 && (
        <div className="space-y-5">
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
                  { value: "yes", label: "Yes, I'll send my pair" },
                  { value: "no", label: "No, please source them" },
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
                  placeholder="e.g. 12 September 2027"
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
                  placeholder="e.g. Ana · 2027"
                  {...register("capNameYear")}
                  error={errors.capNameYear?.message}
                />
                <SelectField
                  label="Do you already have the cap?"
                  options={[
                    { value: "yes", label: "Yes, I have it" },
                    { value: "no", label: "No, let's figure it out" },
                  ]}
                  placeholder="Choose one"
                  {...register("hasCap")}
                  error={errors.hasCap?.message}
                />
              </div>
            </fieldset>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="Deadline"
              optional
              placeholder="a date, an event, or 'no rush'"
              {...register("deadline")}
              error={errors.deadline?.message}
            />
            <TextField
              label="Budget range"
              optional
              placeholder="a rough number or range"
              hint="Rough is fine, it helps me suggest the right scope."
              {...register("budget")}
              error={errors.budget?.message}
            />
          </div>
        </div>
      )}

      {/* Step 4: contact */}
      {step === 3 && (
        <div className="space-y-5">
          <TextField
            label="Your name"
            placeholder="Your name"
            autoComplete="name"
            {...register("name")}
            error={errors.name?.message}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="Email"
              optional
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register("email")}
              error={errors.email?.message}
            />
            <TextField
              label="Instagram"
              optional
              placeholder="@yourhandle"
              {...register("instagram")}
              error={errors.instagram?.message}
            />
          </div>
          <TextField
            label="Phone"
            optional
            placeholder="+40 ..."
            autoComplete="tel"
            {...register("phone")}
            error={errors.phone?.message}
          />
          <p className="text-sm leading-relaxed text-muted">
            This is a hand-painted commission. Any preview is a concept, not
            the final result: the final piece is handmade, textured, and alive.
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3 pt-1">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="text-base text-muted underline-offset-2 hover:text-cream hover:underline"
          >
            ← Back
          </button>
        ) : (
          <span />
        )}
        {step < LAST ? (
          <Button type="button" size="lg" onClick={() => void next()}>
            Next →
          </Button>
        ) : (
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Preparing…" : "Request a custom concept"}
          </Button>
        )}
      </div>
    </form>
  );
}
