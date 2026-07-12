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
  optional?: boolean;
}

function FieldWrap({
  label,
  error,
  hint,
  optional,
  htmlFor,
  children,
}: BaseProps & { htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 flex items-baseline justify-between text-[0.95rem] text-cream/85">
        <span>{label}</span>
        {optional && <span className="text-sm text-muted">optional</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-2 text-sm text-muted">{hint}</p>}
      {error && (
        <p role="alert" className="mt-2 text-sm text-rose-2">
          {error}
        </p>
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
          className={cn(control, error && "border-rose/70", className)}
          {...props}
        />
      </FieldWrap>
    );
  },
);

type TextareaProps = BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function TextAreaField({ label, error, hint, optional, className, ...props }, ref) {
    const id = useId();
    return (
      <FieldWrap label={label} error={error} hint={hint} optional={optional} htmlFor={id}>
        <textarea
          ref={ref}
          id={id}
          rows={4}
          aria-invalid={!!error}
          className={cn(control, "resize-y", error && "border-rose/70", className)}
          {...props}
        />
      </FieldWrap>
    );
  },
);

type SelectProps = BaseProps &
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    options: ReadonlyArray<{ value: string; label: string }>;
    placeholder?: string;
  };

export const SelectField = forwardRef<HTMLSelectElement, SelectProps>(
  function SelectField(
    { label, error, hint, optional, options, placeholder, className, ...props },
    ref,
  ) {
    const id = useId();
    return (
      <FieldWrap label={label} error={error} hint={hint} optional={optional} htmlFor={id}>
        <select
          ref={ref}
          id={id}
          aria-invalid={!!error}
          className={cn(control, "appearance-none", error && "border-rose/70", className)}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </FieldWrap>
    );
  },
);

/**
 * Upload placeholder — real media uploads arrive with backend/storage in a
 * later phase. Kept visible so the flow is honest about what's coming.
 */
export function UploadPlaceholder({ label = "Inspiration images" }: { label?: string }) {
  return (
    <div>
      <p className="mb-2 flex items-baseline justify-between text-[0.95rem] text-cream/85">
        <span>{label}</span>
        <span className="text-sm text-muted">optional</span>
      </p>
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-ink/40 px-4 py-8 text-center">
        <span aria-hidden className="text-2xl">🖼</span>
        <p className="text-base text-cream/70">Drag & drop moodboard uploads</p>
        <p className="text-sm text-muted">
          coming soon — for now, paste links in your message or send images by
          email / Instagram after submitting
        </p>
      </div>
    </div>
  );
}
