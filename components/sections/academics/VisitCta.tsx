"use client";

import { site } from "@/lib/site";
import { stageCta } from "@/lib/academics";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The closing band on every stage page.
 *
 * The old site scattered "BOOK A VISIT" buttons through the middle of the
 * curriculum copy — twice on the Secondary page, mid-sentence between Key
 * Stages. One call to action, at the end, after the reader has what they came
 * for. The coral is the site's action colour and stays that on every stage,
 * because a button that changes colour by page stops looking like a button.
 */
export function VisitCta() {
  return (
    <section className="bg-surface pb-section">
      <div className="shell">
        <Reveal>
          <div
            className="flex flex-col gap-6 rounded-panel p-8 sm:p-11 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:p-14"
            style={{ backgroundColor: "var(--stage-tint)" }}
          >
            <div className="max-w-xl">
              <h2 className="font-display text-[clamp(1.5rem,1.2rem+1.4vw,2.2rem)] font-extrabold leading-tight tracking-[-0.03em] text-ink">
                {stageCta.heading}
              </h2>
              <p className="mt-3 text-[0.97rem] leading-relaxed text-ink-body">
                {stageCta.body}
              </p>
            </div>

            <Button href={site.bookVisit} arrow className="shrink-0">
              Book a visit
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
