"use client";

import { careersHero } from "@/lib/careers";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The careers hero.
 *
 * Same navy panel and same extralight-to-extrabold weight break as /about, so
 * the two pages read as one site — but shorter, because this page's job is to
 * get a candidate to the vacancy list, not to hold them.
 *
 * No GSAP entrance here. The About hero earns an orchestrated one because it
 * opens the site's main story; repeating it on every secondary page is how a
 * signature turns into a tic.
 */
export function CareersHero() {
  return (
    <section
      aria-labelledby="careers-hero-heading"
      className="bg-surface pt-[calc(var(--header-h)+0.75rem)]"
    >
      <div className="shell">
        <Reveal y={20}>
          <div className="relative overflow-hidden rounded-panel bg-surface-deep px-6 py-14 shadow-lift sm:px-10 sm:py-16 lg:px-16 lg:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-1/4 -top-1/3 h-[36rem] w-[36rem] rounded-full opacity-60 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgb(74 144 208 / 0.4) 0%, transparent 65%)",
              }}
            />

            <div className="relative">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-300">
                {careersHero.eyebrow}
              </p>

              <h1
                id="careers-hero-heading"
                className="mt-6 font-display text-[clamp(2.1rem,1.1rem+3.9vw,4.2rem)] leading-[1.08] tracking-[-0.03em]"
              >
                <span className="block font-extralight text-brand-200">
                  {careersHero.headline.light}
                </span>
                <span className="block font-extrabold text-white">
                  {careersHero.headline.bold}
                </span>
              </h1>

              <p className="mt-8 max-w-xl border-t border-white/12 pt-8 text-[1rem] leading-relaxed text-ink-invert-soft">
                {careersHero.body}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
