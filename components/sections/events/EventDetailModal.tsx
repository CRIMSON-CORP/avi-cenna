"use client";

import { useEffect } from "react";
import Image from "next/image";
import { type SchoolEvent } from "@/lib/events";
import {
  CalendarIcon,
  ClockIcon,
  CloseIcon,
  MapPinIcon,
  UserIcon,
} from "@/components/ui/icons";

interface EventDetailModalProps {
  event: SchoolEvent | null;
  onClose: () => void;
  onOpenRsvp: (event: SchoolEvent) => void;
}

export function EventDetailModal({ event, onClose, onOpenRsvp }: EventDetailModalProps) {
  useEffect(() => {
    if (!event) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [event, onClose]);

  if (!event) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-brand-950/60 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-panel bg-surface shadow-lift animate-in fade-in zoom-in-95 duration-200">
        {/* Banner Image */}
        <div className="relative h-56 w-full shrink-0 bg-brand-900 sm:h-64">
          <Image
            src={event.image}
            alt={event.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-deep/80 via-transparent to-black/30" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="focus-ring absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-surface/80 text-ink backdrop-blur-md transition-all hover:bg-surface hover:scale-105"
          >
            <CloseIcon className="h-5 w-5" />
          </button>

          {/* Quick Date Tag on Banner */}
          <div className="absolute bottom-4 left-6 right-6">
            <span className="inline-flex items-center gap-1.5 rounded-pill bg-white/90 px-3.5 py-1 text-[0.78rem] font-semibold text-brand-900 backdrop-blur">
              <CalendarIcon className="h-3.5 w-3.5 text-accent-500" />
              {event.formattedDate}
            </span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">
          <h2 id="event-modal-title" className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {event.title}
          </h2>

          {/* Key Info Badges */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 border-y border-brand-100/80 py-4 text-[0.84rem]">
            <div className="flex items-start gap-2.5">
              <ClockIcon className="h-4 w-4 shrink-0 text-brand-500 mt-0.5" />
              <div>
                <span className="block text-[0.72rem] font-semibold uppercase tracking-wider text-ink-muted">
                  Timing
                </span>
                <span className="font-medium text-ink">{event.time}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPinIcon className="h-4 w-4 shrink-0 text-brand-500 mt-0.5" />
              <div>
                <span className="block text-[0.72rem] font-semibold uppercase tracking-wider text-ink-muted">
                  Location
                </span>
                <span className="font-medium text-ink">{event.venue}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <UserIcon className="h-4 w-4 shrink-0 text-brand-500 mt-0.5" />
              <div>
                <span className="block text-[0.72rem] font-semibold uppercase tracking-wider text-ink-muted">
                  Host
                </span>
                <span className="font-medium text-ink">{event.organizer}</span>
              </div>
            </div>
          </div>

          {/* About Event */}
          <div className="mt-6">
            <h3 className="text-[0.92rem] font-bold uppercase tracking-wider text-ink">
              About This Event
            </h3>
            <p className="mt-2 text-[0.93rem] leading-relaxed text-ink-body">
              {event.details}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-brand-100 bg-surface-tint/50 px-6 py-4 sm:flex sm:items-center sm:justify-between sm:px-8">
          <p className="text-[0.8rem] text-ink-muted mb-3 sm:mb-0">
            Complimentary admission · Limited seating capacity
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="focus-ring inline-flex h-11 items-center justify-center rounded-pill border border-brand-200 bg-surface px-5 text-[0.88rem] font-semibold text-ink hover:bg-brand-50"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenRsvp(event);
              }}
              className="focus-ring inline-flex h-11 items-center justify-center rounded-pill bg-surface-deep px-6 text-[0.88rem] font-semibold text-white shadow-soft hover:bg-brand-800"
            >
              Book a seat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
