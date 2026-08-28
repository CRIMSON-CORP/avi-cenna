"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * The scroll-reveal the homepage sections each write out by hand, pulled into
 * one place because /about has seven sections and repeating the same six props
 * seven times invites them to drift apart.
 *
 * Same curve and viewport margin as the existing sections, so a page mixing
 * the two reads as one site. Honours reduced motion by rendering the finished
 * state with no transition at all.
 */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
}) {
  const reduceMotion = useReducedMotion();
  const Tag = motion[as];

  return (
    <Tag
      initial={reduceMotion ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{
        delay: reduceMotion ? 0 : delay,
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </Tag>
  );
}
