"use client";

import { primary } from "@/lib/academics";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The Primary page below the hero: what the school promises, the subject
 * areas, and the external measure at the end of Year 6.
 *
 * The promises are five separate commitments, not a paragraph — the source
 * runs them together into one block of prose where each sentence is doing a
 * different job, and they read far better apart.
 */
export function PrimaryContent() {
  return (
    <>
      {/* --------------------------------------------- what we promise --- */}
      <section
        aria-labelledby="promise-heading"
        className="py-section"
        style={{ backgroundColor: "var(--stage-tint)" }}
      >
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1fr] lg:gap-16">
            <Reveal>
              <h2
                id="promise-heading"
                className="font-display text-display-sm font-extrabold tracking-[-0.03em] text-ink lg:sticky lg:top-28"
              >
                What we hold ourselves to.
              </h2>
            </Reveal>

            <ul>
              {primary.values.map((value, i) => (
                <Reveal as="li" key={value.slice(0, 24)} delay={i * 0.06}>
                  <p className="border-t py-5 text-[0.97rem] leading-relaxed text-ink-body"
                    style={{ borderColor: "color-mix(in oklab, var(--stage) 22%, transparent)" }}
                  >
                    {value}
                  </p>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- subjects ----- */}
      <section
        id="curriculum"
        aria-labelledby="subjects-heading"
        className="scroll-mt-24 bg-surface py-section"
      >
        <div className="shell">
          <Reveal>
            <p
              className="text-[0.7rem] font-bold uppercase tracking-[0.2em]"
              style={{ color: "var(--stage-ink)" }}
            >
              {primary.subjects.eyebrow}
            </p>
            <h2
              id="subjects-heading"
              className="mt-3 font-display text-display-sm font-extrabold tracking-[-0.03em] text-ink"
            >
              {primary.subjects.heading}
            </h2>
          </Reveal>

          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
            {primary.subjects.items.map((subject, i) => (
              <Reveal as="li" key={subject} delay={(i % 4) * 0.06}>
                <div
                  className="flex h-full items-center rounded-card border border-brand-100 bg-surface px-5 py-4 text-[0.95rem] font-semibold text-ink transition-all duration-base ease-out-expo hover:-translate-y-0.5 hover:shadow-soft"
                  style={{ borderLeftColor: "var(--stage)", borderLeftWidth: "3px" }}
                >
                  {subject}
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------ the measure ---- */}
      <section
        id="assessment"
        aria-labelledby="measure-heading"
        className="scroll-mt-24 bg-surface pb-section"
      >
        <div className="shell">
          <Reveal>
            <div className="rounded-panel bg-surface-deep p-8 shadow-lift sm:p-11 lg:p-14">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-gold-400">
                {primary.checkpoint.eyebrow}
              </p>
              <h2
                id="measure-heading"
                className="mt-3 max-w-xl font-display text-display-sm font-extrabold tracking-[-0.03em] text-white"
              >
                {primary.checkpoint.heading}
              </h2>
              <p className="mt-5 max-w-2xl text-[1rem] leading-relaxed text-ink-invert-soft">
                {primary.checkpoint.body}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
