"use client";

import { motion, useReducedMotion } from "motion/react";
import { ptaCommittee, type Seat } from "@/lib/pta";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * The six posts, as place cards standing on a table.
 *
 * The old page lists them as six bullets with "(Parent member)" or "(Teacher
 * member)" in brackets after each. Two things are buried in that list and
 * both are the point of the association:
 *
 *   THE SPLIT     three seats each. Carried here by the marker beside every
 *                 post, so the balance is countable at a glance instead of
 *                 being parsed out of six sets of brackets.
 *
 *   ELECTED vs    the six are elected; a class representative is *appointed*,
 *   APPOINTED     and the seat stands whether or not a year group fills it.
 *                 That is the difference between a solid card and an empty
 *                 outline, drawn rather than footnoted.
 *
 * The table is one hairline per row, and the cards have no bottom border —
 * they meet the line instead, which is what makes them read as standing on it
 * rather than floating above it. Columns carry their own padding and the grid
 * has no column gap, so the line runs unbroken from edge to edge of the row.
 *
 * On arrival each card is set down: a small drop and a degree or two of
 * rotation resolving to square, pivoting on the fold at its top edge. It is
 * the page's one orchestrated moment; everything around it holds still.
 */

const SETTLE = { duration: 0.55, ease: [0.34, 1.4, 0.64, 1] } as const;

/** Cell padding, matched by the negative inset on nothing — the grid simply
    has no column gap, so each cell's border runs the full column width. */
const CELL = "relative border-b border-brand-300 px-3 pb-0";

export function Committee() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id={ptaCommittee.id}
      aria-labelledby="pta-committee-heading"
      className="scroll-mt-24 bg-surface-alt py-section"
    >
      <div className="shell">
        <Reveal>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-500">
            {ptaCommittee.eyebrow}
          </p>
          <h2
            id="pta-committee-heading"
            className="mt-3 max-w-2xl font-display text-display-sm font-extrabold tracking-[-0.03em] text-ink"
          >
            {ptaCommittee.heading}
          </h2>
          <p className="mt-5 max-w-2xl text-[1rem] leading-relaxed text-ink-body">
            {ptaCommittee.body}
          </p>
        </Reveal>

        <motion.ul
          initial={reduceMotion ? false : "down"}
          whileInView="set"
          viewport={{ once: true, margin: "-70px" }}
          variants={{ set: { transition: { delayChildren: 0.1, staggerChildren: 0.07 } } }}
          className="mt-12 grid gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3"
        >
          {ptaCommittee.seats.map((seat, i) => (
            <motion.li
              key={seat.post}
              variants={{
                down: { opacity: 0, y: -20, rotate: i % 2 === 0 ? -1.6 : 1.6 },
                set: { opacity: 1, y: 0, rotate: 0, transition: SETTLE },
              }}
              className={cn(CELL, "origin-top")}
            >
              <PlaceCard seat={seat} />
            </motion.li>
          ))}

          {/* The seventh seat, which is not one of the six. Given a row of its
              own rather than a seventh cell — being set apart IS the fact. */}
          <motion.li
            variants={{
              down: { opacity: 0, y: -16 },
              set: { opacity: 1, y: 0, transition: SETTLE },
            }}
            className={cn(CELL, "sm:col-span-2 lg:col-span-3")}
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:gap-8">
              <div className="relative w-full rounded-t-card border border-b-0 border-dashed border-brand-300 px-5 pb-5 pt-9 sm:max-w-72">
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-3.5 rounded-t-card border-b border-dashed border-brand-300 bg-brand-100/40"
                />
                <p className="font-display text-[1.15rem] font-semibold leading-snug tracking-tight text-brand-700">
                  {ptaCommittee.classRep.post}
                </p>
                <p className="mt-2 text-[0.72rem] font-bold uppercase tracking-widest text-ink-muted">
                  Appointed
                </p>
              </div>
              <p className="max-w-md pb-1 text-[0.95rem] leading-relaxed text-ink-body sm:pb-5">
                {ptaCommittee.classRep.note}
              </p>
            </div>
          </motion.li>
        </motion.ul>
      </div>
    </section>
  );
}

function PlaceCard({ seat }: { seat: Seat }) {
  const isParent = seat.held === "parent";

  return (
    <div className="group relative">
      {/* The contact shadow. Not a card shadow — it is the reason the card
          looks like it is standing on the line rather than printed on it, so
          it stays tight to the base and never becomes a lift. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 bottom-0 h-2.5 rounded-[50%] bg-ink/18 blur-[6px]"
      />

      <div className="relative rounded-t-card border border-b-0 border-brand-100 bg-surface transition-transform duration-base ease-out-expo group-hover:-translate-y-0.5">
        {/* The fold: the back half of the card showing over the top edge, and
            the crease it turns on. Without the crease line the band reads as a
            gradient that faded out rather than as a second surface. */}
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-3.5 rounded-t-card border-b border-brand-200 bg-brand-100"
        />

        <div className="px-5 pb-5 pt-9">
          <h3 className="font-display text-[1.15rem] font-extrabold leading-snug tracking-tight text-ink">
            {seat.post}
          </h3>
          <p
            className={cn(
              "mt-2 flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-widest",
              isParent ? "text-accent-600" : "text-brand-600",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "h-1.5 w-1.5 shrink-0 rounded-full",
                isParent ? "bg-accent-500" : "bg-brand-500",
              )}
            />
            {ptaCommittee.held[seat.held]}
          </p>
        </div>
      </div>
    </div>
  );
}
