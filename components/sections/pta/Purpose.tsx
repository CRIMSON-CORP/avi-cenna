"use client";

import { ptaPurpose } from "@/lib/pta";
import { Reveal } from "@/components/ui/Reveal";

/**
 * What the association is for.
 *
 * Three aims, and deliberately not three cards in a row: they are not
 * parallel offers to choose between, they are one sentence the school wrote
 * and then broke into three. Rows keep them reading as a list, and let the
 * label carry the subject while the school's own wording carries the sense.
 *
 * Nothing here is numbered. The aims have no order — the section that does
 * have one, the election, is the only place on this page that counts.
 */
export function Purpose() {
  return (
    <section
      id={ptaPurpose.id}
      aria-labelledby="pta-purpose-heading"
      className="scroll-mt-24 bg-surface py-section"
    >
      <div className="shell grid gap-10 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-20">
        <Reveal>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-500">
            {ptaPurpose.eyebrow}
          </p>
          <h2
            id="pta-purpose-heading"
            className="mt-3 font-display text-display-sm font-extrabold tracking-[-0.03em] text-ink"
          >
            {ptaPurpose.heading}
          </h2>
          <p className="mt-6 max-w-md text-[0.97rem] leading-relaxed text-ink-body">
            {ptaPurpose.condition}
          </p>
        </Reveal>

        <ul className="lg:pt-2">
          {ptaPurpose.aims.map((aim, i) => (
            <Reveal as="li" key={aim.label} delay={0.06 + i * 0.07}>
              <div className="grid gap-2 border-t border-brand-100 py-7 sm:grid-cols-[minmax(0,9rem)_1fr] sm:gap-8">
                <p className="text-[0.72rem] font-bold uppercase tracking-widest text-brand-500">
                  {aim.label}
                </p>
                <p className="max-w-xl font-display text-[clamp(1.05rem,0.95rem+0.5vw,1.3rem)] font-light leading-snug text-ink">
                  {aim.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
