"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { getLenis } from "@/components/providers/lenis";
import { ArrowIcon, CloseIcon } from "@/components/ui/icons";
import type { Photo } from "@/lib/galleries";

/**
 * The scattered photographs, full size.
 *
 * Portalled for the same reason the video player is: the gallery sits inside a
 * section that establishes its own stacking context, and a dialog left in
 * there cannot climb above the fixed header whatever its z-index.
 *
 * These files are 2500px wide. Loading one is a deliberate act, so nothing is
 * mounted until someone actually opens it.
 */
export function PhotoLightbox({
  photos,
  index,
  onClose,
  onIndex,
}: {
  photos: Photo[];
  /** null while shut. */
  index: number | null;
  onClose: () => void;
  onIndex: (next: number) => void;
}) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {index !== null && (
        <Viewer photos={photos} index={index} onClose={onClose} onIndex={onIndex} />
      )}
    </AnimatePresence>,
    document.body,
  );
}

function Viewer({
  photos,
  index,
  onClose,
  onIndex,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onIndex: (next: number) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const photo = photos[index];

  const step = useCallback(
    (delta: number) => onIndex((index + delta + photos.length) % photos.length),
    [index, photos.length, onIndex],
  );

  useEffect(() => {
    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = "hidden";

    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
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
      previouslyFocused?.focus();
    };
  }, [onClose, step]);

  return (
    <motion.div
      className="fixed inset-0 z-60 flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0.15 : 0.32, ease: [0.16, 1, 0.3, 1] }}
      role="dialog"
      aria-modal="true"
      aria-label={photo.caption}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={panelRef}
        className="relative w-full max-w-5xl"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 10 }}
        transition={{ duration: reduceMotion ? 0.15 : 0.42, ease: [0.16, 1, 0.3, 1] }}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close photograph"
          className="focus-ring absolute -top-1 right-0 flex h-11 w-11 -translate-y-full items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors duration-fast hover:bg-white/20"
        >
          <CloseIcon className="h-5 w-5" />
        </button>

        {/* The print border carries through from the scatter, so the photo the
            lightbox opens is recognisably the one that was picked up. */}
        <div className="overflow-hidden rounded-[0.4rem] bg-white p-2 shadow-lift sm:p-3">
          <Image
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(min-width: 1024px) 64rem, 100vw"
            className="mx-auto block max-h-[70svh] w-full object-contain"
            priority
          />
        </div>

        <div className="mt-4 flex items-center justify-between gap-6">
          <p className="font-display text-[1.05rem] font-semibold text-white">{photo.caption}</p>

          {photos.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="mr-2 text-[0.8rem] font-medium tabular-nums text-white/60">
                {index + 1} / {photos.length}
              </span>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous photograph"
                className="focus-ring flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-fast hover:bg-white/20"
              >
                <ArrowIcon className="h-4 w-4 rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next photograph"
                className="focus-ring flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-fast hover:bg-white/20"
              >
                <ArrowIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
