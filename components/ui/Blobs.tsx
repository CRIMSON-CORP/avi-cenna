"use client";

import { motion, useReducedMotion } from "motion/react";
import { BLOB_ASPECT, blobVariant, pathFromCoords } from "@/lib/blob";
import { useClientSeed } from "@/lib/isomorphic";

/**
 * The three amoebas in the corners of a dark page — /contact and the 404.
 *
 * The outlines are deformed out of the same traced source that masks the
 * photograph in the homepage hero — see `blobVariant` in lib/blob.ts — so they
 * are family rather than shapes this page went and found somewhere else.
 *
 * FRESH SHAPES PER VISIT, WITHOUT A HYDRATION MISMATCH. `useClientSeed`
 * renders `seed` on the server and through the hydrating pass, so both sides
 * of the wire agree exactly; once hydration is done it hands back a random
 * number instead and the shapes are redrawn. See lib/isomorphic.ts.
 *
 * The blobs arrive at `scale: 0`, so the seeded silhouettes are never visible
 * on the way past — the swap lands while there is nothing on screen to swap.
 *
 * Someone with JavaScript off keeps the seeded shapes, which is why they are
 * chosen values rather than an arbitrary pair.
 */

type Corner = {
  /** Offset from the page seed, so the three corners never coincide. */
  shape: number;
  /** Where it sits, and how big. Positions run well past the edge on purpose:
      a blob that fits entirely on screen reads as a sticker, one that runs
      off it reads as a shape the page is a window onto. */
  className: string;
  colour: string;
  /** Seconds for one full turn. Unequal and non-multiples, so the three never
      fall into step and start reading as one rotating object. */
  spin: number;
  direction: 1 | -1;
  delay: number;
};

const CORNERS: Corner[] = [
  {
    shape: 0,
    className: "-left-[18%] -top-[26%] w-[58%] sm:w-[45%] lg:w-[34%]",
    colour: "text-brand-500",
    spin: 44,
    direction: 1,
    delay: 0,
  },
  {
    shape: 1,
    className: "-right-[20%] -top-[30%] w-[53%] sm:w-[40%] lg:w-[30%]",
    colour: "text-accent-500",
    spin: 57,
    direction: -1,
    delay: 0.1,
  },
  {
    shape: 2,
    className: "-bottom-[28%] -right-[14%] w-[62%] sm:w-[46%] lg:w-[35%]",
    colour: "text-gold-400",
    spin: 68,
    direction: 1,
    delay: 0.2,
  },
];

export function Blobs({ seed = 0 }: { seed?: number }) {
  const reduceMotion = useReducedMotion();
  /* One roll for the page, spread across the corners below, so the three are
     always drawn from the same visit rather than three unrelated dice. */
  const roll = useClientSeed(seed);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {CORNERS.map((corner) => (
        <motion.div
          key={corner.shape}
          className={`absolute origin-center ${corner.className}`}
          style={{ aspectRatio: BLOB_ASPECT }}
          /* The arrival. A spring rather than a duration, because the brief is
             a bounce and an eased scale is not one — the overshoot is the
             whole character. It grows from the middle of its own silhouette,
             so each blob swells into place rather than sliding in from a
             corner it was parked behind. */
          initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 120, damping: 11, mass: 0.9, delay: corner.delay }
          }
        >
          <motion.div
            className="h-full w-full"
            /* The turn. Never ends, so it must never be the thing a reader has
               to look past — which is why these live at the edges and the
               content sits in a column between them. */
            animate={reduceMotion ? undefined : { rotate: corner.direction * 360 }}
            transition={
              reduceMotion
                ? undefined
                : { duration: corner.spin, ease: "linear", repeat: Infinity }
            }
          >
            <Blob seed={roll + corner.shape * 17} colour={corner.colour} />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

function Blob({ seed, colour }: { seed: number; colour: string }) {
  return (
    <svg viewBox="0 0 1 1" preserveAspectRatio="none" className={`h-full w-full ${colour}`}>
      {/* One shape, one flat fill. No blur, no gradient, no second copy behind
          it — the silhouette is the whole idea, and anything layered under it
          reads as a smudge rather than as depth. */}
      <path d={pathFromCoords(blobVariant(seed))} fill="currentColor" opacity={0.9} />
    </svg>
  );
}
