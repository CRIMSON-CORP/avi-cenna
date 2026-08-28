"use client";

import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/ui/icons";

/**
 * The hero for a stage page — Early Years, Primary, Secondary.
 *
 * Deliberately not the navy panel the hub pages use. A stage page is a child
 * of /academics, and arriving on one should feel like stepping onto the floor
 * whose colour you just clicked on the homepage. So it takes its stage colour,
 * carries the floor number as an oversized mark, and reads as one level down.
 *
 * The panel is the stage TINT with dark ink, not the stage colour with white
 * on top. White on gold-500 is roughly 2:1 and white on brand-500 about 3:1 —
 * both fail WCAG AA for body text. Tinting the ground and keeping the colour
 * for accents says "this is the gold floor" just as clearly, and stays
 * readable. (The homepage StageStrip cards do set white on those colours and
 * have the same problem; worth revisiting separately.)
 */
export function StageHero({
  floor,
  eyebrow,
  heading,
  intro,
}: {
  floor: string;
  eyebrow: string;
  heading: { light: string; bold: string };
  intro: string;
}) {
  return (
    <section
      aria-labelledby="stage-hero-heading"
      /* Bottom spacing belongs to the hero — the section below is a full-bleed
         tinted band, and without this its colour begins flush against the
         panel's rounded bottom edge. */
      className="bg-surface pb-8 pt-[calc(var(--header-h)+0.75rem)] lg:pb-12"
    >
      <div className="shell">
        <Reveal y={20}>
          <div
            className="relative overflow-hidden rounded-panel px-6 py-12 sm:px-10 sm:py-14 lg:px-16 lg:py-16"
            style={{ backgroundColor: "var(--stage-tint)" }}
          >
            {/* The floor number, as a graphic mark rather than a label —
                the same device the homepage cards use, so the two read as
                the same system. */}
            <span
              aria-hidden
              className="pointer-events-none absolute -right-4 -top-10 select-none font-display text-[9rem] font-extrabold leading-none tracking-tighter opacity-[0.14] lg:text-[13rem]"
              style={{ color: "var(--stage)" }}
            >
              {floor}
            </span>

            <div className="relative">
              <Link
                href="/academics"
                className="focus-ring group inline-flex items-center gap-2 text-[0.78rem] font-bold uppercase tracking-[0.14em] transition-opacity hover:opacity-70"
                style={{ color: "var(--stage-ink)" }}
              >
                <ArrowIcon className="h-3.5 w-3.5 rotate-180 transition-transform duration-base ease-out-expo group-hover:-translate-x-0.5" />
                Academics
              </Link>

              <p
                className="mt-6 text-[0.7rem] font-bold uppercase tracking-[0.2em]"
                style={{ color: "var(--stage-ink)" }}
              >
                {eyebrow}
              </p>

              <h1
                id="stage-hero-heading"
                className="mt-4 max-w-3xl font-display text-[clamp(1.9rem,1.1rem+3.2vw,3.6rem)] leading-[1.08] tracking-[-0.03em] text-ink"
              >
                <span className="block font-extralight">{heading.light}</span>
                <span className="block font-extrabold">{heading.bold}</span>
              </h1>

              <p className="mt-8 max-w-xl border-t pt-8 text-[1rem] leading-relaxed text-ink-body"
                style={{ borderColor: "color-mix(in oklab, var(--stage) 25%, transparent)" }}
              >
                {intro}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
