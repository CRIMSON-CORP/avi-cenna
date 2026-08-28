"use client";

import { admissionsReasons } from "@/lib/admissions";
import { CheckIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The nine reasons, from the school's Admission Overview page.
 *
 * Six of them also appear on the homepage. That repetition is deliberate — a
 * parent who lands here from a search has probably never seen the homepage,
 * and this page has to give them a reason to apply before it explains how.
 *
 * The treatment is deliberately NOT the homepage's: that section is a navy
 * panel with a highlight that travels between tiles, and running the same
 * device over the same words would read as déjà vu rather than reassurance.
 * Here the same content is a quiet, scannable proof list on white — the sort
 * of thing you check rather than admire.
 */
export function WhyApply() {
  return (
    <section
      id={admissionsReasons.id}
      aria-labelledby="why-apply-heading"
      className="scroll-mt-24 bg-surface-alt py-section"
    >
      <div className="shell">
        <Reveal>
          <p className="text-[0.7rem] font-bold uppercase tracking-widest text-brand-500">
            {admissionsReasons.eyebrow}
          </p>
          <h2
            id="why-apply-heading"
            className="mt-3 max-w-xl font-display text-display-sm font-extrabold tracking-tight text-ink"
          >
            {admissionsReasons.heading}
          </h2>
        </Reveal>

        <ul className="mt-10 grid gap-x-10 sm:grid-cols-2 lg:mt-14">
          {admissionsReasons.items.map((reason, i) => (
            <Reveal as="li" key={reason.slice(0, 28)} delay={(i % 2) * 0.06}>
              <div className="flex gap-4 border-t border-brand-200 py-5">
                <span
                  aria-hidden
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white"
                >
                  <CheckIcon className="h-3 w-3" />
                </span>
                <p className="text-[0.95rem] leading-relaxed text-ink-body">{reason}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
