"use client";

import Image from "next/image";
import { type SchoolEvent } from "@/lib/events";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: SchoolEvent;
  onSelectDetails: (event: SchoolEvent) => void;
  onSelectRsvp: (event: SchoolEvent) => void;
}

export function EventCard({ event, onSelectDetails, onSelectRsvp }: EventCardProps) {
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-card border border-brand-100/90 bg-surface p-4 sm:p-6",
        "transition-[translate,transform,box-shadow,border-color] duration-base ease-out-expo",
        "hover:-translate-y-1 hover:border-brand-300 hover:shadow-card",
        "lg:flex-row lg:items-center lg:gap-8",
      )}
    >
      {/* Event Thumbnail */}
      <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-brand-50 sm:aspect-16/9 lg:h-48 lg:w-72 lg:shrink-0">
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 40vw, 300px"
          className="object-cover transition-transform duration-slow ease-out-expo group-hover:scale-105"
        />
      </div>

      {/* Main Content Info */}
      <div className="mt-4 flex flex-1 flex-col justify-center lg:mt-0">
        <h2 className="font-display text-xl font-bold tracking-tight text-ink sm:text-[1.35rem] leading-snug">
          {event.title}
        </h2>

        <p className="mt-2 line-clamp-2 text-[0.9rem] leading-relaxed text-ink-body">
          {event.description}
        </p>

        {/* Metadata Columns */}
        <div className="mt-5 grid grid-cols-1 gap-3.5 border-t border-brand-100/70 pt-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <span className="block text-[0.72rem] font-semibold uppercase tracking-wider text-ink-muted">
              Organiser
            </span>
            <span className="mt-0.5 block text-[0.84rem] font-medium text-ink">
              {event.organizer}
            </span>
          </div>

          <div>
            <span className="block text-[0.72rem] font-semibold uppercase tracking-wider text-ink-muted">
              Date &amp; Time
            </span>
            <span className="mt-0.5 block text-[0.84rem] font-medium text-ink">
              {event.formattedDate}
            </span>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <span className="block text-[0.72rem] font-semibold uppercase tracking-wider text-ink-muted">
              Venue
            </span>
            <span className="mt-0.5 block truncate text-[0.84rem] font-medium text-ink">
              {event.venue}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 flex shrink-0 flex-col items-stretch gap-2.5 pt-3 sm:flex-row sm:items-center sm:justify-end lg:mt-0 lg:flex-col lg:items-center lg:pt-0">
        <button
          type="button"
          onClick={() => onSelectRsvp(event)}
          className={cn(
            "focus-ring inline-flex h-11 items-center justify-center rounded-pill bg-surface-deep px-6 text-[0.88rem] font-semibold text-white",
            "transition-[background-color,transform,box-shadow] duration-base ease-out-expo shadow-soft",
            "hover:-translate-y-0.5 hover:bg-brand-800 hover:shadow-lift active:translate-y-0",
            "w-full sm:w-auto lg:w-36",
          )}
        >
          Book a seat
        </button>

        <button
          type="button"
          onClick={() => onSelectDetails(event)}
          className="focus-ring inline-flex h-9 items-center justify-center rounded-pill px-4 text-[0.83rem] font-medium text-ink-body transition-colors duration-fast hover:text-ink hover:underline underline-offset-4"
        >
          See Details
        </button>
      </div>
    </article>
  );
}
