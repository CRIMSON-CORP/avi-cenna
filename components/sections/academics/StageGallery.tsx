"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { PhotoLightbox } from "@/components/ui/PhotoLightbox";
import { useClientSeed } from "@/lib/isomorphic";
import type { Gallery } from "@/lib/galleries";

/**
 * Photographs dropped on a table.
 *
 * Every image the school has is 3:2 landscape, so a grid of them reads as a
 * spreadsheet. Rotation and overlap are what make a handful of identical
 * rectangles look like objects rather than cells — and picking one up
 * straightens it, which is the whole gesture.
 *
 * WHY THE HIT AREA AND THE CARD ARE DIFFERENT ELEMENTS
 *
 * The obvious build — hover the card, move the card — oscillates forever. The
 * card travels out from under the pointer, which fires mouseleave, which sends
 * it home, which puts it back under the pointer, which fires mouseenter. So
 * the slot stays where it is and owns every pointer event; only the card
 * inside it moves. Hover state then cannot depend on how far the animation
 * has got.
 *
 * TRAVEL is capped for the same reason from the other side: at 0.55 of the
 * distance to the centre, plus the scale, a risen card still covers the point
 * the pointer is resting on, so what you are pointing at stays under you.
 *
 * A leave arriving mid-rise is held until the rise finishes rather than
 * reversing it halfway — sweeping across the pile should leave cards settling,
 * not stuttering.
 */

/** Card width, as a percentage of the container. */
const CARD_W = 44;
const CONTAINER_RATIO = 16 / 10;
const PHOTO_RATIO = 3 / 2;

/** Card height as a percentage of container HEIGHT — the unit the top offsets
    below are written in. */
const CARD_H = (CARD_W / PHOTO_RATIO) * CONTAINER_RATIO;

/** Fraction of the way to the centre a picked-up card travels. */
const TRAVEL = 0.55;

const RISE_MS = 420;

/** Degrees either side of straight. The floor matters as much as the ceiling:
    a card sitting at half a degree reads as a failed attempt at square rather
    than as something dropped. */
const TILT_MIN = 2.5;
const TILT_MAX = 6;

/** Rest positions as [left%, top%]. Hand-placed per count: three photographs
    want a cascade, four want a loose quadrant, and neither survives being
    generated. */
const SCATTER: Record<number, [number, number][]> = {
  3: [
    [2, 3],
    [53, 12],
    [26, 50],
  ],
  4: [
    [1, 1],
    [52, 7],
    [6, 47],
    [54, 51],
  ],
};

/** Integer hash rather than the usual sin-and-fract, which clusters badly over
    a handful of consecutive indices — four cards all leaning the same way. */
function hash(n: number) {
  let t = (n + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), 1 | t);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
}

function tilt(sign: number, amount: number) {
  return sign * (TILT_MIN + amount * (TILT_MAX - TILT_MIN));
}

/** Deterministic per index, so the server and the hydrating pass agree. The
    sign alternates rather than being rolled: a pile that happens to lean one
    way looks like a mistake, and with four cards that comes up often. */
function seededTilt(seed: number, index: number) {
  return tilt(index % 2 === 0 ? 1 : -1, hash(seed * 31 + index));
}

function freshTilt() {
  return tilt(Math.random() < 0.5 ? -1 : 1, Math.random());
}

export function StageGallery({ gallery }: { gallery: Gallery }) {
  const { photos } = gallery;
  const reduceMotion = useReducedMotion();

  const seed = useClientSeed(7);
  const [tilts, setTilts] = useState<Record<number, number>>({});
  const tiltOf = (i: number) => tilts[i] ?? seededTilt(seed, i);

  const [active, setActive] = useState<number | null>(null);
  /** The last card touched keeps the top of the pile, the way a photograph put
      back down does. Nothing to time, nothing to reset. */
  const [top, setTop] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);

  const riseTimer = useRef<number | null>(null);
  const pendingLeave = useRef(false);

  const positions = SCATTER[photos.length] ?? SCATTER[4];

  function drop(i: number) {
    setActive((current) => (current === i ? null : current));
    if (!reduceMotion) setTilts((current) => ({ ...current, [i]: freshTilt() }));
  }

  function enter(i: number) {
    pendingLeave.current = false;
    setActive(i);
    setTop(i);
    if (riseTimer.current) window.clearTimeout(riseTimer.current);
    riseTimer.current = window.setTimeout(() => {
      riseTimer.current = null;
      if (pendingLeave.current) {
        pendingLeave.current = false;
        drop(i);
      }
    }, RISE_MS);
  }

  function leave(i: number) {
    /* Still rising: remember the leave and act on it when the card lands. */
    if (riseTimer.current) {
      pendingLeave.current = true;
      return;
    }
    drop(i);
  }

  return (
    <section aria-labelledby="gallery-heading" className="bg-surface py-section">
      <div className="shell">
        <p
          className="text-[0.7rem] font-bold uppercase tracking-[0.2em]"
          style={{ color: "var(--stage-ink)" }}
        >
          {gallery.eyebrow}
        </p>
        <h2
          id="gallery-heading"
          className="mt-3 max-w-xl font-display text-display-sm font-extrabold tracking-[-0.03em] text-ink"
        >
          {gallery.heading}
        </h2>
        <p className="mt-4 max-w-lg text-[0.9rem] text-ink-muted">{gallery.note}</p>

        {/* Below sm the scatter is abandoned for a stack. There is no hover on
            a touch screen to drive it, and overlapping cards on a narrow screen
            only make targets harder to hit. The tilt stays, because that is
            style rather than motion. */}
        <ul className="mt-10 flex flex-col gap-6 sm:hidden">
          {photos.map((photo, i) => (
            <li key={photo.src} className={i % 2 === 0 ? "pr-5" : "pl-5"}>
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="focus-ring block w-full rounded-[0.3rem] bg-white p-2 shadow-lift"
                style={{ transform: `rotate(${tiltOf(i) * 0.5}deg)` }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes="100vw"
                  className="block aspect-[3/2] w-full object-cover"
                />
                <span className="block px-1 pb-0.5 pt-2 text-left text-[0.78rem] font-semibold text-ink-muted">
                  {photo.caption}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div
          className="relative mt-12 hidden aspect-[16/10] sm:block"
          /* A pointer leaving the whole table drops whatever is up, so a fast
             exit past the edge cannot strand a card at the centre. */
          onMouseLeave={() => active !== null && leave(active)}
        >
          {photos.map((photo, i) => {
            const [left, topPct] = positions[i];
            const isActive = active === i;

            /* Distance to the container centre, re-expressed as a share of the
               card's own box — the unit a percentage translate is measured
               against. */
            const liftX = ((50 - (left + CARD_W / 2)) * TRAVEL * 100) / CARD_W;
            const liftY = ((50 - (topPct + CARD_H / 2)) * TRAVEL * 100) / CARD_H;

            const transform =
              isActive && !reduceMotion
                ? `translate(${liftX}%, ${liftY}%) rotate(0deg) scale(1.06)`
                : `translate(0, 0) rotate(${tiltOf(i)}deg) scale(1)`;

            return (
              <div
                key={photo.src}
                className="absolute"
                style={{
                  left: `${left}%`,
                  top: `${topPct}%`,
                  width: `${CARD_W}%`,
                  zIndex: top === i ? photos.length + 1 : i,
                }}
                onMouseEnter={() => enter(i)}
                onMouseLeave={() => leave(i)}
                onFocus={() => enter(i)}
                onBlur={() => leave(i)}
              >
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-label={`View ${photo.caption} full size`}
                  className="focus-ring block w-full cursor-pointer rounded-[0.3rem] bg-white p-2.5 will-change-transform"
                  style={{
                    transform,
                    transformOrigin: "center",
                    transition: reduceMotion
                      ? "box-shadow 200ms ease"
                      : `transform ${RISE_MS}ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow ${RISE_MS}ms ease`,
                    boxShadow: isActive
                      ? "0 24px 48px -12px rgb(16 54 92 / 0.34), 0 4px 10px -2px rgb(16 54 92 / 0.16)"
                      : "0 2px 4px -1px rgb(16 54 92 / 0.16), 0 10px 22px -10px rgb(16 54 92 / 0.24)",
                  }}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    sizes="(min-width: 1024px) 40vw, 50vw"
                    className="block aspect-[3/2] w-full object-cover"
                  />
                  <span className="block px-0.5 pb-0.5 pt-2 text-left text-[0.8rem] font-semibold text-ink-muted">
                    {photo.caption}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <PhotoLightbox photos={photos} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </section>
  );
}
