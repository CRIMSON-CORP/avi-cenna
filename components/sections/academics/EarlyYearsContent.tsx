"use client";

import { earlyYears } from "@/lib/academics";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The two reference sections of the Early Years page: the four EYFS themes,
 * and the seven areas of learning.
 *
 * The themes are long — several paragraphs each — so they are disclosures
 * rather than four columns of dense text. They use native <details>, which
 * means keyboard support, screen reader semantics and find-in-page all work
 * without a line of JavaScript, and the page still functions before hydration.
 *
 * The seven areas are the opposite shape: a name and a short list of skills.
 * They stay open, as a definition list, because that is what they are.
 */
export function EarlyYearsContent() {
  return (
    <>
      {/* ------------------------------------------------ four themes ---- */}
      <section
        id="themes"
        aria-labelledby="themes-heading"
        className="scroll-mt-24 py-section"
        style={{ backgroundColor: "var(--stage-tint)" }}
      >
        <div className="shell">
          <Reveal>
            <p
              className="text-[0.7rem] font-bold uppercase tracking-[0.2em]"
              style={{ color: "var(--stage-ink)" }}
            >
              {earlyYears.themes.eyebrow}
            </p>
            <h2
              id="themes-heading"
              className="mt-3 max-w-xl font-display text-display-sm font-extrabold tracking-[-0.03em] text-ink"
            >
              {earlyYears.themes.heading}
            </h2>
            <p className="mt-5 max-w-2xl text-[0.97rem] leading-relaxed text-ink-body">
              {earlyYears.themes.body}
            </p>
          </Reveal>

          <div className="mt-10 lg:mt-14">
            {earlyYears.themes.items.map((theme, i) => (
              <Reveal key={theme.title} delay={i * 0.05}>
                <details className="group border-t border-brand-200 last:border-b">
                  <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                    <h3 className="font-display text-[clamp(1.2rem,1rem+0.9vw,1.7rem)] font-extralight leading-tight tracking-[-0.02em] text-ink transition-colors duration-base group-open:font-extrabold">
                      {theme.title}
                    </h3>

                    {/* A plus that becomes a minus. Two spans rather than an
                        icon swap, so the crossbar stays put as it turns. */}
                    <span
                      aria-hidden
                      className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-base"
                      style={{ backgroundColor: "var(--stage-tint)", color: "var(--stage-ink)" }}
                    >
                      <span className="absolute h-0.5 w-3.5 rounded-full bg-current" />
                      <span className="absolute h-0.5 w-3.5 rotate-90 rounded-full bg-current transition-transform duration-base ease-out-expo group-open:rotate-0" />
                    </span>
                  </summary>

                  <p className="max-w-2xl pb-6 text-[0.95rem] leading-relaxed text-ink-body">
                    {theme.body}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------- seven areas ------- */}
      <section
        id="areas"
        aria-labelledby="areas-heading"
        className="scroll-mt-24 bg-surface py-section"
      >
        <div className="shell">
          <Reveal>
            <p
              className="text-[0.7rem] font-bold uppercase tracking-[0.2em]"
              style={{ color: "var(--stage-ink)" }}
            >
              {earlyYears.areas.eyebrow}
            </p>
            <h2
              id="areas-heading"
              className="mt-3 max-w-xl font-display text-display-sm font-extrabold tracking-[-0.03em] text-ink"
            >
              {earlyYears.areas.heading}
            </h2>
          </Reveal>

          <dl className="mt-10 lg:mt-14">
            {earlyYears.areas.items.map((area, i) => (
              <Reveal key={area.name} delay={(i % 4) * 0.05}>
                <div className="grid gap-1 border-t border-brand-100 py-5 sm:grid-cols-[minmax(0,22rem)_1fr] sm:gap-8">
                  <dt className="font-display text-[1.05rem] font-extrabold leading-snug tracking-[-0.01em] text-ink">
                    {area.name}
                  </dt>
                  <dd className="text-[0.92rem] leading-relaxed text-ink-body">{area.detail}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
