"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { careersApply, careersVacancies, type Vacancy } from "@/lib/careers";
import { RolePicker } from "./RolePicker";
import { Honeypot } from "@/components/ui/Honeypot";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * The application form.
 *
 * One form for every role. The old site asked for a "Position applying for"
 * in a free-text box next to a "Subject" box, which meant the applicant typed
 * the role twice and HR received it spelled five different ways. Here the
 * position is picked once, from the cards at the top of the form, and that is
 * what the application is filed under.
 *
 * The selection is local state, seeded from `?role=` once on mount and then
 * left alone — see the note on it below, and RolePicker for why selecting and
 * sharing are deliberately separate acts.
 *
 * Submissions are emailed to HR and not stored anywhere else — see the note
 * on app/api/applications/route.ts for what that costs.
 */
export function ApplyForm({ vacancies }: { vacancies: Vacancy[] }) {
  const params = useSearchParams();

  /* The URL seeds the selection and is then left alone. Picking a card is a
     private choice, not a publication: it must not rewrite the address bar,
     because that would quietly turn "I clicked something" into "here is a
     link I can send", and would overwrite the URL the visitor arrived on.
     Sharing is an explicit button on each card instead. */
  const [role, setRole] = useState(() => params.get("role") ?? "");

  /** Whether the visitor ARRIVED on a role, which is what puts the picker
      into its focused single-position state. */
  const [shared] = useState(() => (params.get("role") ?? "") !== "");

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  /** Server-supplied failure text, when it says something the static copy
      cannot — a rate limit names a wait. */
  const [failure, setFailure] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");
    setErrors({});
    setFailure(null);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        body: new FormData(form),
      });
      const result = await response.json();

      if (!response.ok) {
        /* Nothing the applicant can fix by editing a field: the mail host is
           down, or they have hit the rate limit. Banner, and keep what they
           typed. */
        if (response.status >= 500) {
          setFailure(result?.errors?.form ?? null);
          setStatus("error");
          return;
        }
        setErrors(result.errors ?? {});
        setStatus("idle");
        /* Send focus to the first thing that needs fixing, rather than
           leaving a keyboard user to hunt for the red text. */
        const first = Object.keys(result.errors ?? {})[0];
        if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
        return;
      }

      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  /* Nothing open: the form would be a role picker with no roles, so it is
     replaced by the invitation to write in anyway. */
  if (vacancies.length === 0) {
    return (
      <Section>
        <Reveal>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-500">
            {careersVacancies.eyebrow}
          </p>
          <h2
            id="careers-apply-heading"
            className="mt-3 max-w-lg font-display text-display-sm font-extrabold tracking-[-0.03em] text-ink"
          >
            No positions open right now.
          </h2>
          <p className="mt-5 max-w-xl text-[0.97rem] leading-relaxed text-ink-body">
            {careersVacancies.emptyState}
          </p>
          <a
            href={`mailto:${careersApply.email}`}
            className="focus-ring mt-6 inline-flex h-12 items-center rounded-pill bg-accent-500 px-7 font-semibold text-white shadow-soft transition-all duration-base ease-out-expo hover:-translate-y-0.5 hover:bg-accent-600 hover:shadow-lift"
          >
            Email {careersApply.email}
          </a>
        </Reveal>
      </Section>
    );
  }

  if (status === "sent") {
    return (
      <Section>
        <div className="rounded-panel bg-surface p-8 text-center sm:p-12" role="status">
          <h2 className="font-display text-[clamp(1.5rem,1.2rem+1.2vw,2.1rem)] font-extrabold tracking-[-0.03em] text-ink">
            {careersApply.success.heading}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[0.97rem] leading-relaxed text-ink-body">
            {careersApply.success.body}
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="focus-ring mt-6 text-[0.88rem] font-semibold text-brand-600 underline underline-offset-4 hover:text-brand-700"
          >
            Send another application
          </button>
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <Reveal>
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-500">
          {careersApply.eyebrow}
        </p>
        <h2
          id="careers-apply-heading"
          className="mt-3 max-w-lg font-display text-display-sm font-extrabold tracking-[-0.03em] text-ink"
        >
          {careersApply.heading}
        </h2>
        <p className="mt-5 max-w-xl text-[0.97rem] leading-relaxed text-ink-body">
          {careersApply.body}
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <form
          onSubmit={onSubmit}
          noValidate
          className="mt-9 rounded-panel bg-surface p-7 sm:p-9 lg:mt-12"
        >
          <Honeypot />

          {/* grid-cols-1 explicitly: the implicit single column is sized
              `auto`, i.e. max-content, so it stretches to the full width of
              the card strip and drags the page's horizontal scrollbar with
              it on mobile. `grid-cols-1` is minmax(0,1fr), which cannot. */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* min-w-0: a grid child defaults to min-width:auto, so without
                this it grows to fit the whole card strip instead of letting
                the strip scroll inside it — and takes the page's horizontal
                scrollbar with it. */}
            <div className="min-w-0 sm:col-span-2">
              <RolePicker
                vacancies={vacancies}
                role={role}
                shared={shared}
                error={errors.role}
                onSelect={setRole}
              />
            </div>

            <Field label="Your name" name="name" error={errors.name}>
              <input
                {...fieldProps("name", errors.name)}
                type="text"
                autoComplete="name"
                className={inputClass(errors.name)}
              />
            </Field>

            <Field label="Phone number" name="phone" error={errors.phone}>
              <input
                {...fieldProps("phone", errors.phone)}
                type="tel"
                autoComplete="tel"
                className={inputClass(errors.phone)}
              />
            </Field>

            <Field
              label="Email address"
              name="email"
              error={errors.email}
              className="sm:col-span-2"
            >
              <input
                {...fieldProps("email", errors.email)}
                type="email"
                autoComplete="email"
                className={inputClass(errors.email)}
              />
            </Field>

            <Field
              label="Your CV"
              name="cv"
              error={errors.cv}
              hint={careersApply.cv.hint}
              className="sm:col-span-2"
            >
              <input
                {...fieldProps("cv", errors.cv, careersApply.cv.hint)}
                type="file"
                accept={careersApply.cv.accept}
                className={cn(
                  "w-full rounded-card border bg-surface-alt px-4 py-3 text-[0.92rem] text-ink-body",
                  "file:mr-4 file:rounded-pill file:border-0 file:bg-brand-500 file:px-4 file:py-2",
                  "file:text-[0.82rem] file:font-semibold file:text-white hover:file:bg-brand-600",
                  errors.cv ? "border-accent-600" : "border-brand-200",
                )}
              />
            </Field>

            <Field
              label="Anything else"
              name="message"
              optional
              error={errors.message}
              className="sm:col-span-2"
            >
              <textarea
                {...fieldProps("message", errors.message)}
                rows={4}
                className={cn(inputClass(errors.message), "resize-y")}
              />
            </Field>
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-brand-100 pt-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[0.85rem] leading-relaxed text-ink-muted">
              Prefer to do it by hand?{" "}
              <a
                href={careersApply.form.href}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring font-semibold text-brand-600 underline underline-offset-4 hover:text-brand-700"
              >
                {careersApply.form.label}
              </a>{" "}
              and email it to{" "}
              <a
                href={`mailto:${careersApply.email}`}
                className="focus-ring font-semibold text-brand-600 underline underline-offset-4 hover:text-brand-700"
              >
                {careersApply.email}
              </a>
              , or drop it off at {careersApply.reception}.
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
              {status === "sending" ? "Sending…" : "Send application"}
            </button>
          </div>

          {/* Announced to screen readers without stealing focus mid-typing. */}
          <p aria-live="polite" className="sr-only">
            {status === "sending" ? "Sending your application" : ""}
          </p>

          {status === "error" && (
            <p role="alert" className="mt-5 text-[0.9rem] font-medium text-accent-700">
              {failure ?? careersApply.failure}
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
      id={careersApply.id}
      aria-labelledby="careers-apply-heading"
      className="scroll-mt-24 bg-surface-alt py-section"
    >
      <div className="shell">{children}</div>
    </section>
  );
}

/**
 * Ties an input to its label, its hint and its error message. Without the
 * `aria-describedby` a screen reader announces the field as valid and never
 * reads the red text underneath it, which is the whole point of the red text.
 */
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
    <div className={className}>
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
