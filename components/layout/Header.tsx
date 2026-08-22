"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Logo } from "./Logo";
import { NavOverlay } from "./NavOverlay";

/**
 * The nav stays collapsed at every breakpoint — desktop included — so the menu
 * trigger is the single entry point to the site's structure and the hero is
 * never competing with a row of links.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-base ease-out-expo",
          scrolled ? "bg-surface/85 shadow-soft backdrop-blur-md" : "bg-transparent",
        )}
      >
        <div className="shell flex h-[var(--header-h)] items-center justify-between gap-4">
          <Logo />

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:inline-flex">
              <Button href={site.bookVisit} size="sm" arrow className="">
                Book a visit
              </Button>
            </div>

            <button
              ref={triggerRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-haspopup="dialog"
              aria-label="Open menu"
              className={cn(
                "focus-ring group flex h-11 items-center gap-2.5 rounded-pill border px-4",
                "transition-[background-color,border-color,box-shadow,transform] duration-base ease-out-expo",
                "border-brand-200 bg-surface/80 backdrop-blur hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-soft",
              )}
            >
              <span className="hidden text-[0.8rem] font-semibold text-ink sm:inline">Menu</span>
              <span aria-hidden className="flex h-4 w-5 flex-col justify-center gap-[5px]">
                <span className="h-[2px] w-full rounded-full bg-ink transition-transform duration-base ease-out-expo group-hover:-translate-y-[1px]" />
                <span className="h-[2px] w-full rounded-full bg-ink transition-transform duration-base ease-out-expo group-hover:translate-y-[1px] group-hover:scale-x-75 group-hover:origin-left" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <NavOverlay open={open} onClose={() => setOpen(false)} triggerRef={triggerRef} />
    </>
  );
}
