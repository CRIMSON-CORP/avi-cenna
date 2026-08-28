"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { affiliations } from "@/lib/site";

/**
 * "A community you can trust" — the school's four real accreditations, running
 * as a continuous marquee.
 *
 * The track renders the logo list TWICE and translates by exactly -50%, so the
 * second copy arrives precisely where the first started and the loop is
 * seamless — no measuring, no JS, and the animation is a single composited
 * transform rather than anything that repaints.
 *
 * Four logos is a short list, so each one is padded generously; a tight lane
 * would make the repeat obvious. Logos rest in greyscale and come to full
 * colour on hover, which keeps four competing brand palettes from fighting the
 * page, and the lane pauses on hover or focus so a logo can actually be read.
 */
export function CommunityTrust() {
  const reduceMotion = useReducedMotion();

  // Duplicated for the seamless loop. The clone is hidden from assistive tech
  // so screen readers hear each accreditation once.
  const lane = [
    { items: affiliations, clone: false },
    { items: affiliations, clone: true },
  ];

  return (
    <section
      className="bg-surface-alt py-(--spacing-section)"
      aria-labelledby="community-trust-heading"
    >
      <div className="shell">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-500">
            Accredited &amp; affiliated
          </p>
          <h2
            id="community-trust-heading"
            className="mt-3 font-display text-display-sm font-extrabold tracking-[-0.03em] text-ink"
          >
            A community you can trust.
          </h2>
        </motion.div>
      </div>

      {/* Full-bleed lane so logos can drift in and out of the viewport edges.
          A mask gradient softly fades both ends so logos dissolve rather than
          being sliced off by a hard edge. */}
      <div
        className="marquee group relative py-12 overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] lg:mt-16"
        style={{ "--marquee-duration": "38s" } as React.CSSProperties}
      >
        <ul className="marquee-track flex w-max items-stretch">
          {lane.map(({ items, clone }) =>
            items.map((item) => (
              <li
                key={`${clone ? "clone" : "orig"}-${item.id}`}
                aria-hidden={clone || undefined}
                className="px-3 sm:px-4"
              >
                <div className="flex h-24 w-56 items-center justify-center rounded-card border border-brand-100 bg-surface px-6 transition-all duration-base ease-out-expo hover:-translate-y-1 hover:border-brand-200 hover:shadow-card sm:h-28 sm:w-72">
                  <div className="relative h-full w-full">
                    <Image
                      src={item.src}
                      alt={clone ? "" : item.name}
                      fill
                      sizes="288px"
                      className="object-contain py-4 opacity-80 grayscale transition-[filter,opacity] duration-slow ease-out-expo hover:opacity-100 hover:grayscale-0"
                    />
                  </div>
                </div>
              </li>
            )),
          )}
        </ul>
      </div>
    </section>
  );
}
