"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, useIsomorphicLayoutEffect } from "@/lib/gsap";
import { aboutLeadership, type Leader, type LeaderSocials } from "@/lib/about";
import { FacebookIcon, InstagramIcon, LinkedInIcon, XIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The leadership team, with a liquid reveal.
 *
 * Hovering a card fills it like a glass: translucent navy rises from the
 * bottom behind a moving wave, overshoots, settles just short of the brim,
 * and the social icons spring up through it in sequence. Leaving drains it.
 *
 * WHY IT STOPS SHORT OF THE TOP
 *
 * Because otherwise there is no water — only a navy rectangle. Fill the card
 * completely and the surface ends up above its top edge, so the wave is seen
 * only during the one second of the rise and the rest of the hover is a flat
 * wash. Resting the waterline inside the card keeps the surface on screen for
 * as long as anyone is looking at it, which is the only thing that makes the
 * motion below worth having.
 *
 * WHY THE MOTION IS SPLIT ACROSS THREE GROUPS
 *
 * Each does exactly one thing, and all three run at once:
 *
 *   data-level    how full the card is — the only part the timeline drives
 *   data-surface  the tilt and the bob, the water's own restlessness
 *   data-travel   the profile drifting leftward, forever
 *
 * Sharing an element would mean sharing a transform, and each motion would
 * stall whenever another was writing to it. Split, the surface can rock while
 * it climbs while the crests slide through it.
 *
 * Travel on its own is what this card had, and it read as a conveyor belt: a
 * rigid profile passing by at a constant height. The tilt is the fix. It is
 * the trick from the CSS pen that rotates an oversized squircle behind a
 * circular mask, applied to our own path rather than to the shape of the
 * fill — done their way on a 4:5 card, the card spans well under one
 * wavelength of the rotating shape and the wave flattens into a tilting
 * plane. This way we get the rock and keep the two wavelengths.
 *
 * One timeline per card, played and reversed rather than two one-shot
 * animations. Pulling the mouse away mid-fill drains from wherever the liquid
 * actually is instead of snapping to full and falling, which is the entire
 * difference between this feeling fluid and feeling mechanical.
 */

/* One period is 50 units, so two full waves cross the 100-wide viewBox — a
   single wavelength stretched over the whole card reads as a tilted straight
   edge, not water. The path carries four periods (0–200) so drifting it left
   by exactly one period lands the next crest where the last one was: the
   travel is seamless and can loop forever.

   A cubic reaches only 29% of its control points — not the three quarters an
   earlier note here claimed — so ±12 buys a surface deviating ±3.5 units,
   about 12px on a card this size. The path runs far past the bottom of the
   box, so there is always fill beneath the crest at any level. */
const PERIOD = 50;

const WAVE =
  "M0,0 C12.5,-12 37.5,12 50,0 C62.5,-12 87.5,12 100,0 C112.5,-12 137.5,12 150,0 C162.5,-12 187.5,12 200,0 L200,240 L0,240 Z";

/* The two resting levels, in viewBox units down from the top of the card.

   FULL sits inside the card on purpose — see the note on the component. The
   surface wanders ±3.5 from the wave, ±2.2 from the tilt out at the card's
   edges and ±2 from the bob, so at 10 it swings between roughly 2 and 18 and
   never leaves the card in either direction.

   EMPTY has to clear that same swing below the bottom edge, or a crest shows
   as a navy sliver along the bottom of every card at rest. */
const EMPTY = 112;
const FULL = 10;

/** Degrees either side of level. Small: at ±2.5° the card's edges rise and
    fall about 2.2 units, which is a rock rather than a listing ship. */
const TILT = 2.5;

/** Units the whole surface lifts and drops, bodily, on top of everything. */
const BOB = 2;

export function Leadership() {
  return (
    <section
      id={aboutLeadership.id}
      aria-labelledby="about-leadership-heading"
      className="scroll-mt-24 bg-surface-alt py-section"
    >
      <div className="shell">
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-lg">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-500">
                {aboutLeadership.eyebrow}
              </p>
              <h2
                id="about-leadership-heading"
                className="mt-3 font-display text-display-sm font-extrabold tracking-[-0.03em] text-ink"
              >
                {aboutLeadership.heading}
              </h2>
            </div>
            <p className="max-w-sm text-[0.95rem] leading-relaxed text-ink-body">
              {aboutLeadership.body}
            </p>
          </div>
        </Reveal>

        <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-3 lg:mt-14 lg:grid-cols-4">
          {aboutLeadership.people.map((person, i) => (
            <Reveal as="li" key={person.id} delay={(i % 4) * 0.07}>
              <PersonCard person={person} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- socials -- */

const PLATFORMS = [
  { key: "linkedin", label: "LinkedIn", Icon: LinkedInIcon },
  { key: "x", label: "X", Icon: XIcon },
  { key: "facebook", label: "Facebook", Icon: FacebookIcon },
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
] as const;

/** Only the platforms this person actually has, in a consistent order. */
function linksFor(socials: LeaderSocials | undefined) {
  if (!socials) return [];
  return PLATFORMS.flatMap((p) => {
    const href = socials[p.key];
    return href ? [{ ...p, href }] : [];
  });
}

/** "Ajiri Kono-Ugen" -> "AK". Hyphenated surnames stay one word, as intended. */
function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/* ------------------------------------------------------------------ card -- */

function PersonCard({ person }: { person: Leader }) {
  const links = linksFor(person.socials);
  const [active, setActive] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const loops = useRef<gsap.core.Tween[]>([]);

  useIsomorphicLayoutEffect(() => {
    if (!links.length || !rootRef.current) return;
    const root = rootRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const level = root.querySelector("[data-level]");
      const surface = root.querySelector("[data-surface]");
      const travel = root.querySelector("[data-travel]");
      const icons = gsap.utils.toArray<HTMLElement>("[data-social]", root);

      gsap.set(level, { y: EMPTY });
      /* The pivot is the middle of the waterline in the surface group's own
         coordinates, so the water see-saws about its centre rather than
         swinging from a corner off the side of the card. Both surface loops
         start at one end of their travel, which is where the paused surface
         sits while nobody is hovering. */
      gsap.set(surface, { svgOrigin: "50 0", rotation: -TILT, y: -BOB });
      gsap.set(icons, { opacity: 0, scale: 0.5, y: 16 });

      const tl = gsap.timeline({ paused: true });

      if (reduced) {
        /* No rise, no drift — the reveal still has to happen, it just happens
           as a cross-fade. */
        tl.to(level, { y: FULL, duration: 0.001 }).to(icons, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.2,
        });
        timeline.current = tl;
        return;
      }

      /* The water's own motion, independent of how full the card is, so all
         of it carries on once the level has settled.

         The three periods are 2.4s, 9s and 5.6s — a yoyo takes twice its
         duration to come back — and share no useful common multiple, so the
         combination does not visibly repeat while anyone is looking at it.
         Equal or harmonic periods would fall into step within a few seconds
         and the surface would start reading as one rigid object again.

         Only ticking while a card is actually hovered: a dozen of these
         compositing behind untouched cards is a cost with nothing on screen
         to show for it. */
      loops.current = [
        gsap.to(travel, {
          x: -PERIOD,
          duration: 2.4,
          ease: "none",
          repeat: -1,
          paused: true,
        }),
        gsap.to(surface, {
          rotation: TILT,
          duration: 4.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          paused: true,
        }),
        gsap.to(surface, {
          y: BOB,
          duration: 2.8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          paused: true,
        }),
      ];

      tl
        /* back.out rather than an in-out: the level runs about six units past
           FULL and comes back, so the water arrives with weight behind it.
           The old ease decelerated into a dead stop, which is a good part of
           why the whole thing felt mechanical. */
        .to(level, { y: FULL, duration: 1.15, ease: "back.out(1.1)" }, 0)
        /* Icons break the surface before the fill has finished rising. */
        .to(
          icons,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.07,
            ease: "back.out(2)",
          },
          0.5,
        )
        .eventCallback("onReverseComplete", () => {
          loops.current.forEach((l) => l.pause());
        });

      timeline.current = tl;
    }, root);

    return () => {
      ctx.revert();
      timeline.current = null;
      loops.current = [];
    };
  }, [links.length]);

  useEffect(() => {
    const tl = timeline.current;
    if (!tl) return;
    if (active) {
      loops.current.forEach((l) => l.play());
      tl.timeScale(1).play();
    } else {
      /* Draining is quicker than filling — waiting out a full reverse feels
         like the card is holding on to you. */
      tl.timeScale(1.4).reverse();
    }
  }, [active]);

  return (
    <article
      className="group"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      /* Focus bubbles in React, so tabbing into any icon fills the card and
         a keyboard user sees exactly what a mouse user sees. */
      onFocus={() => setActive(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setActive(false);
      }}
      /* Touch has no hover: the first tap fills the card, which is also what
         makes the links reachable, since they are inert until it is open. A
         mouse is already covered by hover, and toggling on click there would
         drain the card out from under the cursor. */
      onClick={() => {
        if (!links.length) return;
        if (window.matchMedia("(hover: hover)").matches) return;
        setActive((a) => !a);
      }}
    >
      <div ref={rootRef} className="relative aspect-4/5 overflow-hidden rounded-card bg-brand-100">
        {person.photo ? (
          <Image src={person.photo} alt="" fill className="object-cover object-top" unoptimized />
        ) : (
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-brand-100 to-brand-200 font-display text-[2.6rem] font-extralight tracking-[-0.02em] text-brand-600"
          >
            {initialsOf(person.name)}
          </span>
        )}

        {links.length > 0 && (
          <>
            <div className="wave group-hover:-translate-y-1/12 bg-[rgba(16,54,92,0.8)] absolute translate-y-3/4 h-[150%] aspect-square rounded-[38%] left-1/2 -translate-x-1/2 rotate-360 transition-transform duration-2000 ease-out animate-wave"></div>

            <ul
              className={`absolute top-1/2 left-1/2 -translate-1/2 w-full flex items-center justify-center flex-wrap gap-2.5 px-5 ${
                active ? "" : "pointer-events-none"
              }`}
            >
              {links.map(({ key, label, href, Icon }) => (
                <li key={key}>
                  <a
                    data-social
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${person.name} on ${label}`}
                    className="focus-ring flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/40 backdrop-blur-sm transition-colors duration-base ease-out-expo hover:bg-white hover:text-brand-900"
                  >
                    <Icon className="h-[1.05rem] w-[1.05rem]" />
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <h3 className="mt-4 font-display text-[1.02rem] font-extrabold leading-snug tracking-[-0.01em] text-ink">
        {person.name}
      </h3>
      <p className="mt-1 text-[0.85rem] leading-snug text-ink-muted">{person.role}</p>
    </article>
  );
}
