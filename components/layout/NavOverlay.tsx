"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { navigation, site, utilityLinks } from "@/lib/site";
import { cn } from "@/lib/utils";
import { getLenis } from "@/components/providers/lenis";
import { Button } from "@/components/ui/Button";
import {
  ArrowIcon,
  ChevronIcon,
  CloseIcon,
  FacebookIcon,
  InstagramIcon,
} from "@/components/ui/icons";
import { Logo } from "./Logo";

/** Index of the section whose children are shown when the menu first opens. */
const DEFAULT_SECTION = navigation.findIndex((s) => s.children);

/** Shared geometry for a top-level row, so the desktop link and the mobile
    disclosure button are pixel-identical apart from their affordance. */
const rowClass = cn(
  "focus-ring group items-center justify-between gap-4 py-3.5 lg:py-4",
  "font-display text-[1.75rem] leading-tight tracking-tight transition-colors duration-base",
  "sm:text-[2.1rem] lg:text-[2.4rem]",
);

function RowLabel({ index, label, isActive }: { index: number; label: string; isActive: boolean }) {
  return (
    <span className="flex items-baseline gap-3">
      <span
        className={cn(
          "font-sans text-[0.7rem] font-semibold tabular-nums transition-colors duration-base",
          isActive ? "text-accent-500" : "text-ink-muted",
        )}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      {label}
    </span>
  );
}

export function NavOverlay({
  open,
  onClose,
  triggerRef,
}: {
  open: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  return (
    <AnimatePresence>
      {open && <NavPanel onClose={onClose} triggerRef={triggerRef} />}
    </AnimatePresence>
  );
}

/**
 * Mounted only while the menu is open, so `active` resets on every open without
 * needing an effect to reach in and reset it.
 */
function NavPanel({
  onClose,
  triggerRef,
}: {
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  /** Desktop: which section drives the sub-link column (hover/focus). */
  const [active, setActive] = useState(DEFAULT_SECTION);
  /** Mobile: which accordion section is open. One at a time, so the list can
      never grow taller than a screen. Starts closed — the whole point is that
      six collapsed rows fit without scrolling. */
  const [expanded, setExpanded] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  /* Freeze the page, trap focus, and restore both on close. */
  useEffect(() => {
    const trigger = triggerRef.current;
    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = "hidden";

    const previouslyFocused = document.activeElement as HTMLElement | null;
    // Move focus into the panel so the first Tab lands on a menu link.
    panelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      lenis?.start();
      (previouslyFocused ?? trigger)?.focus();
    };
  }, [onClose, triggerRef]);

  const activeSection = navigation[active];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-surface-tint"
      initial={reduceMotion ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
      animate={reduceMotion ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
      exit={reduceMotion ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: reduceMotion ? 0.15 : 0.62, ease: [0.16, 1, 0.3, 1] }}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
    >
      {/* Soft brand wash so the panel isn't a flat white slab */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-[34rem] w-[34rem] rounded-full bg-brand-100/60 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-24 h-[28rem] w-[28rem] rounded-full bg-accent-100/50 blur-3xl"
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative flex h-full flex-col overflow-y-auto outline-none"
      >
        {/* --- overlay header --- */}
        <div className="shell flex h-(--header-h) shrink-0 items-center justify-between">
          <Logo onNavigate={onClose} />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-brand-200 bg-surface text-ink transition-colors duration-fast hover:border-brand-400 hover:bg-brand-50"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* --- menu body --- */}
        <div className="shell overflow-auto flex flex-1 flex-col justify-center gap-10 py-10 lg:flex-row lg:items-start lg:gap-16 lg:py-16">
          {/* sections */}
          <nav aria-label="Main" className="lg:w-[46%]">
            <ul className="flex flex-col">
              {navigation.map((section, index) => {
                const isActive = index === active;
                const isExpanded = index === expanded;
                return (
                  <motion.li
                    key={section.label}
                    initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: reduceMotion ? 0 : 0.22 + index * 0.055,
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="border-b border-brand-100 last:border-b-0"
                  >
                    {/* Two rows, swapped by breakpoint rather than by JS — a
                        media-query listener would have to re-run on every
                        resize and can disagree with CSS mid-transition.

                        DESKTOP: the row is a link; hovering it drives the
                        sub-link column on the right.
                        MOBILE: a section with children becomes a disclosure
                        button instead. Nothing is lost by taking the link off
                        it, because every such section already carries its own
                        overview page as its first child. */}
                    <Link
                      href={section.href}
                      onClick={onClose}
                      onMouseEnter={() => setActive(index)}
                      onFocus={() => setActive(index)}
                      className={cn(
                        rowClass,
                        section.children ? "hidden lg:flex" : "flex",
                        isActive ? "text-brand-600" : "text-ink hover:text-brand-600",
                      )}
                    >
                      <RowLabel index={index} label={section.label} isActive={isActive} />
                      <ArrowIcon
                        className={cn(
                          "h-5 w-5 shrink-0 transition-all duration-base ease-out-expo",
                          isActive
                            ? "translate-x-0 opacity-100"
                            : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                        )}
                      />
                    </Link>

                    {section.children && (
                      <>
                        <button
                          type="button"
                          onClick={() => setExpanded(isExpanded ? null : index)}
                          aria-expanded={isExpanded}
                          aria-controls={`${panelId}-section-${index}`}
                          className={cn(
                            rowClass,
                            "w-full text-left lg:hidden",
                            isExpanded ? "text-brand-600" : "text-ink",
                          )}
                        >
                          <RowLabel index={index} label={section.label} isActive={isExpanded} />
                          <ChevronIcon
                            className={cn(
                              "h-5 w-5 shrink-0 transition-transform duration-base ease-out-expo",
                              isExpanded && "-rotate-180",
                            )}
                          />
                        </button>

                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              key="sub"
                              id={`${panelId}-section-${index}`}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{
                                duration: reduceMotion ? 0 : 0.34,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              className="overflow-hidden lg:hidden"
                            >
                              <ul className="flex flex-col gap-0.5 pb-3 pl-8">
                                {section.children.map((child) => (
                                  <li key={child.href}>
                                    <Link
                                      href={child.href}
                                      onClick={onClose}
                                      className="focus-ring block py-1.5 text-[0.95rem] text-ink-body transition-colors duration-fast hover:text-brand-600"
                                    >
                                      {child.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    )}
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          {/* sub-links column (desktop) */}
          <div className="hidden lg:block lg:flex-1 lg:pt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-panel border border-brand-100 bg-surface/80 p-8 shadow-soft backdrop-blur"
              >
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-brand-500">
                  {activeSection.label}
                </p>
                {activeSection.children ? (
                  <ul className="mt-5 flex flex-col gap-1">
                    {activeSection.children.map((child, i) => (
                      <motion.li
                        key={child.href}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.06 + i * 0.04, duration: 0.32 }}
                      >
                        <Link
                          href={child.href}
                          onClick={onClose}
                          className="focus-ring group flex items-center justify-between rounded-lg px-3 py-2.5 text-[0.95rem] text-ink-body transition-colors duration-fast hover:bg-brand-50 hover:text-ink"
                        >
                          {child.label}
                          <ArrowIcon className="h-4 w-4 -translate-x-2 text-brand-500 opacity-0 transition-all duration-base ease-out-expo group-hover:translate-x-0 group-hover:opacity-100" />
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-5 text-[0.95rem] leading-relaxed text-ink-body">
                    This section is being rebuilt — the page will land here shortly.
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* --- overlay footer --- */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduceMotion ? 0 : 0.5, duration: 0.4 }}
          className="shrink-0 border-t border-brand-100 bg-surface/60 backdrop-blur"
        >
          <div className="shell flex flex-col gap-5 py-6 lg:flex-row lg:items-center lg:justify-between">
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {utilityLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring text-[0.82rem] font-medium text-ink-body underline-offset-4 transition-colors duration-fast hover:text-brand-600 hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <a
                href={`mailto:${site.email}`}
                className="focus-ring text-[0.82rem] font-medium text-ink-body transition-colors duration-fast hover:text-brand-600"
              >
                {site.email}
              </a>
              <a
                href={`tel:${site.phones[0].replace(/[^+\d]/g, "")}`}
                className="focus-ring text-[0.82rem] font-medium text-ink-body transition-colors duration-fast hover:text-brand-600"
              >
                {site.phones[0]}
              </a>
              <div className="flex items-center gap-2">
                <a
                  href={site.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Avi-Cenna on Facebook"
                  className="focus-ring flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition-colors duration-fast hover:bg-brand-500 hover:text-white"
                >
                  <FacebookIcon className="h-4 w-4" />
                </a>
                <a
                  href={site.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Avi-Cenna on Instagram"
                  className="focus-ring flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition-colors duration-fast hover:bg-brand-500 hover:text-white"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
              </div>
              <Button href={site.bookVisit} size="sm" arrow onClick={onClose}>
                Book a visit
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
