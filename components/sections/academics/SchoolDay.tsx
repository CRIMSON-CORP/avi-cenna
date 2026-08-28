"use client";

import { activitiesNote, type DayHours } from "@/lib/academics";
import { Reveal } from "@/components/ui/Reveal";

/**
 * When this stage starts and finishes.
 *
 * The old site answered this once, on the FAQ page, in a single line covering
 * all three stages — which meant a parent of a five year old had to read the
 * secondary hours to find their own. Each stage now states only its own, and
 * Early Years states two, because Pre-School goes home at one and the rest of
 * the stage does not.
 *
 * The times are the loudest thing in the band, in the stage's own accent: it
 * is a fact to be read off at a glance, not a paragraph to be worked through.
 */
export function SchoolDay({ eyebrow, hours }: { eyebrow: string; hours: readonly DayHours[] }) {
  return (
    <section aria-labelledby="school-day-heading" className="bg-surface py-section">
      <div className="shell">
        <Reveal>
          <div className="rounded-panel border border-brand-100 p-8 sm:p-10 lg:p-12">
            <p className="text-[0.7rem] font-bold uppercase tracking-widest text-[var(--stage-ink)]">
              {eyebrow}
            </p>
            <h2 id="school-day-heading" className="sr-only">
              School hours
            </h2>

            <dl className="mt-6 flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:gap-x-16 sm:gap-y-8">
              {hours.map((entry) => (
                <div key={entry.label}>
                  <dt className="text-[0.8rem] font-semibold text-ink-muted">{entry.label}</dt>
                  <dd className="mt-1 font-display text-[clamp(1.4rem,1.2rem+1vw,2rem)] font-extrabold tabular-nums tracking-tight text-[var(--stage-ink)]">
                    {entry.time}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-8 max-w-xl border-t border-brand-100 pt-6 text-[0.92rem] leading-relaxed text-ink-body">
              {activitiesNote}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
