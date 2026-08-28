"use client";

import { academicsApproach } from "@/lib/academics";
import { Reveal } from "@/components/ui/Reveal";

/**
 * "A love of learning" — the School Programs page, folded in here.
 *
 * The school names four words: creativity, innovation, change, improvement.
 * They are a set rather than a sequence, so they are set as a row of equals
 * with no numbering, in the page's extralight display weight — the words do
 * the work, and the sentence they came from finishes the thought underneath.
 *
 * The anti-bullying card is placed directly after the ladder above on purpose:
 * that section explains the building is split by floor, and this explains why.
 */
export function Approach() {
  return (
    <section
      id={academicsApproach.id}
      aria-labelledby="approach-heading"
      className="scroll-mt-24 bg-surface-alt py-section"
    >
      <div className="shell">
        <Reveal>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-500">
            {academicsApproach.eyebrow}
          </p>
          <h2
            id="approach-heading"
            className="mt-3 font-display text-display-sm font-extrabold tracking-[-0.03em] text-ink"
          >
            {academicsApproach.heading}
          </h2>
          <p className="mt-6 max-w-2xl text-[clamp(1.02rem,0.95rem+0.4vw,1.25rem)] font-light leading-relaxed text-ink">
            {academicsApproach.lead}
          </p>
        </Reveal>

        {/* The four words. */}
        <Reveal delay={0.1}>
          <ul className="mt-12 grid gap-x-8 gap-y-4 border-t border-brand-200 pt-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {academicsApproach.words.map((word) => (
              <li
                key={word}
                className="font-display text-[clamp(1.4rem,1.1rem+1.2vw,2rem)] font-extralight leading-tight tracking-[-0.025em] text-brand-600"
              >
                {word}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[0.9rem] text-ink-muted">{academicsApproach.wordsNote}</p>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mt-10 max-w-2xl text-[0.97rem] leading-relaxed text-ink-body">
            {academicsApproach.body}
          </p>
        </Reveal>

        <ul className="mt-10 grid gap-5 lg:mt-14 lg:grid-cols-2">
          {academicsApproach.cards.map((card, i) => (
            <Reveal as="li" key={card.title} delay={i * 0.1}>
              <div className="h-full rounded-panel bg-surface p-7 sm:p-9">
                <h3 className="font-display text-[1.15rem] font-extrabold leading-snug tracking-[-0.02em] text-ink">
                  {card.title}
                </h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-body">{card.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
