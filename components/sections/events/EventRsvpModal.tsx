"use client";

import { useEffect, useState } from "react";
import { type SchoolEvent } from "@/lib/events";
import { cn } from "@/lib/utils";
import { CheckIcon, CloseIcon } from "@/components/ui/icons";

interface EventRsvpModalProps {
  event: SchoolEvent | null;
  onClose: () => void;
}

export function EventRsvpModal({ event, onClose }: EventRsvpModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState("1");
  const [role, setRole] = useState("Parent / Guardian");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!event) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate standard submission
    setTimeout(() => {
      const randomCode = `AVI-${Math.floor(100000 + Math.random() * 900000)}`;
      setConfirmationCode(randomCode);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rsvp-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-brand-950/60 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      {/* Modal Box */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-panel bg-surface shadow-lift animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brand-100/80 px-6 py-5 sm:px-8">
          <div>
            <span className="text-[0.7rem] font-bold uppercase tracking-widest text-brand-500">
              Event Registration
            </span>
            <h2 id="rsvp-modal-title" className="mt-0.5 font-display text-xl font-bold text-ink">
              Reserve Your Seat
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close form"
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-brand-200 text-ink-muted transition-colors hover:border-brand-400 hover:text-ink"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Event Mini Card Summary */}
          <div className="mb-6 rounded-card border border-brand-100 bg-surface-alt p-4">
            <p className="font-display text-[0.95rem] font-bold text-ink leading-snug">
              {event.title}
            </p>
            <p className="mt-1 text-[0.82rem] text-ink-muted">
              {event.formattedDate} · {event.venue}
            </p>
          </div>

          {isSubmitted ? (
            <div className="py-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckIcon className="h-7 w-7" />
              </div>

              <h3 className="mt-4 font-display text-2xl font-bold text-ink">Seat Confirmed!</h3>

              <p className="mt-2 text-[0.92rem] text-ink-body">
                Thank you, <span className="font-semibold text-ink">{name}</span>. We look forward
                to welcoming you to Avi-Cenna.
              </p>

              <div className="mt-6 inline-block rounded-pill border border-brand-200 bg-brand-50/50 px-5 py-2.5 text-[0.85rem] font-semibold text-brand-900">
                Confirmation Ref:{" "}
                <span className="font-mono text-accent-600">{confirmationCode}</span>
              </div>

              <p className="mt-4 text-[0.8rem] text-ink-muted">
                A confirmation note has been recorded for our guest list.
              </p>

              <div className="mt-7">
                <button
                  type="button"
                  onClick={onClose}
                  className="focus-ring inline-flex h-11 items-center justify-center rounded-pill bg-surface-deep px-8 text-[0.88rem] font-semibold text-white shadow-soft hover:bg-brand-800"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="rsvp-name" className="block text-[0.82rem] font-semibold text-ink">
                  Full Name <span className="text-accent-500">*</span>
                </label>
                <input
                  id="rsvp-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Adebayo Ogunlesi"
                  className={cn(
                    "focus-ring mt-1.5 h-11 w-full rounded-pill border border-brand-200 bg-surface px-4 text-[0.88rem] text-ink",
                    "placeholder:text-ink-muted focus:border-brand-500",
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="rsvp-email"
                    className="block text-[0.82rem] font-semibold text-ink"
                  >
                    Email Address <span className="text-accent-500">*</span>
                  </label>
                  <input
                    id="rsvp-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className={cn(
                      "focus-ring mt-1.5 h-11 w-full rounded-pill border border-brand-200 bg-surface px-4 text-[0.88rem] text-ink",
                      "placeholder:text-ink-muted focus:border-brand-500",
                    )}
                  />
                </div>

                <div>
                  <label
                    htmlFor="rsvp-phone"
                    className="block text-[0.82rem] font-semibold text-ink"
                  >
                    Phone Number <span className="text-accent-500">*</span>
                  </label>
                  <input
                    id="rsvp-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0803 123 4567"
                    className={cn(
                      "focus-ring mt-1.5 h-11 w-full rounded-pill border border-brand-200 bg-surface px-4 text-[0.88rem] text-ink",
                      "placeholder:text-ink-muted focus:border-brand-500",
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="rsvp-guests"
                    className="block text-[0.82rem] font-semibold text-ink"
                  >
                    Number of Seats
                  </label>
                  <select
                    id="rsvp-guests"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className={cn(
                      "focus-ring mt-1.5 h-11 w-full rounded-pill border border-brand-200 bg-surface px-4 text-[0.88rem] text-ink",
                      "focus:border-brand-500",
                    )}
                  >
                    <option value="1">1 Person</option>
                    <option value="2">2 Persons</option>
                    <option value="3">3 Persons</option>
                    <option value="4">4 Persons</option>
                    <option value="5+">5+ Persons</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="rsvp-role"
                    className="block text-[0.82rem] font-semibold text-ink"
                  >
                    Relationship to School
                  </label>
                  <select
                    id="rsvp-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className={cn(
                      "focus-ring mt-1.5 h-11 w-full rounded-pill border border-brand-200 bg-surface px-4 text-[0.88rem] text-ink",
                      "focus:border-brand-500",
                    )}
                  >
                    <option value="Parent / Guardian">Parent / Guardian</option>
                    <option value="Prospective Family">Prospective Family</option>
                    <option value="Alumnus">Alumnus</option>
                    <option value="Student">Current Student</option>
                    <option value="Community Guest">Community Guest</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="rsvp-notes" className="block text-[0.82rem] font-semibold text-ink">
                  Special Notes / Accessibility Requests{" "}
                  <span className="font-normal text-ink-muted">(Optional)</span>
                </label>
                <textarea
                  id="rsvp-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any accessibility needs or dietary requirements..."
                  className={cn(
                    "mt-1.5 w-full rounded-2xl border border-brand-200 bg-surface p-3.5 text-[0.88rem] text-ink",
                    "placeholder:text-ink-muted focus:border-brand-500",
                  )}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "focus-ring inline-flex h-11 w-full items-center justify-center rounded-pill bg-surface-deep px-6 text-[0.9rem] font-semibold text-white",
                    "transition-[background-color,transform,box-shadow] duration-base ease-out-expo shadow-soft",
                    "hover:-translate-y-0.5 hover:bg-brand-800 hover:shadow-lift active:translate-y-0",
                    "disabled:opacity-60 disabled:pointer-events-none",
                  )}
                >
                  {isSubmitting ? "Confirming Registration..." : "Confirm My Seat"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
