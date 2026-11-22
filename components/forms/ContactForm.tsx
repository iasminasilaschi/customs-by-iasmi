"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { TextAreaField, TextField } from "@/components/forms/fields";
import {
  LIMITS,
  makeContactSchema,
  paintChoices,
  type ContactValues,
  type PaintChoice,
} from "@/lib/validation";
import { cn } from "@/lib/utils";
import { site } from "@/data/site";
import type { Dictionary } from "@/lib/dictionaries";
import { fmt } from "@/lib/i18n-format";
import { localePath, type Locale } from "@/lib/i18n";

/**
 * The short contact form: what they'd love painted, the idea, an optional
 * inspo link, then a name and one way to reply. It posts to /api/contact,
 * which emails me through Resend.
 *
 * What's typed is kept as a draft in this browser only (expires after 30
 * days, cleared on send or with "clear draft").
 */

const DRAFT_KEY = "iasmi-contact-draft-v2";
/** Drafts hold personal details: drop them after 30 days without an edit. */
const DRAFT_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

type Status = "idle" | "sending" | "sent" | "error" | "limited";

interface Draft {
  values?: Partial<ContactValues>;
  savedAt?: number;
}

function readDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw) as Draft;
    if (typeof draft.savedAt !== "number" || Date.now() - draft.savedAt > DRAFT_MAX_AGE_MS) {
      localStorage.removeItem(DRAFT_KEY);
      return null;
    }
    return draft;
  } catch {
    return null;
  }
}
function writeDraft(values: Partial<ContactValues>) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ values, savedAt: Date.now() }));
  } catch {
    // storage full or blocked: the draft just isn't saved
  }
}
function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // nothing to clear
  }
}

export function ContactForm({
  locale,
  t,
  messages,
  defaultPaint = "sneakers",
  initialIdea = "",
  refSlug,
  refTitle,
}: {
  locale: Locale;
  t: Dictionary["form"];
  /** Validation messages in the page's language. */
  messages: Dictionary["validation"];
  defaultPaint?: PaintChoice;
  /** Prefilled idea from a project link; beats a saved draft's idea. */
  initialIdea?: string;
  /** The project a "dream up one like this" link came from (?ref=…). */
  refSlug?: string;
  refTitle?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [sentName, setSentName] = useState("");
  const hydrated = useRef(false);
  const doneRef = useRef<HTMLHeadingElement>(null);

  const defaults = { paint: defaultPaint, idea: initialIdea, inspo: "", name: "", email: "", instagram: "" };
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(makeContactSchema(messages)),
    defaultValues: defaults,
  });

  // Restore a saved draft after mount (SSR-safe), then start saving.
  useEffect(() => {
    const draft = readDraft();
    if (draft?.values) {
      reset({
        ...defaults,
        ...draft.values,
        // a project link decides what we're talking about
        paint: refSlug ? defaultPaint : (draft.values.paint ?? defaultPaint),
        idea: initialIdea || draft.values.idea || "",
      });
    }
    hydrated.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const all = useWatch({ control });
  // Only save once something was actually written (not just the defaults).
  const hasContent = (["idea", "inspo", "name", "email", "instagram"] as const).some((key) => {
    const val = all[key];
    return typeof val === "string" && val.trim() !== "" && !(key === "idea" && val === initialIdea);
  });
  useEffect(() => {
    if (!hydrated.current || status === "sent") return;
    if (hasContent) writeDraft(all);
    else clearDraft();
  }, [all, hasContent, status]);

  function clearSaved() {
    clearDraft();
    reset(defaults);
  }

  // counted like zod counts it: by character, so an emoji is one, not two
  const ideaLength = Array.from(all.idea ?? "").length;

  useEffect(() => {
    if (status === "sent") doneRef.current?.focus();
  }, [status]);

  async function send(values: ContactValues, website: string) {
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, ref: refSlug ?? "", lang: locale, website }),
        signal: AbortSignal.timeout(20_000),
      });
      if (res.ok) {
        clearDraft();
        setSentName(values.name.split(/\s+/)[0] ?? "");
        setStatus("sent");
        return;
      }
      if (res.status === 429) {
        setStatus("limited");
        return;
      }
      if (res.status === 400) {
        const data = (await res.json().catch(() => null)) as { fields?: Record<string, string> } | null;
        const fields = Object.entries(data?.fields ?? {}).filter(([key]) => key in defaults);
        if (fields.length > 0) {
          for (const [key, message] of fields) setError(key as keyof ContactValues, { message });
          setStatus("idle");
          return;
        }
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="glass grain rounded-blob p-8 text-center" role="status">
        <p className="hand text-3xl text-lilac">{t.sentKicker}</p>
        <h3 ref={doneRef} tabIndex={-1} className="display mt-3 text-2xl text-cream outline-none">
          {sentName ? fmt(t.sentTitleName, { name: sentName }) : t.sentTitle}
        </h3>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">{t.sentText}</p>
        <button
          type="button"
          onClick={() => {
            reset(defaults);
            setStatus("idle");
          }}
          className="mt-5 text-sm text-muted underline underline-offset-2 hover:text-cream"
        >
          {t.sendAnother}
        </button>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form
      onSubmit={(e) => {
        // the honeypot lives outside react-hook-form, so read it from the form itself
        const website = String(new FormData(e.currentTarget).get("website") ?? "");
        void handleSubmit((values) => send(values, website))(e);
      }}
      noValidate aria-busy={sending} className="space-y-6">
      <div className="flex items-baseline justify-end gap-4 text-sm text-muted">
        {hasContent ? (
          <span>
            {t.draftSaved} ·{" "}
            <button type="button" onClick={clearSaved} className="underline underline-offset-2 hover:text-cream">
              {t.clearDraft}
            </button>
          </span>
        ) : (
          <span>{t.draftsLocal}</span>
        )}
      </div>

      {refTitle && (
        <p className="rounded-xl border border-lilac/25 bg-lilac/5 px-4 py-3 text-sm text-cream/85">
          {t.cameFromA} <span className="font-medium">{refTitle}</span>{t.cameFromB}
        </p>
      )}

      <fieldset>
        <legend className="mb-3 text-[0.95rem] text-cream/85">{t.paintLegend}</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {paintChoices.map((value) => ({ value, ...t.paint[value] })).map((o) => (
            <label
              key={o.value}
              className={cn(
                "cursor-pointer rounded-2xl border p-4 transition-all duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-olive",
                all.paint === o.value ? "border-olive bg-olive/10" : "border-line bg-ink/40 hover:border-olive/40",
              )}
            >
              <input type="radio" value={o.value} className="sr-only" {...register("paint")} />
              <span className="block font-medium text-cream">{o.label}</span>
              <span className="mt-1 block text-sm text-cream/75">{o.blurb}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <TextAreaField
        label={t.ideaLabel}
        placeholder={t.ideaPlaceholder}
        rows={5}
        counter={{ value: ideaLength, max: LIMITS.idea, unit: t.characters }}
        {...register("idea")}
        error={errors.idea?.message}
      />

      <TextField
        label={t.inspoLabel}
        optional={t.optional}
        placeholder={t.inspoPlaceholder}
        inputMode="url"
        maxLength={LIMITS.link}
        {...register("inspo")}
        error={errors.inspo?.message}
      />

      <TextField
        label={t.nameLabel}
        placeholder={t.namePlaceholder}
        autoComplete="name"
        maxLength={LIMITS.short}
        {...register("name")}
        error={errors.name?.message}
      />

      <div>
        <p className="mb-3 text-sm text-muted">{t.replyHint}</p>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label={t.emailLabel}
            optional={t.optional}
            type="email"
            placeholder={t.emailPlaceholder}
            autoComplete="email"
            maxLength={LIMITS.short}
            {...register("email")}
            error={errors.email?.message}
          />
          <TextField
            label={t.instagramLabel}
            optional={t.optional}
            placeholder={t.instagramPlaceholder}
            maxLength={LIMITS.short}
            {...register("instagram")}
            error={errors.instagram?.message}
          />
        </div>
      </div>

      {/* Honeypot: hidden from people and screen readers; bots tend to fill it. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          {t.honeypot}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      {(status === "error" || status === "limited") && (
        <div role="alert" className="rounded-2xl border border-rose/30 bg-rose/5 p-5 text-base text-cream/85">
          <p className="font-medium text-rose-ink">
            {status === "limited" ? t.limitedTitle : t.errorTitle}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed">
            {status === "limited" ? t.limitedText : t.errorText}
            {t.dmA}{" "}
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-olive underline underline-offset-2 hover:text-deep"
            >
              {site.instagramHandle}
            </a>
            {t.dmB}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-muted">
          {t.footnote}{" "}
          <Link href={localePath(locale, "/privacy")} className="text-olive underline underline-offset-2 hover:text-deep">
            {t.privacyLink}
          </Link>
        </p>
        <Button type="submit" size="lg" disabled={sending} className="shrink-0">
          {sending ? (
            <>
              <span
                aria-hidden
                className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              />
              {t.sending}
            </>
          ) : (
            t.send
          )}
        </Button>
      </div>
    </form>
  );
}
