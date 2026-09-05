"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { enquiryForm } from "@/lib/contact";
import { cn } from "@/lib/utils";
import { ArrowIcon, CheckIcon } from "@/components/ui/icons";

/**
 * The enquiry form, in a glass card over the navy.
 *
 * VALIDATION RUNS TWICE, on purpose. The same rules run here and in
 * app/api/enquiries/route.ts: the client copy exists so a mistake is caught
 * before a round trip, and the server copy is the one that actually decides,
 * because nothing arriving over the wire can be trusted. Errors come back
 * keyed by field name from both, so one rendering path handles both.
 *
 * A field is only re-validated as you type ONCE IT HAS ALREADY FAILED. Live
 * validation from the first keystroke tells someone their email is invalid
 * while they are still typing the first letter of it, which is both true and
 * useless.
 *
 * Submissions are emailed to the school office and not stored anywhere
 * else — see the note on app/api/enquiries/route.ts for what that costs.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** An error appearing under one field pushes every field below it down. That
    shift is animated rather than jumped, and `position` rather than the full
    layout animation on purpose: the default projection scales the box it is
    animating, which stretches the text inside an input for the duration. */
const LAYOUT = { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const };

type Values = { name: string; email: string; phone: string; subject: string; message: string };

const EMPTY: Values = { name: "", email: "", phone: "", subject: "", message: "" };

/** The client half of the contract the route enforces. */
function validate(values: Values) {
  const errors: Record<string, string> = {};
  if (!values.name.trim()) errors.name = "Tell us your name.";
  if (!values.email.trim()) errors.email = "We need an email address to reply to.";
  else if (!EMAIL.test(values.email.trim()))
    errors.email = "That does not look like an email address.";
  if (!values.phone.trim()) errors.phone = "Add a phone number.";
  if (!values.subject.trim()) errors.subject = "Add a subject.";
  if (!values.message.trim()) errors.message = "Write your message.";
  return errors;
}

export function EnquiryForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [failure, setFailure] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const reduceMotion = useReducedMotion();

  function set(field: keyof Values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    /* Only clear what is already showing — see the note at the top. */
    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  }

  function focusFirst(found: Record<string, string>) {
    const first = Object.keys(found)[0];
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const found = validate(values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      focusFirst(found);
      return;
    }

    setStatus("sending");
    setErrors({});
    setFailure(null);

    try {
      const body = new FormData();
      Object.entries(values).forEach(([key, value]) => body.append(key, value));

      const response = await fetch("/api/enquiries", { method: "POST", body });
      const result = await response.json();

      if (!response.ok) {
        /* Mail host down, or rate limited. Not fixable by editing a field. */
        if (response.status >= 500 || response.status === 429) {
          setFailure(result?.errors?.form ?? null);
          setStatus("failed");
          return;
        }
        setErrors(result.errors ?? {});
        focusFirst(result.errors ?? {});
        setStatus("idle");
        return;
      }

      setValues(EMPTY);
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <div className="relative rounded-panel border border-white/15 bg-white/10 p-6 backdrop-blur-md sm:p-8 lg:p-10">
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div
            key="sent"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="py-6 text-center"
          >
            <motion.span
              aria-hidden
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-500 text-white"
              initial={reduceMotion ? false : { scale: 0.3 }}
              animate={{ scale: 1 }}
              transition={
                reduceMotion ? undefined : { type: "spring", stiffness: 260, damping: 12 }
              }
            >
              <CheckIcon className="h-7 w-7" />
            </motion.span>

            <h3 className="mt-6 font-display text-[1.4rem] font-extrabold tracking-tight text-white">
              {enquiryForm.sent.heading}
            </h3>
            <p className="mx-auto mt-3 max-w-sm text-[0.95rem] leading-relaxed text-ink-invert-soft">
              {enquiryForm.sent.body}
            </p>

            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="focus-ring mt-7 inline-flex items-center gap-2 rounded-pill border border-white/25 px-5 py-2.5 text-[0.85rem] font-bold text-white transition-colors duration-fast hover:bg-white/10"
            >
              {enquiryForm.sent.again}
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            onSubmit={onSubmit}
            noValidate
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-[1.4rem] font-extrabold tracking-tight text-white">
              {enquiryForm.heading}
            </h2>
            <p className="mt-2 text-[0.88rem] text-ink-invert-soft">{enquiryForm.note}</p>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <Field
                name="name"
                label={enquiryForm.fields.name.label}
                placeholder={enquiryForm.fields.name.placeholder}
                value={values.name}
                error={errors.name}
                onChange={(v) => set("name", v)}
                autoComplete="name"
              />
              <Field
                name="phone"
                type="tel"
                label={enquiryForm.fields.phone.label}
                placeholder={enquiryForm.fields.phone.placeholder}
                value={values.phone}
                error={errors.phone}
                onChange={(v) => set("phone", v)}
                autoComplete="tel"
              />
              <div className="sm:col-span-2">
                <Field
                  name="email"
                  type="email"
                  label={enquiryForm.fields.email.label}
                  placeholder={enquiryForm.fields.email.placeholder}
                  value={values.email}
                  error={errors.email}
                  onChange={(v) => set("email", v)}
                  autoComplete="email"
                />
              </div>

              <div className="sm:col-span-2">
                <Field
                  name="subject"
                  label={enquiryForm.fields.subject.label}
                  placeholder={enquiryForm.fields.subject.placeholder}
                  value={values.subject}
                  error={errors.subject}
                  onChange={(v) => set("subject", v)}
                />
              </div>

              <div className="sm:col-span-2">
                <Field
                  name="message"
                  as="textarea"
                  label={enquiryForm.fields.message.label}
                  placeholder={enquiryForm.fields.message.placeholder}
                  value={values.message}
                  error={errors.message}
                  onChange={(v) => set("message", v)}
                />
              </div>
            </div>

            {status === "failed" && (
              <p role="alert" className="mt-5 text-[0.88rem] font-medium text-accent-200">
                {failure ?? enquiryForm.failed}
              </p>
            )}

            <motion.button
              layout="position"
              transition={LAYOUT}
              type="submit"
              disabled={status === "sending"}
              className={cn(
                "focus-ring group/btn mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-pill",
                "bg-accent-500 px-6 text-[0.9rem] font-semibold text-white shadow-soft",
                "transition-[background-color,box-shadow,transform] duration-base ease-out-expo",
                "hover:-translate-y-0.5 hover:bg-accent-600 hover:shadow-lift active:translate-y-0",
                "disabled:pointer-events-none disabled:opacity-60 sm:w-auto",
              )}
            >
              {status === "sending" ? enquiryForm.sending : enquiryForm.submit}
              {status !== "sending" && (
                <ArrowIcon className="h-4 w-4 transition-transform duration-base ease-out-expo group-hover/btn:translate-x-1" />
              )}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------------ */

const CONTROL = cn(
  "w-full rounded-card border bg-white/8 px-4 text-[0.95rem] text-white placeholder:text-white/35",
  "transition-[border-color,background-color,box-shadow] duration-base ease-out-expo",
  "focus:outline-none focus:border-white/50 focus:bg-white/12",
);

function Field({
  name,
  label,
  value,
  error,
  onChange,
  placeholder,
  type = "text",
  as = "input",
  autoComplete,
}: {
  name: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  as?: "input" | "textarea";
  autoComplete?: string;
}) {
  const id = useId();
  const errorId = `${id}-error`;

  const shared = {
    id,
    name,
    value,
    placeholder,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
    className: cn(CONTROL, error ? "border-accent-300" : "border-white/20"),
  };

  return (
    <motion.div layout="position" transition={LAYOUT}>
      <label htmlFor={id} className="mb-2 block text-[0.8rem] font-semibold text-ink-invert-soft">
        {label}
      </label>

      {as === "textarea" ? (
        <textarea {...shared} rows={5} className={cn(shared.className, "resize-y py-3")} />
      ) : (
        <input
          {...shared}
          type={type}
          autoComplete={autoComplete}
          className={cn(shared.className, "h-12")}
        />
      )}

      <FieldError id={errorId} error={error} />
    </motion.div>
  );
}

/** Reserves no space when empty — the card is short enough that a row of
    permanently blank error slots would be the loudest thing on it. */
function FieldError({ id, error }: { id: string; error?: string }) {
  return (
    <AnimatePresence>
      {error && (
        <motion.p
          id={id}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden text-[0.8rem] font-medium text-accent-200"
        >
          <span className="block pt-1.5">{error}</span>
        </motion.p>
      )}
    </AnimatePresence>
  );
}
