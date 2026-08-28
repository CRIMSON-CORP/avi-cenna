"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { faq, faqIntro, type FaqItem } from "@/lib/faq";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowIcon, ChevronIcon } from "@/components/ui/icons";

/**
 * Twelve questions in three groups, each group's name sitting in the left
 * margin beside its rows.
 *
 * The grouping is what makes twelve legible: three labels can be taken in at a
 * glance, and the label tells you which handful of rows is worth opening. The
 * label column is why this is not the plain stack of hairline rows the values
 * list on /about already uses — same restraint, different job.
 *
 * Rows open independently rather than one at a time. A parent comparing the
 * school hours against the lunch arrangements should not have to close one to
 * read the other, and nothing here is long enough for the section to run away.
 *
 * Closed rows are the default on purpose: the questions ARE the content at a
 * glance, and a wall of twelve open answers would say less than twelve
 * legible questions do.
 */
export function FaqList() {
  return (
    <section
      id={faqIntro.id}
      aria-labelledby="faq-heading"
      className="scroll-mt-24 bg-surface py-section"
    >
      <div className="shell">
        <Reveal>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-500">
            {faqIntro.eyebrow}
          </p>
          <h2
            id="faq-heading"
            className="mt-3 max-w-2xl font-display text-display-sm font-extrabold tracking-[-0.03em] text-ink"
          >
            {faqIntro.heading}
          </h2>
          <p className="mt-5 max-w-xl text-[1rem] leading-relaxed text-ink-body">
            {faqIntro.body}
          </p>
        </Reveal>

        <div className="mt-12 lg:mt-16">
          {faq.map((group, g) => (
            <Reveal key={group.label} delay={g * 0.06}>
              <div className="grid gap-x-16 gap-y-3 border-t border-brand-200 py-6 lg:grid-cols-[minmax(0,13rem)_1fr] lg:py-8">
                <h3 className="text-[0.72rem] font-bold uppercase tracking-widest text-brand-500 lg:sticky lg:top-28 lg:self-start">
                  {group.label}
                </h3>

                <ul>
                  {group.items.map((item) => (
                    <Row key={item.q} item={item} />
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Row({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const reduceMotion = useReducedMotion();

  return (
    <li className="border-b border-brand-100 last:border-b-0">
      <h4>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={panelId}
          className="focus-ring group flex w-full items-start justify-between gap-6 py-4 text-left"
        >
          <span
            className={cn(
              "font-display text-[1.02rem] font-semibold leading-snug tracking-tight transition-colors duration-base ease-out-expo",
              open ? "text-brand-600" : "text-ink group-hover:text-brand-600",
            )}
          >
            {item.q}
          </span>

          <span
            aria-hidden
            className={cn(
              "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-base ease-out-expo",
              open
                ? "border-brand-500 bg-brand-500 text-white"
                : "border-brand-200 text-brand-600 group-hover:border-brand-400",
            )}
          >
            <ChevronIcon className={cn("h-4 w-4 transition-transform duration-base ease-out-expo", open && "-rotate-180")} />
          </span>
        </button>
      </h4>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.34, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-5 pr-10 text-[0.95rem] leading-relaxed text-ink-body">
              {item.a}
            </p>

            {item.link && (
              <Link
                href={item.link.href}
                className="focus-ring group/link mb-5 inline-flex items-center gap-2 text-[0.85rem] font-bold text-brand-600 transition-colors duration-fast hover:text-brand-700"
              >
                {item.link.label}
                <ArrowIcon className="h-4 w-4 transition-transform duration-base ease-out-expo group-hover/link:translate-x-0.5" />
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
