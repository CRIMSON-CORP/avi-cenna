"use client";

import { motion, useReducedMotion } from "motion/react";
import { BLOB_ASPECT, pathFromCoords, SLIDE_SHAPES } from "@/lib/blob";

/**
 * The three amoebas in the corners of the page.
 *
 * They are the same traced outlines that mask the photograph in the homepage
 * hero — see lib/blob.ts — so the contact page is visibly the same family
 * rather than a page that went and found its own shapes.
 *
 * Hard-edged and flat, in the Material 3 way: no blur, no gradient, no glow.
 * A blurred shape reads as lighting, and lighting sits behind a page; a solid
 * one reads as an object, and objects are what make a page feel built out of
 * something. The second, offset copy behind each is what gives that object
 * thickness without reaching for a 3D render.
 *
 * TWO ELEMENTS PER BLOB, and it matters: the outer one springs in on load,
 * the inner one turns forever. Both animate `transform`, so a single element
 * would have the entrance and the rotation overwriting each other — the
 * bounce would be swallowed the moment the loop took the property.
 */

type Corner = {
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

export function Blobs() {
  const reduceMotion = useReducedMotion();

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
            <Blob shape={corner.shape} colour={corner.colour} />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

function Blob({ shape, colour }: { shape: number; colour: string }) {
  return (
    <svg viewBox="0 0 1 1" preserveAspectRatio="none" className={`h-full w-full ${colour}`}>
      {/* One shape, one flat fill. No blur, no gradient, no second copy behind
          it — the silhouette is the whole idea, and anything layered under it
          reads as a smudge rather than as depth. */}
      <path d={pathFromCoords(SLIDE_SHAPES[shape])} fill="currentColor" opacity={0.9} />
    </svg>
  );
}
