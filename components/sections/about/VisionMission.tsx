"use client";

import { aboutVision } from "@/lib/about";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Vision & mission.
 *
 * The school's vision statement already contains a triad — "to act on
 * information and knowledge, to act on their passions, to act on their
 * curiosity" — so the section sets that repetition as the structure instead of
 * flattening it into one sentence. The repeated phrase stays extralight and
 * the object of each clause takes the weight, which makes the three readable
 * as a set at a glance.
 *
 * No numbering: these are three equal commitments, not three steps.
 */
export function VisionMission() {
  return (
    <section
      id={aboutVision.id}
      aria-labelledby="about-vision-heading"
      className="scroll-mt-24 bg-surface-alt py-section"
    >
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
          {/* ---------------------------------------------------- vision -- */}
          <Reveal>
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-500">
              {aboutVision.eyebrow}
            </p>

            <h2
              id="about-vision-heading"
              className="mt-3 font-display text-display-sm font-extrabold tracking-[-0.03em] text-ink"
            >
              {aboutVision.heading}
            </h2>

            <p className="mt-6 max-w-lg text-[1.02rem] leading-relaxed text-ink-body">
              {aboutVision.vision}
            </p>

            <ul className="mt-8 flex flex-col">
              {aboutVision.acts.map((act, i) => (
                <Reveal as="li" key={act} delay={i * 0.08}>
                  <p className="border-t border-brand-200 py-5 font-display text-[clamp(1.35rem,1.1rem+1vw,1.9rem)] leading-tight tracking-[-0.02em]">
                    <span className="font-extralight text-brand-500">to act on </span>
                    <span className="font-extrabold text-ink">{act}</span>
                  </p>
                </Reveal>
              ))}
            </ul>
          </Reveal>

          {/* --------------------------------------------------- mission -- */}
          <Reveal delay={0.12}>
            <div className="rounded-panel bg-surface p-7 sm:p-9 lg:sticky lg:top-28">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-accent-600">
                {aboutVision.missionEyebrow}
              </p>
              <div className="mt-5 flex flex-col gap-4 text-[0.95rem] leading-relaxed text-ink-body">
                {aboutVision.mission.map((paragraph, i) => (
                  <p
                    key={paragraph.slice(0, 24)}
                    className={i === 0 ? "text-[1.02rem] font-medium text-ink" : undefined}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
