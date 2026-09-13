"use client";

import { useMemo, useState } from "react";
import { type DateFilter, type SchoolEvent, filterEventsByDate, searchEvents } from "@/lib/events";
import { EventsFilterBar } from "./EventsFilterBar";
import { EventCard } from "./EventCard";
import { EventDetailModal } from "./EventDetailModal";
import { EventRsvpModal } from "./EventRsvpModal";
import { Reveal } from "@/components/ui/Reveal";

export function EventsList() {
  const allEvents = useMemo(() => [], []);
  const [activeFilter, setActiveFilter] = useState<DateFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedDetailEvent, setSelectedDetailEvent] = useState<SchoolEvent | null>(null);
  const [selectedRsvpEvent, setSelectedRsvpEvent] = useState<SchoolEvent | null>(null);

  const displayedEvents = useMemo(() => {
    const byDate = filterEventsByDate(allEvents, activeFilter);
    return searchEvents(byDate, searchQuery);
  }, [allEvents, activeFilter, searchQuery]);

  const handleResetFilters = () => {
    setActiveFilter("all");
    setSearchQuery("");
  };

  return (
    <section aria-labelledby="events-list-heading" className="bg-surface-tint/60 py-12 lg:py-16">
      <div className="shell">
        <h2 id="events-list-heading" className="sr-only">
          Upcoming Events &amp; School Calendar
        </h2>

        {/* Filter bar */}
        <Reveal y={16}>
          <div className="rounded-2xl border border-brand-100 bg-surface sm:p-4">
            <EventsFilterBar
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              totalCount={displayedEvents.length}
            />
          </div>
        </Reveal>

        {/* Event Cards List */}
        <div className="mt-8 space-y-6">
          {displayedEvents.length > 0 &&
            displayedEvents.map((event, index) => (
              <Reveal key={event.id} delay={Math.min(index * 0.08, 0.4)} y={24}>
                <EventCard
                  event={event}
                  onSelectDetails={(evt) => setSelectedDetailEvent(evt)}
                  onSelectRsvp={(evt) => setSelectedRsvpEvent(evt)}
                />
              </Reveal>
            ))}
          {allEvents.length > 0 && displayedEvents.length === 0 && (
            <Reveal y={20}>
              <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-brand-200 bg-surface px-6 py-16 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-ink">No events found</h3>
                <p className="mt-1.5 max-w-sm text-[0.9rem] text-ink-body">
                  We couldn&apos;t find any events matching your selected filter or search terms.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="focus-ring mt-6 inline-flex h-10 items-center justify-center rounded-pill bg-surface-deep px-5 text-[0.85rem] font-semibold text-white shadow-soft hover:bg-brand-800"
                >
                  View all events
                </button>
              </div>
            </Reveal>
          )}
          {allEvents.length === 0 && (
            <Reveal y={20}>
              <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-brand-200 bg-surface px-6 py-16 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-ink">No events found</h3>
                <p className="mt-1.5 max-w-sm text-[0.9rem] text-ink-body">
                  Stay tuned for upcoming school events!
                </p>
              </div>
            </Reveal>
          )}
        </div>
      </div>

      {/* Modals */}
      <EventDetailModal
        event={selectedDetailEvent}
        onClose={() => setSelectedDetailEvent(null)}
        onOpenRsvp={(evt) => setSelectedRsvpEvent(evt)}
      />

      {selectedRsvpEvent && (
        <EventRsvpModal
          key={selectedRsvpEvent.id}
          event={selectedRsvpEvent}
          onClose={() => setSelectedRsvpEvent(null)}
        />
      )}
    </section>
  );
}
