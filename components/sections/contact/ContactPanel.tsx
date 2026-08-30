"use client";

import { motion, useReducedMotion } from "motion/react";
import { site } from "@/lib/site";
import { contactDetails, contactHero, type Detail } from "@/lib/contact";
import { ArrowIcon, FacebookIcon, InstagramIcon } from "@/components/ui/icons";
import { Blobs } from "@/components/ui/Blobs";
import { EnquiryForm } from "./EnquiryForm";

/**
 * The whole page, in one navy panel.
 *
 * The navy runs edge to edge and floor to ceiling — the only page on the site
 * that does. That costs one thing and buys another: the fixed header sits on
 * navy with no light strip under it, so the logo has to flip to white while
 * the header is transparent. It marks the page with `data-page-theme="dark"`
 * and the REVERSE LOGO rule in app/styles/theme.css does the rest.
 *
 * Everything arrives on load rather than on scroll: the panel is the whole
 * page, so there is no scroll position at which a reveal would make sense.
 * The blobs bounce in first and keep turning, the column of details rises
 * behind them, and the form lands last — the order in which the page becomes
 * useful.
 */

const RISE = {
  hidden: { opacity: 0, y: 24 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

export function ContactPanel() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="contact-heading"
      data-page-theme="dark"
      /* Tall enough to reach the footer on any ordinary screen, and centred
         inside whatever height it ends up with, so the composition holds
         whether the viewport is a laptop or a tall desktop monitor. */
      className="relative isolate flex min-h-svh items-center overflow-hidden bg-surface-deep pb-section pt-[calc(var(--header-h)+2rem)]"
    >
      <Blobs seed={7} />

      <div className="shell relative z-10 w-full">
        <motion.div
          className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,36rem)] lg:gap-16"
            initial={reduceMotion ? false : "hidden"}
            animate="shown"
            transition={{ delayChildren: 0.15, staggerChildren: 0.12 }}
          >
            {/* ----------------------------------------------- the details -- */}
            <div>
              <motion.p
                variants={RISE}
                className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-300"
              >
                {contactHero.eyebrow}
              </motion.p>

              <motion.h1
                variants={RISE}
                id="contact-heading"
                className="mt-6 font-display text-[clamp(2.1rem,1.1rem+3.9vw,4rem)] leading-[1.08] tracking-[-0.03em]"
              >
                <span className="block font-extralight text-brand-200">
                  {contactHero.headline.light}
                </span>
                <span className="block font-extrabold text-white">
                  {contactHero.headline.bold}
                </span>
              </motion.h1>

              <motion.p
                variants={RISE}
                className="mt-7 max-w-md border-t border-white/12 pt-7 text-[1rem] leading-relaxed text-ink-invert-soft"
              >
                {contactHero.body}
              </motion.p>

              <motion.dl variants={RISE} className="mt-10 grid gap-7 sm:grid-cols-2">
                {contactDetails.map((detail) => (
                  <DetailBlock key={detail.label} detail={detail} />
                ))}
              </motion.dl>

              <motion.div variants={RISE} className="mt-10">
                <p className="text-[0.7rem] font-bold uppercase tracking-widest text-brand-300">
                  Follow us
                </p>
                <div className="mt-3 flex items-center gap-2.5">
                  <Social href={site.socials.facebook} label="Avi-Cenna on Facebook">
                    <FacebookIcon className="h-4 w-4" />
                  </Social>
                  <Social href={site.socials.instagram} label="Avi-Cenna on Instagram">
                    <InstagramIcon className="h-4 w-4" />
                  </Social>
                </div>
              </motion.div>
            </div>

            {/* -------------------------------------------------- the form -- */}
            <motion.div variants={RISE}>
              <EnquiryForm />
            </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function DetailBlock({ detail }: { detail: Detail }) {
  return (
    <div>
      <dt className="text-[0.7rem] font-bold uppercase tracking-widest text-brand-300">
        {detail.label}
      </dt>
      <dd className="mt-2">
        {detail.lines.map((line) =>
          line.href ? (
            <a
              key={line.text}
              href={line.href}
              className="focus-ring block text-[0.97rem] font-medium leading-relaxed text-white/90 transition-colors duration-fast hover:text-white"
            >
              {line.text}
            </a>
          ) : (
            <span
              key={line.text}
              className="block text-[0.97rem] font-medium leading-relaxed text-white/90"
            >
              {line.text}
            </span>
          ),
        )}

        {detail.action && (
          <a
            href={detail.action.href}
            target={detail.action.external ? "_blank" : undefined}
            rel={detail.action.external ? "noopener noreferrer" : undefined}
            className="focus-ring group/link mt-2 inline-flex items-center gap-1.5 text-[0.85rem] font-bold text-brand-200 transition-colors duration-fast hover:text-white"
          >
            {detail.action.label}
            <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-base ease-out-expo group-hover/link:translate-x-0.5" />
          </a>
        )}
      </dd>
    </div>
  );
}

function Social({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-[background-color,transform] duration-base ease-out-expo hover:-translate-y-0.5 hover:bg-white/10"
    >
      {children}
    </a>
  );
}
