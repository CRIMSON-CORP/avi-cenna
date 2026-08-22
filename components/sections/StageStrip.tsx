"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { stages } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ArrowIcon } from "@/components/ui/icons";

/**
 * The three age groups, rebuilt as bold numbered cards.
 *
 * Each stage owns a colour from the palette, and the stage number is set as an
 * oversized graphic mark rather than a label — big enough to read as a shape
 * first and a numeral second. The number sits behind the copy at low opacity
 * and slides up on hover, which gives the card somewhere to go without moving
 * any of the text a reader might be mid-sentence on.
 */

const themes = [
  {
    // Early Years — school blue
    card: "bg-brand-500",
    numeral: "text-white/25",
    age: "text-brand-100",
    body: "text-white/80",
    chip: "bg-white/15 text-white group-hover:bg-white group-hover:text-brand-600",
  },
  {
    // Primary — gold
    card: "bg-gold-500",
    numeral: "text-white/30",
    age: "text-white",
    body: "text-white/85",
    chip: "bg-white/20 text-white group-hover:bg-white group-hover:text-gold-600",
  },
  {
    // Secondary — coral
    card: "bg-accent-500",
    numeral: "text-white/25",
    age: "text-accent-100",
    body: "text-white/85",
    chip: "bg-white/15 text-white group-hover:bg-white group-hover:text-accent-600",
  },
] as const;

export function StageStrip() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="stages-heading"
      className="bg-surface pb-(--spacing-section) pt-(--spacing-section)"
    >
      <div className="shell">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-500">
              Three stages, one school
            </p>
            <h2
              id="stages-heading"
              className="mt-3 font-display text-display-sm font-extrabold tracking-[-0.03em] text-ink"
            >
              From first steps to final exams.
            </h2>
          </div>
          <p className="max-w-sm text-[0.95rem] leading-relaxed text-ink-body">
            Children join us from two and a half and can stay right through to
            IGCSE — with the same people watching them grow.
          </p>
        </div>

        <ul className="mt-10 grid gap-4 md:grid-cols-3 lg:mt-14">
          {stages.map((stage, i) => {
            const theme = themes[i % themes.length];
            return (
              <motion.li
                key={stage.href}
                initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  delay: reduceMotion ? 0 : i * 0.1,
                  duration: 0.65,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Link
                  href={stage.href}
                  className={cn(
                    "focus-ring group relative flex h-full flex-col overflow-hidden rounded-panel p-7 lg:p-8",
                    "transition-all duration-base ease-out-expo hover:-translate-y-1.5 hover:shadow-lift",
                    theme.card,
                  )}
                >
                  {/* Oversized numeral, sitting behind the copy. */}
                  <span
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute -right-2 -top-8 select-none font-display text-[8rem] font-extrabold leading-none tracking-tighter",
                      "transition-transform duration-slow ease-out-expo group-hover:-translate-y-2 lg:text-[10rem]",
                      theme.numeral,
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="relative flex h-full flex-col">
                    <span
                      className={cn(
                        "text-[0.75rem] font-bold uppercase tracking-[0.14em]",
                        theme.age,
                      )}
                    >
                      {stage.age}
                    </span>

                    <span className="mt-2 font-display text-[1.6rem] font-extrabold leading-tight tracking-[-0.02em] text-white lg:text-[1.8rem]">
                      {stage.label}
                    </span>

                    <span className={cn("mt-3 text-[0.95rem] leading-relaxed", theme.body)}>
                      {stage.blurb}
                    </span>

                    <span className="mt-8 flex items-center gap-3 lg:mt-10">
                      <span
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-base ease-out-expo",
                          theme.chip,
                        )}
                      >
                        <ArrowIcon className="h-4 w-4 transition-transform duration-base ease-out-expo group-hover:translate-x-0.5" />
                      </span>
                      <span className="text-[0.85rem] font-bold text-white">Explore</span>
                    </span>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
