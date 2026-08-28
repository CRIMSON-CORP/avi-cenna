"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { getLenis } from "@/components/providers/lenis";
import { CloseIcon } from "@/components/ui/icons";

/**
 * A video played over the page rather than on a page of its own.
 *
 * Rendered through a portal, because a dialog cannot be allowed to inherit the
 * stacking context of whatever opened it — the hero section is `isolate`, so a
 * player left inside it would sit under the fixed header no matter how high its
 * z-index went.
 *
 * The player is mounted only while `open`, which is the point of the whole
 * thing: the tour film is ~50MB, and a <video> that lives in the tree
 * permanently fetches its poster — and, on some mobile browsers, metadata for
 * the file itself — on every single page load. Mounting on open means the
 * network sees nothing until someone actually asks to watch.
 */
export function VideoDialog({
  open,
  onClose,
  src,
  poster,
  title,
  caption,
  meta,
}: {
  open: boolean;
  onClose: () => void;
  src: string;
  poster?: string;
  title: string;
  caption?: string;
  /** Small right-aligned note under the player — runtime, usually. */
  meta?: string;
}) {
  /* No body to portal into while rendering on the server. Nothing is lost by
     rendering nothing there: the dialog is always shut on a first paint. */
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <Player
          onClose={onClose}
          src={src}
          poster={poster}
          title={title}
          caption={caption}
          meta={meta}
        />
      )}
    </AnimatePresence>,
    document.body,
  );
}

function Player({
  onClose,
  src,
  poster,
  title,
  caption,
  meta,
}: {
  onClose: () => void;
  src: string;
  poster?: string;
  title: string;
  caption?: string;
  meta?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  /* Freeze the page, trap focus, and restore both on close — the same contract
     the nav overlay works under, since both are modal over the same scroller. */
  useEffect(() => {
    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = "hidden";

    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    /* The dialog only ever opens from a click, so the gesture that opened it
       is still counted as user activation and sound is allowed. If a browser
       disagrees, the native controls are right there — hence the swallow. */
    videoRef.current?.play().catch(() => {});

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])',
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
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-60 flex items-center justify-center bg-ink/85 p-4 backdrop-blur-sm sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0.15 : 0.32, ease: [0.16, 1, 0.3, 1] }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      /* Backdrop only — a click that started inside the panel and finished out
         here (a drag off the scrub bar) must not count as dismissing it. */
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
          aria-label="Close video"
          className="focus-ring absolute -top-1 right-0 flex h-11 w-11 -translate-y-full items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors duration-fast hover:bg-white/20"
        >
          <CloseIcon className="h-5 w-5" />
        </button>

        <div className="overflow-hidden rounded-panel bg-black shadow-lift">
          {/* Capped in viewport height as well as width, so the close button
              above it and the caption below it stay on screen on a laptop in
              landscape — the two places a 16:9 box would otherwise run past
              both edges. `object-contain` keeps the film letterboxed rather than
              cropped when the cap is what is deciding the size. */}
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            controls
            playsInline
            preload="auto"
            className="mx-auto block aspect-video max-h-[72svh] w-full object-contain"
          />
        </div>

        {(caption || meta) && (
          <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <div>
              <p className="font-display text-[1.05rem] font-semibold text-white">{title}</p>
              {caption && <p className="mt-1 text-[0.85rem] text-white/70">{caption}</p>}
            </div>
            {meta && <p className="text-[0.8rem] font-medium text-white/60">{meta}</p>}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
