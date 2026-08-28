"use client";

import { ptaElection } from "@/lib/pta";
import { Reveal } from "@/components/ui/Reveal";

/**
 * How a parent gets onto the committee.
 *
 * The one numbered thing on the page, because it is the one thing with an
 * order: you cannot go to the AGM without having been vetted, and you cannot
 * be vetted without having applied. Three beats laid across rather than down —
 * the admissions procedure already owns the vertical numbered rail, and this
 * is three short steps rather than seven.
 *
 * The numerals are set extralight at display size, the way the heroes set
 * their first line, so the count reads as structure rather than as a badge.
 */
export function Election() {
  return (
    <section
      id={ptaElection.id}
      aria-labelledby="pta-election-heading"
      className="scroll-mt-24 bg-surface-tint py-section"
    >
      <div className="shell">
        <Reveal>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-500">
            {ptaElection.eyebrow}
          </p>
          <h2
            id="pta-election-heading"
            className="mt-3 max-w-2xl font-display text-display-sm font-extrabold tracking-[-0.03em] text-ink"
          >
            {ptaElection.heading}
          </h2>
        </Reveal>

        <ol className="mt-10 grid gap-x-10 gap-y-8 lg:mt-14 lg:grid-cols-3">
          {ptaElection.steps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={0.08 + i * 0.09}>
              <div className="border-t-2 border-brand-200 pt-5">
                <p
                  aria-hidden
                  className="font-display text-[2.6rem] font-extralight leading-none tracking-[-0.04em] text-brand-300"
                >
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 font-display text-[1.15rem] font-extrabold leading-snug tracking-tight text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-sm text-[0.95rem] leading-relaxed text-ink-body">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
