"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { reasons, type Reason } from "@/lib/site";
import { cn } from "@/lib/utils";
import Image from "next/image";

const DEFAULT_ACTIVE = reasons[0].id;

/**
 * The Edukids programme panel, rebuilt for the school's six reasons: a deep
 * navy card floating on the light blue page, with a single highlighted tile.
 *
 * The highlight is one shared element with a `layoutId`, so Motion physically
 * slides it from tile to tile rather than cross-fading two boxes — that
 * travelling movement is what makes the interaction read as deliberate.
 */
export function WhyChooseUs() {
  const [active, setActive] = useState(DEFAULT_ACTIVE);
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="why-choose-us"
      className="scroll-mt-24 bg-surface-alt pb-(--spacing-section)"
      aria-labelledby="why-choose-us-heading"
    >
      <div className="shell">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-panel bg-surface-deep p-6 shadow-lift sm:p-10 lg:p-14 flex flex-col gap-10"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between relative after:absolute after:right-0 after:top-1/2 after:translate-y-1/2 after:w-px after:h-10 after:bg-linear-to-b from-transparent via-surface-alt to-transparent">
            <div className="max-w-xl">
              <p className="text-2xl font-semibold text-brand-200">Why choose us</p>
              <p
                id="why-choose-us-heading"
                className="mt-2 max-w-sm text-[0.95rem] leading-relaxed text-ink-invert-soft"
              >
                Six reasons parents choose Avi-Cenna.
              </p>
            </div>
          </div>
          <div className="relative">
            {/* ------------------------------------------- heading ------- */}
            {/* --------------------------------------------- tiles ------- */}
            <ul
              className="grid sm:grid-cols-2 lg:grid-cols-3"
              onMouseLeave={() => setActive(DEFAULT_ACTIVE)}
            >
              {reasons.map((reason) => (
                <ReasonTile
                  key={reason.id}
                  reason={reason}
                  isActive={active === reason.id}
                  onActivate={() => setActive(reason.id)}
                  reduceMotion={Boolean(reduceMotion)}
                />
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ReasonTile({
  reason,
  isActive,
  onActivate,
  reduceMotion,
}: {
  reason: Reason;
  isActive: boolean;
  onActivate: () => void;
  reduceMotion: boolean;
}) {
  const content = (
    <>
      {/* The travelling highlight. Only the active tile renders it, so Motion
          animates the single element across the grid. */}
      {isActive && (
        <motion.span
          layoutId="reason-spotlight"
          aria-hidden
          className="absolute inset-0 rounded-card bg-brand-600 shadow-[0px_30px_40px_#0a244070]"
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 320, damping: 34, mass: 0.9 }
          }
        />
      )}

      <div className="flex relative flex-col overflow-hidden p-5 rounded-card">
        <span className="absolute block top-0 right-0 w-40 h-40 rounded-full bg-brand-800 translate-x-1/2 -translate-y-1/2 scale-0 group-hover:duration-1000 group-hover:scale-100 transition-transform group-hover:delay-400 ease-out-expo"></span>

        <span className="relative flex h-full flex-col gap-3">
          <Image
            src={reason.image}
            width={96}
            height={96}
            alt={reason.title}
            className="w-24 h-24 transition-[filter] duration-500 ease-out-expo drop-shadow-[15px_25px_15px_#0a2440bb] group-hover:drop-shadow-[15px_25px_15px_#0a244080]"
            unoptimized
          />

          <span
            className={cn(
              "font-display text-[1.08rem] font-semibold leading-snug transition-colors duration-base",
              isActive ? "text-white" : "text-ink-invert",
            )}
          >
            {reason.title}
          </span>

          <span
            className={cn(
              "text-[0.87rem] leading-relaxed transition-colors duration-base",
              isActive ? "text-white/90" : "text-ink-invert-soft/80",
            )}
          >
            {reason.body}
          </span>
        </span>
      </div>
    </>
  );

  const className = cn(
    "relative group flex h-full outline-none transition-transform duration-base ease-out-expo",
  );

  return (
    <li className="h-full">
      <article className={className} onMouseEnter={onActivate} onFocus={onActivate}>
        {content}
      </article>
    </li>
  );
}
