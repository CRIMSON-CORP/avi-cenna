"use client";

import { motion, useReducedMotion } from "motion/react";
import { BLOB_ASPECT, blobVariant, pathFromCoords } from "@/lib/blob";
import { useClientSeed } from "@/lib/isomorphic";
import { Blobs } from "@/components/ui/Blobs";
import { Button } from "@/components/ui/Button";

/**
 * The 404.
 *
 * The middle character is not a zero. It is one of the traced amoebas — the
 * same outline that masks the homepage hero photograph and scatters across the
 * corners of /contact — turning slowly between a blue four and a gold one.
 *
 * That is the whole idea of the page rather than a decoration on it: what is
 * being reported is a hole where a page should be, and the shape standing in
 * that hole is the site's own. A typed zero would have said the same thing in
 * a voice belonging to nobody.
 *
 * The corner blobs come along from /contact so the two dark pages read as one
 * treatment, but they are held back to two thirds opacity here. On /contact
 * they are the only thing in the margins; here there is something in the
 * middle that has to win.
 *
 * The copy states what happened and stops. No apology, no joke, and one way
 * out — a visitor who has just hit a dead end wants the door, not a menu.
 */

/** Shared by the two numerals and the shape between them, so the three land
    as one object rather than as three things that happen to be adjacent. */
const POP = {
  hidden: { opacity: 0, scale: 0.4, y: 30 },
  shown: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 140, damping: 12, mass: 0.8 },
  },
};

const RISE = {
  hidden: { opacity: 0, y: 20 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

/* Plus Jakarta Sans stops at 800, so there is no heavier cut to reach for —
   the extra weight comes from size and from closing the letterspacing up
   until the two numerals and the shape read as one solid mass. */
const GLYPH =
  "block font-display font-extrabold leading-none tracking-[-0.08em] text-[clamp(9rem,34vw,24rem)]";

export function NotFound() {
  const reduceMotion = useReducedMotion();
  /* The zero gets its own roll, separate from the corners, so the character
     in the middle of the page is never a repeat of one in the margins. */
  const zero = useClientSeed(3);

  return (
    <section
      data-page-theme="dark"
      className="relative isolate flex min-h-svh items-center overflow-hidden bg-surface-deep pb-section pt-[calc(var(--header-h)+2rem)]"
    >
      <div className="opacity-100">
        <Blobs seed={31} />
      </div>

      <motion.div
        className="shell relative z-10 flex w-full flex-col items-center text-center"
        initial={reduceMotion ? false : "hidden"}
        animate="shown"
        transition={{ delayChildren: 0.1, staggerChildren: 0.11 }}
      >
        {/* The heading a screen reader gets. The arrangement below is a
            picture of it — two glyphs and a shape — and says nothing on its
            own, so it is hidden from the accessibility tree entirely. */}
        <h1 className="sr-only">404 — page not found</h1>

        <div aria-hidden className="flex items-center justify-center gap-2 sm:gap-4">
          <motion.span variants={POP} className={`${GLYPH} text-brand-300`}>
            4
          </motion.span>

          <motion.span
            variants={POP}
            /* Sized against the cap height of the numerals beside it rather
               than against the viewport, so the three stay in proportion at
               every width. */
            className="block w-[clamp(7.2rem,27vw,18.5rem)]"
            style={{ aspectRatio: BLOB_ASPECT }}
          >
            <motion.span
              className="block h-full w-full"
              animate={reduceMotion ? undefined : { rotate: 360 }}
              transition={
                reduceMotion ? undefined : { duration: 26, ease: "linear", repeat: Infinity }
              }
            >
              <svg
                viewBox="0 0 1 1"
                preserveAspectRatio="none"
                className="h-full w-full text-accent-500"
              >
                <path d={pathFromCoords(blobVariant(zero))} fill="currentColor" />
              </svg>
            </motion.span>
          </motion.span>

          <motion.span variants={POP} className={`${GLYPH} text-gold-400 -ml-8`}>
            4
          </motion.span>
        </div>

        <motion.p
          variants={RISE}
          className="mt-10 font-display text-[clamp(1.5rem,1.2rem+1.4vw,2.2rem)] font-extrabold tracking-[-0.03em] text-white"
        >
          That page isn&rsquo;t here.
        </motion.p>

        <motion.p
          variants={RISE}
          className="mt-4 max-w-md text-[1rem] leading-relaxed text-ink-invert-soft"
        >
          The address doesn&rsquo;t lead anywhere on this site. It may have moved, or it may never
          have existed.
        </motion.p>

        <motion.div variants={RISE} className="mt-9">
          <Button href="/" arrow>
            Back to the homepage
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
