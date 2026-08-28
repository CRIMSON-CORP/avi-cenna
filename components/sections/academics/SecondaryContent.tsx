"use client";

import { secondary } from "@/lib/academics";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The Secondary page below the hero.
 *
 * Two Key Stages, and they are genuinely different in kind: Key Stage 3 is a
 * fixed list where everything is compulsory, Key Stage 4 is a choice with an
 * external examiner at the end. So they are set as two blocks rather than one
 * subject grid — the shape of each block says what kind of years these are
 * before the copy does.
 *
 * The grade scale closes the page because it is the one concrete artefact
 * here: "marked externally" is an abstraction until you see A* to G.
 */
export function SecondaryContent() {
  return (
    <>
      <section
        id="curriculum"
        aria-labelledby="curriculum-heading"
        className="scroll-mt-24 py-section bg-(--stage-tint)"
      >
        <div className="shell">
          <h2 id="curriculum-heading" className="sr-only">
            The secondary curriculum
          </h2>

          <div className="flex flex-col gap-6 lg:gap-8">
            {secondary.keyStages.map((ks, i) => (
              <Reveal key={ks.label} delay={i * 0.08}>
                <article className="rounded-panel bg-surface p-7 sm:p-10 lg:p-12">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <p
                      className="text-[0.7rem] font-bold uppercase tracking-[0.2em]"
                      style={{ color: "var(--stage-ink)" }}
                    >
                      {ks.label}
                    </p>
                    <p className="text-[0.8rem] font-semibold text-ink-muted">{ks.years}</p>
                  </div>

                  <h3 className="mt-3 font-display text-[clamp(1.5rem,1.2rem+1.3vw,2.2rem)] font-extrabold leading-tight tracking-[-0.03em] text-ink">
                    {ks.heading}
                  </h3>

                  <p className="mt-4 max-w-2xl text-[0.97rem] leading-relaxed text-ink-body">
                    {ks.body}
                  </p>

                  {ks.subjects.length > 0 && (
                    <ul className="mt-7 flex flex-wrap gap-2">
                      {ks.subjects.map((subject) => (
                        <li
                          key={subject}
                          className="rounded-pill px-3.5 py-2 text-[0.82rem] font-semibold"
                          style={{
                            backgroundColor: "var(--stage-tint)",
                            color: "var(--stage-ink)",
                          }}
                        >
                          {subject}
                        </li>
                      ))}
                    </ul>
                  )}

                  <p
                    className="mt-7 border-t pt-5 text-[0.9rem] leading-relaxed text-ink-muted"
                    style={{ borderColor: "color-mix(in oklab, var(--stage) 22%, transparent)" }}
                  >
                    {ks.checkpoint}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ grade scale ---- */}
      <section
        id="grades"
        aria-labelledby="grades-heading"
        className="scroll-mt-24 bg-surface py-section"
      >
        <div className="shell">
          <Reveal>
            <p
              className="text-[0.7rem] font-bold uppercase tracking-[0.2em]"
              style={{ color: "var(--stage-ink)" }}
            >
              {secondary.grades.eyebrow}
            </p>
            <h2
              id="grades-heading"
              className="mt-3 max-w-xl font-display text-display-sm font-extrabold tracking-[-0.03em] text-ink"
            >
              {secondary.grades.heading}
            </h2>
          </Reveal>

          {/* The scale itself, top grade first. Set as one row of equal
              weights: the school does not get to decide these, which is the
              entire point of an externally marked examination. */}
          <Reveal delay={0.1}>
            <ol className="mt-9 flex flex-wrap gap-2 lg:mt-12">
              {secondary.grades.scale.map((grade, i) => (
                <li
                  key={grade}
                  className="flex h-14 w-14 items-center justify-center rounded-card font-display text-[1.15rem] font-extrabold tracking-[-0.02em] text-ink sm:h-16 sm:w-16 sm:text-[1.35rem]"
                  style={{
                    /* Fades along the scale, so the ladder of grades is
                       legible as a ladder without any of them reading as a
                       failure.

                       Navy on every tile, not white on the dark end: white on
                       coral is about 2.6:1 and fails WCAG AA, while navy
                       clears it against the strongest tile and only gets
                       easier as the scale lightens. */
                    backgroundColor: `color-mix(in oklab, var(--stage) ${
                      100 - i * 11
                    }%, var(--color-surface-alt))`,
                  }}
                >
                  {grade}
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mt-6 max-w-2xl text-[0.95rem] leading-relaxed text-ink-body">
              {secondary.grades.note}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
