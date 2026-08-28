"use client";

import { aboutCareers } from "@/lib/about";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Careers.
 *
 * The old site listed this in the menu but never built the page, and there are
 * no standing vacancies to publish, so this is deliberately a band rather than
 * a section: it says what the school looks for, gives one way to act on it,
 * and gets out of the way before the anthem closes the page.
 *
 * One call to action. A second would only compete with it.
 */
export function Careers() {
  return (
    <section
      id={aboutCareers.id}
      aria-labelledby="about-careers-heading"
      className="scroll-mt-24 bg-surface-alt pb-section"
    >
      <div className="shell">
        <Reveal>
          <div className="flex flex-col gap-7 rounded-panel bg-brand-500 p-8 shadow-lift sm:p-11 lg:flex-row lg:items-center lg:justify-between lg:gap-14 lg:p-14">
            <div className="max-w-xl">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-100">
                {aboutCareers.eyebrow}
              </p>
              <h2
                id="about-careers-heading"
                className="mt-3 font-display text-[clamp(1.6rem,1.2rem+1.6vw,2.4rem)] font-extrabold leading-tight tracking-[-0.03em] text-white"
              >
                {aboutCareers.heading}
              </h2>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-white/85">
                {aboutCareers.body}
              </p>
            </div>

            <Button href={aboutCareers.cta.href} variant="invert" arrow className="shrink-0">
              {aboutCareers.cta.label}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
