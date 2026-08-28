"use client";

import { aboutValues } from "@/lib/about";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The seven values.
 *
 * Seven does not divide into a tidy card grid, and forcing it into one leaves
 * a stranded tile in the last row. Rows solve that and suit the content
 * better: each value is a single word with a one-sentence definition, so the
 * word can take the display size while the definition sits beside it at
 * reading size.
 *
 * The hover state tints the row and brings the word to brand blue. Nothing is
 * hidden behind it — every definition is on the page at all times.
 */
export function Values() {
  return (
    <section
      id={aboutValues.id}
      aria-labelledby="about-values-heading"
      className="scroll-mt-24 bg-surface py-section"
    >
      <div className="shell">
        <Reveal>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-500">
            {aboutValues.eyebrow}
          </p>
          <h2
            id="about-values-heading"
            className="mt-3 max-w-xl font-display text-display-sm font-extrabold tracking-[-0.03em] text-ink"
          >
            {aboutValues.heading}
          </h2>
        </Reveal>

        <ul className="mt-10 lg:mt-14">
          {aboutValues.items.map((value, i) => (
            <Reveal as="li" key={value.word} delay={i * 0.05}>
              <div className="group grid items-baseline gap-2 rounded-card border-t border-brand-100 px-3 py-6 transition-colors duration-base ease-out-expo hover:bg-surface-alt sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-8 sm:px-5">
                <h3 className="font-display text-[clamp(1.5rem,1.2rem+1.1vw,2.1rem)] font-extralight leading-tight tracking-[-0.025em] text-ink transition-colors duration-base ease-out-expo group-hover:text-brand-500">
                  {value.word}
                </h3>
                <p className="max-w-xl text-[0.95rem] leading-relaxed text-ink-body">
                  {value.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
