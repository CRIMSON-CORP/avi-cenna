"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger, useIsomorphicLayoutEffect } from "@/lib/gsap";
import { academicsLadder, stageThemes, type Floor } from "@/lib/academics";
import { ArrowIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The page's spine, and the one idea it is built on.
 *
 * The school's own copy says each school is separated "not just by a physical
 * floor, but also by timetables". Age and altitude therefore run on the same
 * axis, so a single vertical line carries both readings at once: you descend
 * the building as you climb through the years. That is why this is a rail and
 * not a row of three cards.
 *
 * The line fills as you scroll and runs blue → gold → coral, which are the
 * colours the three stages already own on the homepage's StageStrip. Arriving
 * on a stage page then feels like stepping onto the floor you just watched
 * the line pass through.
 *
 * The fill is animated with clip-path rather than scaleY or height: scaling
 * would squash the gradient so the colours no longer line up with the floors
 * they belong to, and animating height would lay out on every scroll tick.
 * Clip-path leaves the gradient exactly where it is and only reveals it.
 *
 * This is also the one place on the site where numbering is earned — Key
 * Stages are a real sequence, and their order is information a parent needs.
 */
export function TheLadder() {
  const rootRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const fill = root.querySelector<HTMLElement>("[data-rail-fill]");
      const rows = gsap.utils.toArray<HTMLElement>("[data-floor]", root);

      if (!fill) return;

      if (reduced) {
        /* No scrubbing, but the line still has to be drawn and the floors
           still have to read as reached — the information is the point. */
        fill.style.clipPath = "inset(0% 0% 0% 0%)";
        rows.forEach((row) => row.setAttribute("data-reached", "true"));
        return;
      }

      const progress = { v: 0 };
      gsap.to(progress, {
        v: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top 72%",
          end: "bottom 65%",
          scrub: 0.4,
        },
        onUpdate: () => {
          fill.style.clipPath = `inset(0% 0% ${(1 - progress.v) * 100}% 0%)`;
        },
      });

      /* Each floor lights as the line reaches it. Separate triggers rather
         than thresholds derived from the scrub, so a floor is marked by where
         it actually is on screen and not by arithmetic that breaks the moment
         a card changes height. */
      rows.forEach((row) => {
        ScrollTrigger.create({
          trigger: row,
          start: "top 70%",
          onEnter: () => row.setAttribute("data-reached", "true"),
          onLeaveBack: () => row.removeAttribute("data-reached"),
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section aria-labelledby="ladder-heading" className="scroll-mt-24 bg-surface py-section">
      <div className="shell">
        <Reveal>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-500">
            {academicsLadder.eyebrow}
          </p>
          <h2
            id="ladder-heading"
            className="mt-3 max-w-xl font-display text-display-sm font-extrabold tracking-[-0.03em] text-ink"
          >
            {academicsLadder.heading}
          </h2>
          <p className="mt-5 max-w-2xl text-[1rem] leading-relaxed text-ink-body">
            {academicsLadder.body}
          </p>
        </Reveal>

        <div ref={rootRef} className="relative mt-12 lg:mt-16">
          {/* The rail sits under the first grid column, centred on the dots:
              the column is 0.875rem wide, so the line is at half of that. */}
          <span
            aria-hidden
            className="absolute bottom-2 left-1.75 top-2 w-px bg-brand-100"
          />
          <span
            aria-hidden
            data-rail-fill
            className="absolute bottom-2 left-1.75 top-2 w-px bg-linear-to-b from-brand-500 via-gold-500 to-accent-500"
            style={{ clipPath: "inset(0% 0% 100% 0%)" }}
          />

          <ul>
            {academicsLadder.floors.map((floor) => (
              <FloorRow key={floor.id} floor={floor} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function FloorRow({ floor }: { floor: Floor }) {
  return (
    <li
      data-floor
      style={stageThemes[floor.id]}
      className="group/floor relative grid grid-cols-[0.875rem_1fr] gap-x-5 pb-10 last:pb-0 sm:gap-x-8 lg:pb-14"
    >
      {/* The node. Hollow until the line reaches it, then filled — the only
          thing on the page that changes as you scroll past. */}
      <span
        aria-hidden
        className="mt-7 h-3.5 w-3.5 rounded-full border-2 bg-surface transition-colors duration-slow ease-out-expo group-data-[reached=true]/floor:bg-(--stage)"
        style={{ borderColor: "var(--stage)" }}
      />

      <Link
        href={floor.href}
        scroll
        className="focus-ring group/card rounded-panel border border-brand-100 p-6 transition-all duration-base ease-out-expo hover:-translate-y-1 hover:border-(--stage) hover:shadow-card sm:p-8"
      >
        <p
          className="text-[0.7rem] font-bold uppercase tracking-[0.2em]"
          style={{ color: "var(--stage-ink)" }}
        >
          Floor {floor.floor} · {floor.ages}
        </p>

        <h3 className="mt-3 font-display text-[clamp(1.5rem,1.2rem+1.3vw,2.2rem)] font-extrabold leading-tight tracking-[-0.03em] text-ink">
          {floor.name}
        </h3>

        <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-ink-body">{floor.blurb}</p>

        {/* Key Stages, in order. The order is the information. */}
        <ul className="mt-6 flex flex-wrap gap-2">
          {floor.keyStages.map((ks) => (
            <li
              key={ks.label}
              className="rounded-pill px-3 py-1.5 text-[0.75rem] font-semibold"
              style={{ backgroundColor: "var(--stage-tint)", color: "var(--stage-ink)" }}
            >
              <span className="font-bold">{ks.label}</span>
              <span className="ml-2 font-normal opacity-80">{ks.years}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-4 border-t border-brand-100 pt-5 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-md">
            <span className="block text-[0.8rem] font-bold" style={{ color: "var(--stage-ink)" }}>
              {floor.checkpoint.label}
            </span>
            <span className="mt-1 block text-[0.85rem] leading-relaxed text-ink-muted">
              {floor.checkpoint.note}
            </span>
          </p>

          <span className="flex shrink-0 items-center gap-3 text-[0.85rem] font-bold text-ink">
            Explore
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-transform duration-base ease-out-expo group-hover/card:scale-110"
              style={{ backgroundColor: "var(--stage)" }}
            >
              <ArrowIcon className="h-4 w-4" />
            </span>
          </span>
        </div>
      </Link>
    </li>
  );
}
