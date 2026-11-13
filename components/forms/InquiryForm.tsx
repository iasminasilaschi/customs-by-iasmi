"use client";

import Link from "next/link";
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
  LIMITS,
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
 * visitor's browser only (see the draft helpers below) and expires after 30 days.
 *
 * There is intentionally NO backend yet: submissions are validated
 * client-side, then the user picks how to send them (pre-filled email
 * or Instagram). Swap `onSubmit` for a real API route later
 * (see docs/ROADMAP.md).
 */

const DRAFT_KEY = "iasmi-inquiry-draft-v1";
/** Drafts hold personal details: drop them after 30 days without an edit. */
const DRAFT_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
/** Longer mailto links get cut off by some mail apps; above this, offer copy & paste instead. */
const MAILTO_MAX = 1800;

const steps = [
  { title: "What are we making?", sub: "Pick the closest one, we can always adjust." },
  { title: "Tell me the idea", sub: "The mood, the story, the colours. Messy is fine." },
  { title: "A few details", sub: "Just what I need to plan it." },
  { title: "How can I reach you?", sub: "Last step. One way is enough." },
] as const;
const LAST = steps.length - 1;

/** Step 3's fields, validated together before moving on. */
const detailFields = [
  "baseShoe",
  "shoeSize",
  "hasShoes",
  "graduationDate",
  "capTheme",
  "schoolColors",
  "capNameYear",
  "hasCap",
  "deadline",
  "budget",
] as const satisfies ReadonlyArray<keyof InquiryValues>;

const typeBlurbs: Record<ProjectType, string> = {
  sneakers: "Hand-painted on a pair of shoes",
  cap: "A small square canvas for a big day",
  collab: "Something we make together",
  other: "An idea that doesn't fit a box",
};

interface Draft {
  values?: Partial<InquiryValues>;
  step?: number;
  savedAt?: number;
}

function readDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw) as Draft;
    // no date (an older draft) counts as expired
    if (typeof draft.savedAt !== "number" || Date.now() - draft.savedAt > DRAFT_MAX_AGE_MS) {
      localStorage.removeItem(DRAFT_KEY);
      return null;
    }
    return draft;
  } catch {
    return null;
  }
}
function writeDraft(values: Partial<InquiryValues>, step: number) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ values, step, savedAt: Date.now() }));
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
  const [copy, setCopy] = useState<"idle" | "copied" | "failed">("idle");
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
  // Only save once the visitor has actually written something (not just the defaults).
  const hasContent = Object.entries(all).some(
    ([key, val]) =>
      key !== "projectType" &&
      typeof val === "string" &&
      val.trim() !== "" &&
      !(key === "idea" && val === initialIdea),
  );
  useEffect(() => {
    if (!hydrated.current) return;
    if (hasContent) writeDraft(all as Partial<InquiryValues>, step);
    else clearDraft();
  }, [all, step, hasContent]);

  function clearSaved() {
    clearDraft();
    reset({ projectType: defaultType, idea: initialIdea } as InquiryValues);
    setStep(0);
  }

  // counted like zod counts it: by character, so an emoji is one, not two
  const ideaLength = Array.from(useWatch({ control, name: "idea" }) ?? "").length;

  useEffect(() => {
    if (stepChanged.current) headingRef.current?.focus();
    stepChanged.current = true;
  }, [step]);

  async function next() {
    if (step === 1 && !(await trigger("idea"))) return;
    if (step === 2) {
      if (!(await trigger(detailFields))) return;
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
    else if (detailFields.some((f) => errs[f])) setStep(2);
  }

  function summaryLines(v: InquiryValues) {
    let lines = Object.entries(v)
      .filter(([, val]) => typeof val === "string" && val.trim() !== "")
      .map(([key, val]) => `${key}: ${val}`)
      .join("\n");
    if (context) lines += `\ndesign lab selection: ${context}`;
    return lines;
  }

  function requestText(v: InquiryValues) {
    return `Hi Iasmi!\n\n${summaryLines(v)}\n\n(sent from the Customs by Iasmi site)`;
  }

  /** The pre-filled email. If the full request would make the link too long, it says "pasting below" instead. */
  function buildMailto(v: InquiryValues): { href: string; complete: boolean } {
    const label = projectTypes.find((t) => t.value === v.projectType)?.label;
    const base = `mailto:${site.email}?subject=${encodeURIComponent(`Commission request: ${label}`)}&body=`;
    const full = base + encodeURIComponent(requestText(v));
    if (full.length <= MAILTO_MAX) return { href: full, complete: true };
    return {
      href: base + encodeURIComponent("Hi Iasmi!\n\nMy request was too long for an email link, so I'm pasting it below:\n\n"),
      complete: false,
    };
  }

  async function copyRequest(v: InquiryValues) {
    try {
      await navigator.clipboard.writeText(requestText(v));
      setCopy("copied");
    } catch {
      setCopy("failed");
    }
  }

  async function onSubmit(values: InquiryValues) {
    // Simulated delivery: no fake backend, no silent data loss.
    await new Promise((r) => setTimeout(r, 400));
    clearDraft();
    setSent(values);
  }

  if (sent) {
    const mail = buildMailto(sent);
    return (
      <div className="glass grain rounded-blob p-8 text-center" role="status">
        <p className="hand text-3xl text-lilac">love it already.</p>
        <h3 className="display mt-3 text-2xl text-cream">Your request is ready to send</h3>
        {mail.complete ? (
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
            The studio inbox isn&apos;t wired up yet, so the last step is yours.
            The email button carries everything you wrote; for Instagram, copy
            your request and paste it into the DM.
          </p>
        ) : (
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
            Your request is too long to fit in an email link. Copy it first,
            then open the email (or an Instagram DM) and paste it in.
          </p>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {!mail.complete && (
            <Button type="button" onClick={() => void copyRequest(sent)}>
              Copy my request
            </Button>
          )}
          <Button href={mail.href} variant={mail.complete ? "primary" : "outline"}>
            {mail.complete ? "Open pre-filled email" : "Open email"}
          </Button>
          <Button href={site.instagram} variant="outline">
            DM on Instagram
          </Button>
          {mail.complete && (
            <Button type="button" variant="outline" onClick={() => void copyRequest(sent)}>
              Copy my request
            </Button>
          )}
        </div>
        <p className="mt-3 text-sm text-muted" role="status">
          {copy === "copied" && "Copied! Paste it into your email or DM."}
          {copy === "failed" && "Couldn't copy automatically. Select the text below and copy it."}
        </p>
        {copy === "failed" && (
          <textarea
            readOnly
            aria-label="Your request, to copy"
            value={requestText(sent)}
            rows={8}
            onFocus={(e) => e.currentTarget.select()}
            className="mt-2 w-full rounded-xl border border-line bg-ink/60 p-3 text-left text-sm text-cream"
          />
        )}
        <button
          type="button"
          onClick={() => {
            setCopy("idle");
            setSent(null);
          }}
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
        <div className="flex items-baseline justify-between gap-4 text-sm text-muted">
          <span>
            Step {step + 1} of {steps.length}
          </span>
          {hasContent ? (
            <span>
              saved on this device ·{" "}
              <button
                type="button"
                onClick={clearSaved}
                className="underline underline-offset-2 hover:text-cream"
              >
                clear saved draft
              </button>
            </span>
          ) : (
            <span>saved only on this device</span>
          )}
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
            counter={{ value: ideaLength, max: LIMITS.idea }}
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
                  maxLength={LIMITS.short}
                  {...register("baseShoe")}
                  error={errors.baseShoe?.message}
                />
                <TextField
                  label="Shoe size"
                  placeholder="EU 38 / US 7.5"
                  maxLength={LIMITS.short}
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
                  maxLength={LIMITS.short}
                  {...register("graduationDate")}
                  error={errors.graduationDate?.message}
                />
                <TextField
                  label="School / university colours"
                  optional
                  placeholder="e.g. navy & gold"
                  maxLength={LIMITS.short}
                  {...register("schoolColors")}
                  error={errors.schoolColors?.message}
                />
              </div>
              <TextField
                label="Theme, quote or symbols"
                optional
                placeholder="a quote, an inside joke, a dream"
                maxLength={LIMITS.short}
                  {...register("capTheme")}
                error={errors.capTheme?.message}
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                  label="Name / year on the cap"
                  optional
                  placeholder="e.g. Ana · 2027"
                  maxLength={LIMITS.short}
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
              maxLength={LIMITS.short}
                  {...register("deadline")}
              error={errors.deadline?.message}
            />
            <TextField
              label="Budget range"
              optional
              placeholder="a rough number or range"
              hint="Rough is fine, it helps me suggest the right scope."
              maxLength={LIMITS.short}
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
            maxLength={LIMITS.short}
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
              maxLength={LIMITS.short}
                  {...register("email")}
              error={errors.email?.message}
            />
            <TextField
              label="Instagram"
              optional
              placeholder="@yourhandle"
              maxLength={LIMITS.short}
                  {...register("instagram")}
              error={errors.instagram?.message}
            />
          </div>
          <TextField
            label="Phone"
            optional
            placeholder="+40 ..."
            autoComplete="tel"
            maxLength={LIMITS.phone}
                  {...register("phone")}
            error={errors.phone?.message}
          />
          <p className="text-sm leading-relaxed text-muted">
            This is a hand-painted commission. Any preview is a concept, not
            the final result: the final piece is handmade, textured, and alive.
          </p>
          <p className="text-sm leading-relaxed text-muted">
            Your answers are saved only on this device, in this browser, until
            you send them. Nothing reaches me until you open the email or
            Instagram yourself.{" "}
            <Link href="/privacy" className="text-olive underline underline-offset-2 hover:text-deep">
              How I handle your data
            </Link>
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
