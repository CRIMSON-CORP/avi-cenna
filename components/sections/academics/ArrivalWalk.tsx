"use client";

import { useCallback, useRef } from "react";
import { gsap, ScrollTrigger, useIsomorphicLayoutEffect } from "@/lib/gsap";
import { earlyYears } from "@/lib/academics";

/**
 * The walk in.
 *
 * The school describes a real route in one sentence: "From the door, they make
 * their way through a mini zoo and then take a walk down a high street, before
 * arriving at their learning hub for the day." That is a journey through an
 * actual place, in a fixed order, taken every morning — so the page walks it
 * rather than listing it. The line wanders because a corridor wanders, and
 * because the curve belongs to the same family as the blob masks used
 * elsewhere on the site; the ruler-straight rail is the academics ladder's
 * device, not this one.
 *
 * HOW THE PINS STAY ON THE CURVE
 *
 * They are not laid out at all — they are derived from the path. After layout,
 * the curve is sampled along its length, every sample is mapped from SVG user
 * space into page pixels through getScreenCTM(), and each pin is placed at the
 * sample whose y matches the vertical centre of its heading. So the pin cannot
 * drift off the line: its position IS a point on the line.
 *
 * Two details make that reliable rather than nearly-right:
 *
 *  - Headings are measured with offsetTop, not getBoundingClientRect. The stops
 *    animate in from a y-offset, and a bounding rect includes that transform —
 *    measuring it mid-reveal would pin to where a stop is passing through
 *    rather than where it lives. offsetTop is layout, so it ignores transforms.
 *
 *  - getScreenCTM() does the coordinate mapping instead of arithmetic on the
 *    viewBox. preserveAspectRatio="none" scales x and y by different amounts,
 *    and the matrix already knows both, so the maths cannot fall out of step
 *    with the CSS.
 *
 * Positions are recomputed on resize and once webfonts land, because both
 * change where the headings sit.
 *
 * Vertical rather than horizontal. Sideways scroll would match the idea more
 * literally, but hijacking the scroll axis is hostile on a desktop trackpad
 * and unpredictable inside a page already smooth-scrolled by Lenis.
 */

/** Sample count along the path. Enough that the nearest-y search lands within
    a pixel at any realistic section height, cheap enough to redo on resize. */
const SAMPLES = 600;

/**
 * Layout distance from `ancestor` down to `el`, summed up the offsetParent
 * chain.
 *
 * A single `el.offsetTop` is not enough: offsetTop is measured from the
 * nearest POSITIONED ancestor, and GSAP gives each stop a transform as it
 * animates in, which makes that stop a containing block and therefore the
 * heading's offsetParent. Read on its own, every heading then reports the same
 * offsetTop — its position inside its own stop — and every pin lands in the
 * same place. Walking the chain fixes that while keeping the measurement in
 * layout space, so it still ignores the transform itself.
 */
function layoutTopWithin(el: HTMLElement, ancestor: HTMLElement) {
  let top = 0;
  let node: HTMLElement | null = el;
  while (node && node !== ancestor) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return top;
}

export function ArrivalWalk() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { walk } = earlyYears;

  /** Places every pin on the curve. Safe to call as often as needed. */
  const placePins = useCallback(() => {
    const root = rootRef.current;
    const path = root?.querySelector<SVGPathElement>("[data-walk-path]");
    if (!root || !path) return;

    const ctm = path.getScreenCTM();
    if (!ctm) return;

    const rootRect = root.getBoundingClientRect();
    const total = path.getTotalLength();
    if (!total) return;

    /* Sample once per call, then reuse for every pin. */
    const points: { x: number; y: number }[] = [];
    for (let i = 0; i <= SAMPLES; i++) {
      const p = path.getPointAtLength((i / SAMPLES) * total);
      const screen = new DOMPoint(p.x, p.y).matrixTransform(ctm);
      points.push({ x: screen.x - rootRect.left, y: screen.y - rootRect.top });
    }

    const pins = root.querySelectorAll<HTMLElement>("[data-pin]");
    const headings = root.querySelectorAll<HTMLElement>("[data-stop-heading]");

    headings.forEach((heading, i) => {
      const pin = pins[i];
      if (!pin) return;

      /* Layout position, not visual — see the note above about transforms. */
      const targetY = layoutTopWithin(heading, root) + heading.offsetHeight / 2;

      let best = points[0];
      let bestDistance = Infinity;
      for (const point of points) {
        const distance = Math.abs(point.y - targetY);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = point;
        }
      }

      pin.style.transform = `translate(${best.x}px, ${best.y}px) translate(-50%, -50%)`;
      pin.style.opacity = "1";
    });
  }, []);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const path = root.querySelector<SVGPathElement>("[data-walk-path]");
      const stops = gsap.utils.toArray<HTMLElement>("[data-stop]", root);

      placePins();

      if (reduced) {
        if (path) gsap.set(path, { drawSVG: "100%" });
        gsap.set(stops, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(stops, { opacity: 0, y: 26 });

      if (path) {
        gsap.set(path, { drawSVG: "0%" });
        gsap.to(path, {
          drawSVG: "100%",
          ease: "none",
          scrollTrigger: { trigger: root, start: "top 70%", end: "bottom 70%", scrub: 0.5 },
        });
      }

      /* Each stop arrives on its own trigger rather than a shared stagger, so
         the reveal tracks where the reader actually is on the route. */
      stops.forEach((stop) => {
        gsap.to(stop, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "swoop",
          scrollTrigger: { trigger: stop, start: "top 82%", once: true },
        });
      });

      ScrollTrigger.refresh();
    }, root);

    /* Both of these move the headings, and therefore the pins. */
    const observer = new ResizeObserver(() => {
      placePins();
      ScrollTrigger.refresh();
    });
    observer.observe(root);

    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) placePins();
    });

    return () => {
      cancelled = true;
      observer.disconnect();
      ctx.revert();
    };
  }, [placePins]);

  return (
    <section aria-labelledby="walk-heading" className="scroll-mt-24 bg-surface py-section">
      <div className="shell">
        <p
          className="text-[0.7rem] font-bold uppercase tracking-[0.2em]"
          style={{ color: "var(--stage-ink)" }}
        >
          {walk.eyebrow}
        </p>
        <h2
          id="walk-heading"
          className="mt-3 max-w-xl font-display text-display-sm font-extrabold tracking-[-0.03em] text-ink"
        >
          {walk.heading}
        </h2>
        <p className="mt-4 text-[0.9rem] text-ink-muted">{walk.note}</p>

        {/* The left gutter holds the route; the copy is padded clear of its
            widest swing. The stops are plain blocks — nothing in the flow
            reserves space for a pin, because the pins are positioned onto the
            curve afterwards. */}
        <div ref={rootRef} className="relative mt-12 pl-14 sm:pl-28 lg:mt-16">
          <svg
            aria-hidden
            viewBox="0 0 64 1000"
            preserveAspectRatio="none"
            className="pointer-events-none absolute left-0 top-0 h-full w-12 sm:w-24"
          >
            <path
              data-walk-path
              d="M32,0 C32,90 14,130 14,220 C14,310 50,350 50,440 C50,530 14,570 14,660 C14,750 50,790 50,880 C50,940 32,970 32,1000"
              fill="none"
              stroke="var(--stage)"
              strokeWidth="2"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              opacity="0.55"
            />
          </svg>

          {/* Pins live outside the list flow so their placement can be purely
              a function of the curve. They start transparent because their
              first meaningful position only exists after measurement. */}
          {walk.stops.map((stop, i) => (
            <span
              key={`${stop.label}-pin`}
              data-pin
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 flex h-5 w-5 items-center justify-center rounded-full text-[0.62rem] font-bold text-white opacity-0 transition-opacity duration-slow"
              style={{ backgroundColor: "var(--stage)", willChange: "transform" }}
            >
              {i + 1}
            </span>
          ))}

          <ol>
            {walk.stops.map((stop) => (
              <li key={stop.label} data-stop className="pb-12 last:pb-0 lg:pb-16">
                <div className="max-w-xl">
                  <h3
                    data-stop-heading
                    className="font-display text-[clamp(1.35rem,1.1rem+1.1vw,1.9rem)] font-extrabold leading-tight tracking-[-0.025em] text-ink"
                  >
                    {stop.label}
                  </h3>
                  <p className="mt-2 text-[0.97rem] leading-relaxed text-ink-body">{stop.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
