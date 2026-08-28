"use client";

import { ptaRemit } from "@/lib/pta";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The three notes from the foot of the old page, given the last word.
 *
 * There is no call to action after this, and that is deliberate: the page is
 * read by parents who have already chosen the school, and the honest ending
 * is the boundary rather than a button. The navy panel is the same one the
 * hero opens on, so the page closes where it began — which is what stops an
 * ending on constraints from reading as an ending that ran out of road.
 *
 * The wording is the school's own. Softening "shall not seek to interfere"
 * would change what it means, and it is stated plainly on purpose.
 */
export function Remit() {
  return (
    <section
      id={ptaRemit.id}
      aria-labelledby="pta-remit-heading"
      className="scroll-mt-24 bg-surface py-section"
    >
      <div className="shell">
        <Reveal y={20}>
          <div className="relative overflow-hidden rounded-panel bg-surface-deep px-6 py-12 sm:px-10 sm:py-14 lg:px-16 lg:py-16">
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-1/3 -left-1/4 h-144 w-xl rounded-full opacity-50 blur-3xl"
              style={{
                background: "radial-gradient(circle, rgb(74 144 208 / 0.4) 0%, transparent 65%)",
              }}
            />

            <div className="relative grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
              <div>
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-300">
                  {ptaRemit.eyebrow}
                </p>
                <h2
                  id="pta-remit-heading"
                  className="mt-4 font-display text-[clamp(1.7rem,1.3rem+1.8vw,2.6rem)] font-extrabold leading-tight tracking-[-0.03em] text-white"
                >
                  {ptaRemit.heading}
                </h2>
                <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-ink-invert-soft">
                  {ptaRemit.body}
                </p>
              </div>

              <ul className="lg:pt-1">
                {ptaRemit.notes.map((note, i) => (
                  <Reveal as="li" key={note} delay={0.08 + i * 0.08} y={16}>
                    <div className="flex gap-4 border-t border-white/12 py-5">
                      <span
                        aria-hidden
                        className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-gold-400"
                      />
                      <p className="text-[0.97rem] leading-relaxed text-ink-invert-soft">{note}</p>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
