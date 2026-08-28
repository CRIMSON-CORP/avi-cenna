"use client";

import { Reveal } from "@/components/ui/Reveal";

/**
 * The navy panel hero used by every secondary page.
 *
 * Factored out at the third instance: /about, /careers and /academics all
 * want the same composition — eyebrow, a headline that turns from extralight
 * to extrabold at the same size, supporting copy, and an optional line of
 * facts. Left as three copies they would drift, and the weight break is the
 * one typographic idea holding these pages together.
 *
 * Navy sits in a panel rather than running full bleed because the fixed
 * header's logo is dark artwork and would disappear against a dark backdrop.
 *
 * The About hero is deliberately NOT built on this: it runs an orchestrated
 * GSAP entrance because it opens the site's main story. Repeating that on
 * every page is how a signature turns into a tic.
 */
export function PageHero({
  eyebrow,
  headline,
  body,
  facts,
}: {
  eyebrow: string;
  headline: { light: string; bold: string };
  body: string;
  facts?: readonly string[];
}) {
  return (
    <section
      aria-labelledby="page-hero-heading"
      /* The panel owns the space beneath it. Without pb, the section ends on
         the panel's rounded bottom edge, so any following section that has a
         background of its own starts its colour flush against that curve —
         which reads as a mistake. Relying on the next section to bring its own
         top padding works only until one of them doesn't. */
      className="bg-surface pb-8 pt-[calc(var(--header-h)+0.75rem)] lg:pb-12"
    >
      <div className="shell">
        <Reveal y={20}>
          <div className="relative overflow-hidden rounded-panel bg-surface-deep px-6 py-14 shadow-lift sm:px-10 sm:py-16 lg:px-16 lg:py-20">
            {/* One soft brand glow, so the navy has depth without decoration. */}
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
                {eyebrow}
              </p>

              <h1
                id="page-hero-heading"
                className="mt-6 font-display text-[clamp(2.1rem,1.1rem+3.9vw,4.2rem)] leading-[1.08] tracking-[-0.03em]"
              >
                <span className="block font-extralight text-brand-200">{headline.light}</span>
                <span className="block font-extrabold text-white">{headline.bold}</span>
              </h1>

              <p className="mt-8 max-w-xl border-t border-white/12 pt-8 text-[1rem] leading-relaxed text-ink-invert-soft">
                {body}
              </p>

              {facts && facts.length > 0 && (
                <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                  {facts.map((fact) => (
                    <li key={fact} className="flex items-center gap-2.5">
                      <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-gold-400" />
                      <span className="text-[0.85rem] font-semibold text-brand-200">{fact}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
