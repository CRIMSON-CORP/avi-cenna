"use client";

import { careersInvitation, careersSafeguarding } from "@/lib/careers";
import { Reveal } from "@/components/ui/Reveal";
import { ShieldIcon } from "@/components/ui/icons";

/**
 * The invitation, and the safeguarding commitment beside it.
 *
 * Safeguarding is pulled out of the prose and given its own card rather than
 * being left as the third paragraph of an intro. It is the most consequential
 * thing on the page — it tells a candidate what will be asked of them before
 * they apply, and it tells anyone else reading what the school demands of the
 * people it hires. Buried in a paragraph it reads as boilerplate; set apart it
 * reads as a position.
 */
export function WorkingHere() {
  return (
    <section
      id={careersInvitation.id}
      aria-labelledby="careers-invitation-heading"
      className="scroll-mt-24 bg-surface py-section"
    >
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
          <Reveal>
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-500">
              {careersInvitation.eyebrow}
            </p>
            <h2
              id="careers-invitation-heading"
              className="mt-3 max-w-lg font-display text-display-sm font-extrabold tracking-[-0.03em] text-ink"
            >
              {careersInvitation.heading}
            </h2>
            <p className="mt-6 max-w-xl text-[clamp(1.02rem,0.95rem+0.4vw,1.22rem)] font-light leading-relaxed text-ink">
              {careersInvitation.body}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-panel border border-brand-100 bg-surface-alt p-7 sm:p-9">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-500 text-white">
                <ShieldIcon className="h-5 w-5" />
              </span>
              <p className="mt-5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-600">
                {careersSafeguarding.eyebrow}
              </p>
              <p className="mt-3 text-[0.97rem] leading-relaxed text-ink-body">
                {careersSafeguarding.body}
              </p>
              <p className="mt-4 border-t border-brand-200 pt-4 text-[0.95rem] font-medium leading-relaxed text-ink">
                {careersSafeguarding.requirement}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
