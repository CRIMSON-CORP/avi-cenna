"use client";

import { useMemo, useRef, useState } from "react";
import {
  VISIT_SLOTS,
  validateVisitDate,
  visitDateBounds,
  visitForm,
} from "@/lib/visits";
import { Honeypot } from "@/components/ui/Honeypot";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * Validation runs here and in the route, from the same functions in
 * lib/visits.ts. The client copy saves a round trip; the server copy decides.
 *
 * Native date input: min/max express the range, and there is no attribute for
 * "not Saturdays", so weekends are caught on submit and explained.
 */
export function VisitForm() {
  /* Once per mount — the bounds read the clock. */
  const bounds = useMemo(() => visitDateBounds(), []);

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [failure, setFailure] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function focusFirst(found: Record<string, string>) {
    const first = Object.keys(found)[0];
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    /* The one rule the browser cannot express. */
    const dateError = validateVisitDate(String(data.get("date") ?? ""));
    if (dateError) {
      setErrors({ date: dateError });
      focusFirst({ date: dateError });
      return;
    }

    setStatus("sending");
    setErrors({});
    setFailure(null);

    try {
      const response = await fetch("/api/visits", { method: "POST", body: data });
      const result = await response.json();

      if (!response.ok) {
        /* Never reached the office, or rate limited. Not fixable by editing
           a field. */
        if (response.status >= 500) {
          setFailure(result?.errors?.form ?? null);
          setStatus("error");
          return;
        }
        setErrors(result.errors ?? {});
        focusFirst(result.errors ?? {});
        setStatus("idle");
        return;
      }

      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <Section>
        <div className="rounded-panel bg-surface p-8 text-center sm:p-12" role="status">
          <h2 className="font-display text-[clamp(1.5rem,1.2rem+1.2vw,2.1rem)] font-extrabold tracking-[-0.03em] text-ink">
            {visitForm.sent.heading}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[0.97rem] leading-relaxed text-ink-body">
            {visitForm.sent.body}
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="focus-ring mt-6 text-[0.88rem] font-semibold text-brand-600 underline underline-offset-4 hover:text-brand-700"
          >
            {visitForm.sent.again}
          </button>
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <Reveal>
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-500">
          {visitForm.eyebrow}
        </p>
        <h2
          id="book-visit-heading"
          className="mt-3 max-w-lg font-display text-display-sm font-extrabold tracking-[-0.03em] text-ink"
        >
          {visitForm.heading}
        </h2>
        <p className="mt-5 max-w-xl text-[0.97rem] leading-relaxed text-ink-body">
          {visitForm.body}
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <form
          ref={formRef}
          onSubmit={onSubmit}
          noValidate
          className="mt-9 rounded-panel bg-surface p-7 sm:p-9 lg:mt-12"
        >
          <Honeypot />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Field label={visitForm.fields.name.label} name="name" error={errors.name}>
              <input
                {...fieldProps("name", errors.name)}
                type="text"
                autoComplete="name"
                placeholder={visitForm.fields.name.placeholder}
                className={inputClass(errors.name)}
              />
            </Field>

            <Field label={visitForm.fields.phone.label} name="phone" error={errors.phone}>
              <input
                {...fieldProps("phone", errors.phone)}
                type="tel"
                autoComplete="tel"
                placeholder={visitForm.fields.phone.placeholder}
                className={inputClass(errors.phone)}
              />
            </Field>

            <Field
              label={visitForm.fields.email.label}
              name="email"
              error={errors.email}
              className="sm:col-span-2"
            >
              <input
                {...fieldProps("email", errors.email)}
                type="email"
                autoComplete="email"
                placeholder={visitForm.fields.email.placeholder}
                className={inputClass(errors.email)}
              />
            </Field>

            <Field
              label={visitForm.fields.date.label}
              name="date"
              hint={visitForm.fields.date.hint}
              error={errors.date}
            >
              <input
                {...fieldProps("date", errors.date, visitForm.fields.date.hint)}
                type="date"
                min={bounds.min}
                max={bounds.max}
                defaultValue=""
                className={inputClass(errors.date)}
              />
            </Field>

            {/* Two options do not need a menu. */}
            <fieldset className="min-w-0">
              <legend className="mb-2 text-[0.82rem] font-semibold text-ink">
                {visitForm.fields.slot.label}
              </legend>
              <div className="flex flex-col gap-2.5 sm:flex-row">
                {VISIT_SLOTS.map((slot, index) => (
                  <label
                    key={slot.value}
                    className={cn(
                      "focus-within:ring-2 focus-within:ring-brand-500/25",
                      "flex flex-1 cursor-pointer items-start gap-3 rounded-card border bg-surface-alt px-4 py-3",
                      "transition-colors duration-base ease-out-expo hover:border-brand-300",
                      "has-checked:border-brand-500 has-checked:bg-brand-50",
                      errors.slot ? "border-accent-600" : "border-brand-200",
                    )}
                  >
                    <input
                      type="radio"
                      name="slot"
                      value={slot.value}
                      defaultChecked={index === 0}
                      aria-describedby={errors.slot ? "slot-error" : undefined}
                      className="mt-1 accent-brand-600"
                    />
                    <span className="min-w-0">
                      <span className="block text-[0.9rem] font-semibold text-ink">
                        {slot.label}
                      </span>
                      <span className="block text-[0.78rem] text-ink-muted">{slot.detail}</span>
                    </span>
                  </label>
                ))}
              </div>
              {errors.slot && (
                <p id="slot-error" className="mt-1.5 text-[0.8rem] font-medium text-accent-700">
                  {errors.slot}
                </p>
              )}
            </fieldset>

            <Field
              label={visitForm.fields.message.label}
              name="message"
              optional
              error={errors.message}
              className="sm:col-span-2"
            >
              <textarea
                {...fieldProps("message", errors.message)}
                rows={4}
                placeholder={visitForm.fields.message.placeholder}
                className={cn(inputClass(errors.message), "resize-y")}
              />
            </Field>
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-brand-100 pt-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[0.85rem] leading-relaxed text-ink-muted">
              Would rather not fill in a form? Email{" "}
              <a
                href={`mailto:${visitForm.email}`}
                className="focus-ring font-semibold text-brand-600 underline underline-offset-4 hover:text-brand-700"
              >
                {visitForm.email}
              </a>{" "}
              or just call the school.
            </p>

            <button
              type="submit"
              disabled={status === "sending"}
              className={cn(
                "focus-ring inline-flex h-12 shrink-0 items-center justify-center rounded-pill px-7 font-semibold text-white",
                "bg-accent-500 shadow-soft transition-all duration-base ease-out-expo",
                "hover:-translate-y-0.5 hover:bg-accent-600 hover:shadow-lift",
                "disabled:pointer-events-none disabled:opacity-60",
              )}
            >
              {status === "sending" ? visitForm.sending : visitForm.submit}
            </button>
          </div>

          {/* Announced without stealing focus mid-typing. */}
          <p aria-live="polite" className="sr-only">
            {status === "sending" ? "Sending your request" : ""}
          </p>

          {status === "error" && (
            <p role="alert" className="mt-5 text-[0.9rem] font-medium text-accent-700">
              {failure ?? visitForm.failure}
            </p>
          )}
        </form>
      </Reveal>
    </Section>
  );
}

/* ------------------------------------------------------------- plumbing -- */

function Section({ children }: { children: React.ReactNode }) {
  return (
    <section
      id={visitForm.id}
      aria-labelledby="book-visit-heading"
      className="scroll-mt-24 bg-surface-alt py-section"
    >
      <div className="shell">{children}</div>
    </section>
  );
}

/** Without aria-describedby a screen reader never reads the error text. */
function fieldProps(name: string, error?: string, hint?: string) {
  const described = [error ? `${name}-error` : null, hint && !error ? `${name}-hint` : null]
    .filter(Boolean)
    .join(" ");
  return {
    id: name,
    name,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": described || undefined,
  };
}

function inputClass(error?: string) {
  return cn(
    "w-full rounded-card border bg-surface-alt px-4 py-3 text-[0.95rem] text-ink",
    "transition-colors duration-base ease-out-expo",
    "focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25",
    error ? "border-accent-600" : "border-brand-200",
  );
}

function Field({
  label,
  name,
  error,
  hint,
  optional,
  className,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <label
        htmlFor={name}
        className="mb-2 flex items-baseline gap-2 text-[0.82rem] font-semibold text-ink"
      >
        {label}
        {optional && <span className="font-normal text-ink-muted">optional</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${name}-hint`} className="mt-1.5 text-[0.78rem] text-ink-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-[0.8rem] font-medium text-accent-700">
          {error}
        </p>
      )}
    </div>
  );
}
