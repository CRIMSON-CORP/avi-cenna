"use client";

import Image from "next/image";
import { aboutHistory } from "@/lib/about";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The founding, and the name.
 *
 * This is the page's second navy ground — the hero opened on the scholar, and
 * this is where he gets explained properly, so the two are deliberately the
 * same colour. Gold does heritage duty throughout: the year, the rules, the
 * figures. Blue and coral stay out of it entirely, which is what keeps the
 * section reading as the past rather than as another product panel.
 */
export function History() {
  /* Bottom padding only: the values section above is also on `surface` and
     already contributes a full section of space, so `py` here would stack two
     gaps with no change of colour to explain them. */
  return (
    <section
      id={aboutHistory.id}
      aria-labelledby="about-history-heading"
      className="scroll-mt-24 bg-surface pb-section"
    >
      <div className="shell">
        <Reveal>
          <div className="overflow-hidden rounded-panel bg-surface-deep shadow-lift">
            <div className="grid gap-10 p-7 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:p-14">
              {/* --------------------------------------------- the story -- */}
              <div>
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-gold-400">
                  {aboutHistory.eyebrow}
                </p>

                <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2">
                  <h2
                    id="about-history-heading"
                    className="max-w-md font-display text-display-sm font-extrabold leading-[1.05] tracking-[-0.03em] text-white"
                  >
                    {aboutHistory.heading}
                  </h2>
                  <p className="flex items-baseline gap-2">
                    <span className="font-display text-[2.6rem] font-extralight leading-none tracking-[-0.03em] text-gold-400">
                      {aboutHistory.founded.year}
                    </span>
                    <span className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-ink-invert-soft">
                      {aboutHistory.founded.label}
                    </span>
                  </p>
                </div>

                <p className="mt-7 max-w-xl text-[1rem] leading-relaxed text-ink-invert-soft">
                  {aboutHistory.intro}
                </p>

                {/* ------------------------------------------ the name --- */}
                <div className="mt-10 border-t border-gold-400/30 pt-8">
                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-gold-400">
                    {aboutHistory.namesake.eyebrow}
                  </p>

                  {/* The four disciplines, then the line that resolves them.
                      Extralight to extrabold at the same size — the page's
                      weight break, spent here on its one real punchline. */}
                  <h3 className="mt-4 font-display text-[clamp(1.5rem,1.1rem+1.7vw,2.4rem)] leading-[1.14] tracking-[-0.03em]">
                    <span className="block font-extralight text-brand-200">
                      {aboutHistory.namesake.disciplines.map((word, i) => (
                        <Reveal key={word} delay={i * 0.09} y={18}>
                          <span className="block">{word}</span>
                        </Reveal>
                      ))}
                    </span>

                    <Reveal delay={0.42}>
                      <span
                        aria-hidden
                        className="my-5 block h-px w-full max-w-[11rem] bg-gold-400"
                      />
                      <span className="block font-extrabold text-white">
                        {aboutHistory.namesake.resolve}
                      </span>
                    </Reveal>
                  </h3>

                  <p className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-ink-invert-soft">
                    {aboutHistory.namesake.body}
                  </p>

                  <dl className="mt-8 grid gap-6 sm:grid-cols-3">
                    {/* A `dl > div` group may only contain dt and dd, so the
                        label is the dt itself. Reversing the flow puts the
                        value above it visually while the markup stays
                        term-then-definition. */}
                    {aboutHistory.namesake.facts.map((fact) => (
                      <div
                        key={fact.label}
                        className="flex flex-col-reverse border-t border-white/15 pt-4"
                      >
                        <dt className="mt-2 text-[0.78rem] leading-snug text-ink-invert-soft">
                          {fact.label}
                        </dt>
                        <dd className="font-display text-[1.7rem] font-extrabold leading-none tracking-[-0.03em] text-gold-400">
                          {fact.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>

              {/* ------------------------------------- photo + evolution -- */}
              <div className="flex flex-col gap-8">
                <div className="blob-mask-alt relative aspect-4/3 overflow-hidden shadow-lift">
                  <Image
                    src={aboutHistory.image.src}
                    alt={aboutHistory.image.alt}
                    fill
                    sizes="(min-width: 1024px) 38vw, 100vw"
                    className="object-cover"
                  />
                </div>

                <div>
                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-gold-400">
                    {aboutHistory.evolution.eyebrow}
                  </p>
                  <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-invert-soft">
                    {aboutHistory.evolution.body}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
