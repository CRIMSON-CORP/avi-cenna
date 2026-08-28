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
 * bottom behind a moving wave, and the social icons spring up through it in
 * sequence. Leaving drains it back down.
 *
 * WHY IT IS BUILT THIS WAY
 *
 * Rise and travel are separate transforms on nested groups — the outer group
 * carries the fill level, the inner one drifts left forever. Both motions run
 * at once, so the surface is sliding sideways at the same time as it climbs.
 * If they shared one element the wave would freeze while the level moved and
 * the whole thing would read as a bar sliding up.
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

   Control points sit at ±8 but a cubic only reaches about ¾ of that, so the
   amplitude is overdriven to land a visible crest. The path runs far past the
   bottom of the box, so there is always fill beneath the crest at any level. */
const PERIOD = 50;

const WAVE =
  "M0,0 C12.5,-8 37.5,8 50,0 C62.5,-8 87.5,8 100,0 C112.5,-8 137.5,8 150,0 C162.5,-8 187.5,8 200,0 L200,240 L0,240 Z";

/** Level at rest: crest sits on the bottom edge, all fill below the card. */
const EMPTY = 100;

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
      const travel = root.querySelector("[data-travel]");
      const icons = gsap.utils.toArray<HTMLElement>("[data-social]", root);

      gsap.set(level, { y: EMPTY });
      gsap.set(icons, { opacity: 0, scale: 0.5, y: 16 });

      const tl = gsap.timeline({ paused: true });

      if (reduced) {
        /* No rise, no drift — the reveal still has to happen, it just happens
           as a cross-fade. */
        tl.to(level, { y: -9, duration: 0.001 }).to(icons, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.2,
        });
        timeline.current = tl;
        return;
      }

      /* The leftward drift runs on its own, independent of the fill level, so
         the surface is sliding sideways while it climbs. Only ticking while a
         card is actually hovered. */
      loops.current = [
        gsap.to(travel, {
          x: -PERIOD,
          duration: 2.4,
          ease: "none",
          repeat: -1,
          paused: true,
        }),
      ];

      tl
        /* Settles far enough past the top that the trough of the crest still
           clears y=0 — otherwise the wave leaves slivers of photo up there. */
        .to(level, { y: -9, duration: 0.95, ease: "power2.inOut" }, 0)
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
          0.45,
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
            {/* preserveAspectRatio="none" lets one 100×100 wave stretch to any
                card size; the crest is tuned to look right once stretched. */}
            <svg
              aria-hidden
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 h-full w-full"
            >
              {/* Outer group carries the fill level, inner one the leftward
                  drift — the two run at once, so the surface slides sideways
                  as it climbs. */}
              <g data-level>
                <g data-travel>
                  <path d={WAVE} fill="rgb(16 54 92 / 0.8)" />
                </g>
              </g>
            </svg>

            <ul
              className={`absolute inset-0 flex items-center justify-center gap-2.5 ${
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
