"use client";

import { useRef } from "react";
import { gsap, useIsomorphicLayoutEffect } from "@/lib/gsap";
import { aboutHero } from "@/lib/about";

/**
 * The About hero.
 *
 * Its only job is to say what the school is, now — the founding story and the
 * namesake belong to the history section, which is where the school's own site
 * puts them and where a reader expects to find them.
 *
 * The homepage hero owns the blob-photograph composition, so this one is
 * type-led instead: the same display size set in extralight and then in
 * extrabold, which is the weight break this page uses throughout in place of a
 * second typeface.
 *
 * Navy sits in a rounded panel rather than running full bleed, because the
 * fixed header's logo is dark artwork and would disappear against a dark
 * backdrop. Keeping the panel clear of the header also matches the floating
 * navy device the homepage already uses.
 *
 * Every line is real text and only ever moves inside an overflow-hidden mask,
 * so the reveal needs no SplitText, no font-load race, and leaves nothing for
 * a screen reader to miss.
 */

/* Same contract as the homepage hero: the stylesheet holds [data-enter] out of
   the first paint while the section is [data-hero-stage="pending"], and the
   mount layout effect writes GSAP's from-states and drops the attribute in one
   synchronous block — so nothing flashes between the two. */
const NOSCRIPT_CSS = `<style>
  [data-hero-stage] [data-enter] { opacity: 1 !important; visibility: visible !important; }
  [data-about-mask] > * { transform: none !important; }
</style>`;

export function AboutHero() {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const masked = gsap.utils.toArray<HTMLElement>("[data-about-mask] > *");
      const eyebrow = root.querySelector("[data-about-eyebrow]");
      const body = root.querySelector("[data-about-body]");
      const facts = gsap.utils.toArray<HTMLElement>("[data-about-fact]");

      /* The from-states have to be cleared either way, or the curtain rule
         above would leave the hero blank for good. */
      gsap.set("[data-enter]", { opacity: 1, visibility: "visible" });

      if (reduced) {
        root.dataset.heroStage = "ready";
        return;
      }

      gsap.set(masked, { yPercent: 115 });
      gsap.set([body, ...facts], { opacity: 0, y: 14 });
      gsap.set(eyebrow, { opacity: 0, y: 10 });

      /* From-states are written; the stylesheet can let go now. */
      root.dataset.heroStage = "ready";

      gsap
        .timeline({ defaults: { ease: "swoop" }, delay: 0.15 })
        .to(eyebrow, { opacity: 1, y: 0, duration: 0.55 })
        .to(masked, { yPercent: 0, duration: 0.95, stagger: 0.09 }, "-=0.3")
        .to(body, { opacity: 1, y: 0, duration: 0.7 }, "-=0.5")
        .to(facts, { opacity: 1, y: 0, duration: 0.6, stagger: 0.07 }, "-=0.45");
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      data-hero-stage="pending"
      aria-labelledby="about-hero-heading"
      className="bg-surface pt-[calc(var(--header-h)+0.75rem)]"
    >
      <noscript dangerouslySetInnerHTML={{ __html: NOSCRIPT_CSS }} />

      <div className="shell">
        <div className="relative overflow-hidden rounded-panel bg-surface-deep px-6 py-14 shadow-lift sm:px-10 sm:py-16 lg:px-16 lg:py-20">
          {/* One soft brand glow, so the navy has depth without decoration. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-1/4 -top-1/3 h-[40rem] w-[40rem] rounded-full opacity-60 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgb(74 144 208 / 0.4) 0%, transparent 65%)",
            }}
          />

          {/* The headline takes the full width of the panel so the light line
              sets on one line — split across a column it strands a word. */}
          <div className="relative">
            <p
              data-enter
              data-about-eyebrow
              className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-300"
            >
              {aboutHero.eyebrow}
            </p>

            <h1
              id="about-hero-heading"
              data-enter
              className="mt-6 font-display text-[clamp(2.1rem,1.1rem+3.9vw,4.2rem)] leading-[1.08] tracking-[-0.03em]"
            >
              <span data-about-mask className="block overflow-hidden pb-[0.06em]">
                <span className="block font-extralight text-brand-200">
                  {aboutHero.headline.light}
                </span>
              </span>
              <span data-about-mask className="block overflow-hidden pb-[0.06em]">
                <span className="block font-extrabold text-white">
                  {aboutHero.headline.bold}
                </span>
              </span>
            </h1>
          </div>

          {/* Below the rule: the facts a parent checks first on the left, the
              definition of the school on the right. */}
          <div className="relative mt-10 grid gap-8 border-t border-white/12 pt-8 lg:mt-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <ul className="flex flex-col gap-3">
              {aboutHero.facts.map((fact) => (
                <li key={fact} className="flex items-center gap-3">
                  <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-gold-400" />
                  <span
                    data-enter
                    data-about-fact
                    className="text-[0.85rem] font-semibold text-brand-200"
                  >
                    {fact}
                  </span>
                </li>
              ))}
            </ul>

            <p
              data-enter
              data-about-body
              className="max-w-xl text-[1rem] leading-relaxed text-ink-invert-soft"
            >
              {aboutHero.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
