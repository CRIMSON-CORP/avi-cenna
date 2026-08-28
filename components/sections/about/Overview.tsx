"use client";

import Image from "next/image";
import { aboutOverview } from "@/lib/about";
import { Reveal } from "@/components/ui/Reveal";

/**
 * "Who we are" — the four paragraphs the old About page ran as an undivided
 * block, given a reading order.
 *
 * The thirty nationalities were one clause buried in the third paragraph on
 * the old site. It is the most quotable fact the school has, so it comes out
 * of the prose and becomes the section's one loud moment: a card overlapping
 * the photograph, where the eye lands before it reaches the body copy.
 */
export function Overview() {
  return (
    <section
      id={aboutOverview.id}
      aria-labelledby="about-overview-heading"
      className="scroll-mt-24 bg-surface py-section"
    >
      <div className="shell">
        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          {/* ------------------------------------------------ the words -- */}
          <Reveal>
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-500">
              {aboutOverview.eyebrow}
            </p>

            <h2
              id="about-overview-heading"
              className="mt-3 max-w-lg font-display text-display-sm font-extrabold tracking-[-0.03em] text-ink"
            >
              {aboutOverview.heading}
            </h2>

            {/* The opening paragraph sets larger and lighter — an editorial
                lead-in rather than another body paragraph. */}
            <p className="mt-7 text-[clamp(1.05rem,0.95rem+0.4vw,1.3rem)] font-light leading-relaxed text-ink">
              {aboutOverview.lead}
            </p>

            <div className="mt-6 flex flex-col gap-5 text-[0.97rem] leading-relaxed text-ink-body">
              {aboutOverview.body.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          {/* ---------------------------------------- photograph + fact -- */}
          <Reveal delay={0.1} className="relative">
            <div className="blob-mask relative aspect-4/5 overflow-hidden shadow-lift">
              <Image
                src={aboutOverview.image.src}
                alt={aboutOverview.image.alt}
                fill
                sizes="(min-width: 1024px) 44vw, 100vw"
                className="object-cover"
                style={{ objectPosition: aboutOverview.image.focal }}
              />
            </div>

            {/* The thirty nationalities, lifted out of the prose. */}
            <div className="relative z-10 -mt-12 ml-auto mr-2 w-[min(21rem,100%)] rounded-card bg-surface-deep p-6 shadow-lift sm:-mt-16 sm:p-7">
              <p className="flex items-baseline gap-2">
                <span className="font-display text-[3.4rem] font-extrabold leading-none tracking-[-0.04em] text-white sm:text-[4rem]">
                  {aboutOverview.pullQuote.figure}
                </span>
                <span className="text-[0.95rem] font-semibold text-brand-200">
                  {aboutOverview.pullQuote.label}
                </span>
              </p>
              <p className="mt-3 text-[0.88rem] leading-relaxed text-ink-invert-soft">
                {aboutOverview.pullQuote.body}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
