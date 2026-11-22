"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

/** Shared styling for form controls. */
const control =
  "w-full rounded-xl border border-line bg-ink/60 px-4 py-3.5 text-base text-cream placeholder:text-muted/60 transition-colors focus:border-rose focus:outline-none";

interface BaseProps {
  label: string;
  error?: string;
  hint?: string;
  /** Shown next to the label, e.g. "optional" (in the page's language). */
  optional?: string;
}

/** Ids of the hint / error / counter under a field, for aria-describedby. */
function describedBy(id: string, { hint, error, counter }: { hint?: string; error?: string; counter?: boolean }) {
  return [hint && !error && `${id}-hint`, error && `${id}-error`, counter && `${id}-count`].filter(Boolean).join(" ") || undefined;
}

function FieldWrap({
  label,
  error,
  hint,
  optional,
  htmlFor,
  counter,
  children,
}: BaseProps & {
  htmlFor: string;
  /** Live "used / max" counter shown under the field; `unit` is read out ("characters"). */
  counter?: { value: number; max: number; unit?: string };
  children: React.ReactNode;
}) {
  const over = counter && counter.value > counter.max;
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 flex items-baseline justify-between text-[0.95rem] text-cream/85">
        <span>{label}</span>
        {optional && <span className="text-sm text-muted">{optional}</span>}
      </label>
      {children}
      {(hint || error || counter) && (
        <div className="mt-2 flex items-start justify-between gap-4">
          <div>
            {hint && !error && (
              <p id={`${htmlFor}-hint`} className="text-sm text-muted">
                {hint}
              </p>
            )}
            {error && (
              <p id={`${htmlFor}-error`} role="alert" className="text-sm text-rose-ink">
                {error}
              </p>
            )}
          </div>
          {counter && (
            <p
              id={`${htmlFor}-count`}
              className={cn("shrink-0 text-sm tabular-nums", over ? "font-medium text-rose-ink" : "text-muted")}
            >
              {counter.value} / {counter.max}
              <span className="sr-only"> {counter.unit ?? "characters"}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

type InputProps = BaseProps & React.InputHTMLAttributes<HTMLInputElement>;

export const TextField = forwardRef<HTMLInputElement, InputProps>(
  function TextField({ label, error, hint, optional, className, ...props }, ref) {
    const id = useId();
    return (
      <FieldWrap label={label} error={error} hint={hint} optional={optional} htmlFor={id}>
        <input
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={describedBy(id, { hint, error })}
          className={cn(control, error && "border-rose/70", className)}
          {...props}
        />
      </FieldWrap>
    );
  },
);

type TextareaProps = BaseProps &
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    counter?: { value: number; max: number; unit?: string };
  };

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function TextAreaField({ label, error, hint, optional, counter, className, ...props }, ref) {
    const id = useId();
    return (
      <FieldWrap label={label} error={error} hint={hint} optional={optional} htmlFor={id} counter={counter}>
        <textarea
          ref={ref}
          id={id}
          rows={4}
          aria-invalid={!!error}
          aria-describedby={describedBy(id, { hint, error, counter: !!counter })}
          className={cn(control, "resize-y", error && "border-rose/70", className)}
          {...props}
        />
      </FieldWrap>
    );
  },
);
