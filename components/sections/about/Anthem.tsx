"use client";

import { aboutAnthem } from "@/lib/about";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The school anthem, closing the page.
 *
 * It earns the last word because of one line — "To be either the first or with
 * the first" — which is where the school's own tagline, "…the trailblazers",
 * comes from. That line is set apart and the footnote makes the connection,
 * so the page ends by explaining something the reader has seen in the header
 * and the footer since they arrived.
 *
 * Lines arrive one at a time on scroll. That is the one place a stagger is
 * doing real work on this page: it is a song, and it reads as one.
 */
export function Anthem() {
  return (
    <section
      id={aboutAnthem.id}
      aria-labelledby="about-anthem-heading"
      className="scroll-mt-24 bg-surface py-section"
    >
      <div className="shell">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p
              id="about-anthem-heading"
              className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-500"
            >
              {aboutAnthem.eyebrow}
            </p>
            <span
              aria-hidden
              className="mx-auto mt-7 block h-px w-16 bg-gold-400"
            />
          </Reveal>

          {/* A div, not a p: each line is revealed by a motion div, and a div
              inside a p is invalid nesting the browser silently repairs —
              which desynchronises it from the server markup and breaks
              hydration. The lines are still read continuously. */}
          <div className="mt-9 flex flex-col gap-3">
            {aboutAnthem.lines.map((line, i) => (
              <Reveal key={line} delay={i * 0.06} y={16}>
                <span
                  className={
                    i === aboutAnthem.emphasis
                      ? "block font-display text-[clamp(1.35rem,1.05rem+1.3vw,2rem)] font-extrabold leading-snug tracking-[-0.02em] text-ink"
                      : "block font-display text-[clamp(1.02rem,0.95rem+0.4vw,1.25rem)] font-extralight leading-snug tracking-[-0.01em] text-ink-body"
                  }
                >
                  {line}
                </span>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <span
              aria-hidden
              className="mx-auto mt-9 block h-px w-16 bg-gold-400"
            />
            <p className="mt-6 text-[0.85rem] leading-relaxed text-ink-muted">
              {aboutAnthem.footnote}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
