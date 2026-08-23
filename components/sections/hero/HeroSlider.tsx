"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, SplitText, useIsomorphicLayoutEffect } from "@/lib/gsap";
import { BLOB_ASPECT, INITIAL_BLOB_PATH, pathFromCoords, shapeFor, SLIDE_SHAPES } from "@/lib/blob";
import { slides } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ArrowIcon, StarIcon } from "@/components/ui/icons";
import { Aurora } from "./Aurora";
import { Doodles } from "./Doodles";

const AUTOPLAY_MS = 7200;
const RING_R = 15;
const RING_C = 2 * Math.PI * RING_R;
/** Longest we will wait on the webfont before starting the entrance anyway. */
const FONT_TIMEOUT_MS = 1200;

/* ---------------------------------------------------- pre-hydration state --
   Most of the section is held out of the first paint by one stylesheet rule —
   see HERO ENTRANCE in app/styles/theme.css, which hides anything marked
   [data-enter] for as long as the section is [data-hero-stage="pending"].

   The slides are the exception and ship their state per element, because a
   slide is hidden for two different reasons — it is either waiting on the
   entrance or simply not the current slide — and the photo's from-state
   carries a clip on top of that. React only rewrites a style property whose
   *prop* changed between renders, and these derive from the slide index
   rather than the active one, so re-rendering on a slide change never claws
   anything back off GSAP. `visibility` rather than `display`, so the elements
   keep their layout and SplitText can still measure where the lines break. */
const HIDDEN_COPY: React.CSSProperties = { opacity: 0, visibility: "hidden" };

/** Matches the `from` of the first photo's reveal, so JS has nothing to undo. */
const FIRST_PHOTO: React.CSSProperties = {
  opacity: 1,
  visibility: "visible",
  zIndex: 2,
  clipPath: "inset(0% 0% 0% 100%)",
};
const HIDDEN_PHOTO: React.CSSProperties = { opacity: 0, visibility: "hidden", zIndex: 0 };

/* Scripting off means none of the above is ever undone, so hand that reader a
   composed first slide instead of an empty hero. */
const NOSCRIPT_CSS = `<style>
  [data-hero-stage] [data-enter] { opacity: 1 !important; visibility: visible !important; }
  [data-hero-copy="0"], [data-hero-photo="0"] {
    opacity: 1 !important;
    visibility: visible !important;
    clip-path: none !important;
  }
</style>`;

/**
 * The hero.
 *
 * Nothing travels sideways as a track — each slide swaps in place:
 *
 *   TEXT   SplitText with `mask: "lines"` gives every line its own clipping
 *          box. Outgoing lines fall out the bottom, incoming lines drop in from
 *          above. Headline staggers by word, body by line, on the same curve.
 *
 *   PHOTO  two nested clips. The OUTER is a procedural amoeba (see lib/blob.ts)
 *          rebuilt every frame — it rotates and breathes continuously, and the
 *          slide change simply retargets its radii, so it can never snap. The
 *          INNER is an inset wipe on the incoming photo, stacked above the
 *          outgoing one, opening from the RIGHT on "next" and the LEFT on
 *          "previous".
 */
export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const animating = useRef(false);
  const reduced = useRef(false);

  const rootRef = useRef<HTMLElement>(null);
  const clipPathRef = useRef<SVGPathElement>(null);
  const blobBoxRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headingRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const bodyRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headSplits = useRef<SplitText[]>([]);
  const bodySplits = useRef<SplitText[]>([]);
  const ringRef = useRef<SVGCircleElement>(null);
  const autoplayRef = useRef<gsap.core.Tween | null>(null);
  const goRelativeRef = useRef<(step: 1 | -1) => void>(() => {});

  /** Live outline coordinates, mutated in place. GSAP tweens the contents on a
      slide change and rewrites the path as it goes; nothing runs when idle. */
  const coords = useRef<number[]>([...SLIDE_SHAPES[0]]);

  /* ------------------------------------------------------------ autoplay -- */

  const startAutoplay = useCallback(() => {
    autoplayRef.current?.kill();
    if (reduced.current) return;

    const proxy = { v: 0 };
    autoplayRef.current = gsap.to(proxy, {
      v: 1,
      duration: AUTOPLAY_MS / 1000,
      ease: "none",
      onUpdate: () => {
        if (ringRef.current) {
          ringRef.current.style.strokeDashoffset = String(RING_C * (1 - proxy.v));
        }
      },
      onComplete: () => goRelativeRef.current(1),
    });
  }, []);

  /* ----------------------------------------------------------- transition -- */

  const goTo = useCallback(
    (next: number, direction: 1 | -1) => {
      const current = indexRef.current;
      if (animating.current || next === current) return;

      animating.current = true;
      indexRef.current = next;
      setIndex(next);

      const outText = textRefs.current[current];
      const inText = textRefs.current[next];
      const outImg = imageRefs.current[current];
      const inImg = imageRefs.current[next];
      const outLines = [
        ...(headSplits.current[current]?.words ?? []),
        ...(bodySplits.current[current]?.lines ?? []),
      ];

      /* The outline morphs by interpolating its own coordinates and rewriting
         the path as it goes. Since nothing else ever touches those coordinates,
         there is no competing tween to snap the shape back when this lands. */
      gsap.to(coords.current, {
        endArray: shapeFor(next),
        duration: 1.25,
        ease: "power2.inOut",
        onUpdate: () => {
          clipPathRef.current?.setAttribute("d", pathFromCoords(coords.current));
        },
      });

      if (reduced.current) {
        gsap.set([outText, outImg], { autoAlpha: 0 });
        gsap.set([inText, inImg], { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)" });
        animating.current = false;
        return;
      }

      // "next" reveals from the right edge, "previous" from the left.
      const hidden = direction === 1 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)";

      const tl = gsap.timeline({
        onComplete: () => {
          animating.current = false;
          startAutoplay();
        },
      });

      tl
        /* -------------- outgoing copy falls out through the masks -------- */
        .to(outLines, { yPercent: 108, duration: 0.5, stagger: 0.03, ease: "sink" }, 0)
        .to(
          outText?.querySelectorAll("[data-fade]") ?? [],
          { y: 16, autoAlpha: 0, duration: 0.36, stagger: 0.035, ease: "power2.in" },
          0,
        )
        .to(
          outText?.querySelectorAll("[data-underline]") ?? [],
          { drawSVG: "0%", duration: 0.32, ease: "power2.in" },
          0,
        )
        .set(outText, { autoAlpha: 0 }, 0.52)

        /* ------------------- photo: inner wipe over the outgoing --------- */
        .set(inImg, { clipPath: hidden, zIndex: 2, autoAlpha: 1 }, 0)
        .set(outImg, { zIndex: 1 }, 0)
        .to(inImg, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.15, ease: "expo.inOut" }, 0.05)
        .fromTo(
          inImg?.querySelector("[data-photo]") ?? [],
          { scale: 1.18, xPercent: direction * 7 },
          { scale: 1, xPercent: 0, duration: 1.4, ease: "swoop" },
          0.05,
        )
        .to(
          outImg?.querySelector("[data-photo]") ?? [],
          { scale: 1.07, xPercent: -direction * 5, duration: 1.15, ease: "power2.inOut" },
          0.05,
        )
        .set(outImg, { autoAlpha: 0, zIndex: 0 })
        .set(outImg?.querySelector("[data-photo]") ?? [], { scale: 1, xPercent: 0 })

        /* -------------- incoming copy drops in from above the masks ------ */
        .set(inText, { autoAlpha: 1 }, 0.4)
        .fromTo(
          headSplits.current[next]?.words ?? [],
          { yPercent: -112 },
          { yPercent: 0, duration: 1.15, stagger: 0.075, ease: "swoop" },
          0.44,
        )
        .fromTo(
          bodySplits.current[next]?.lines ?? [],
          { yPercent: -110 },
          { yPercent: 0, duration: 0.62, stagger: 0.07, ease: "swoop" },
          0.72,
        )
        .fromTo(
          inText?.querySelectorAll("[data-fade]") ?? [],
          { y: -14, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.62, stagger: 0.07, ease: "power3.out" },
          0.62,
        )
        .fromTo(
          inText?.querySelectorAll("[data-underline]") ?? [],
          { drawSVG: "0%" },
          { drawSVG: "100%", duration: 0.7, ease: "power2.out" },
          0.95,
        );
    },
    [startAutoplay],
  );

  const goRelative = useCallback(
    (step: 1 | -1) => {
      goTo((indexRef.current + step + slides.length) % slides.length, step);
    },
    [goTo],
  );

  useEffect(() => {
    goRelativeRef.current = goRelative;
  }, [goRelative]);

  /* --------------------------------------------------------------- mount -- */

  useIsomorphicLayoutEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let ctx: ReturnType<typeof gsap.context> | undefined;
    let cancelled = false;

    const build = () => {
      if (cancelled) return;

      ctx = gsap.context(() => {
        const root = rootRef.current;
        if (!root) return;
        const find = (selector: string) => Array.from(root.querySelectorAll(selector));

        /* Headlines split to masked words, bodies to masked lines — the same
           clipping mechanic at two scales, so the column reads as one system. */
        headSplits.current = headingRefs.current.filter(Boolean).map((el) =>
          SplitText.create(el as HTMLHeadingElement, {
            type: "lines,words",
            mask: "lines",
            autoSplit: true,
            aria: "auto",
            wordsClass: "word",
          }),
        );
        bodySplits.current = bodyRefs.current.filter(Boolean).map((el) =>
          SplitText.create(el as HTMLParagraphElement, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            aria: "auto",
          }),
        );

        /* Hands the curtain over from the stylesheet to GSAP: everything the
           entrance drives gets its hidden state written as its own inline
           style, and only once that is done does the attribute holding the
           stylesheet rule come off. Nothing yields between here and the end of
           this function, so the browser's next paint is already frame one of
           the entrance rather than anything half-assembled. */
        gsap.set(find("[data-enter]"), { autoAlpha: reduced.current ? 1 : 0 });
        textRefs.current.forEach((el, i) => gsap.set(el, { autoAlpha: i === 0 ? 1 : 0 }));
        imageRefs.current.forEach((el, i) =>
          gsap.set(el, {
            autoAlpha: i === 0 ? 1 : 0,
            zIndex: i === 0 ? 2 : 0,
            clipPath: "inset(0% 0% 0% 0%)",
          }),
        );
        root.removeAttribute("data-hero-stage");

        if (reduced.current) return;

        const first = textRefs.current[0];
        const doodles = find("[data-doodle]");
        /* A doodle with a stroke in it announces itself by drawing; the rest
           have no stroke to draw, so they scale up into place instead. */
        const sketched = doodles.filter((el) => el.querySelector("[data-draw]"));
        const solid = doodles.filter((el) => !el.querySelector("[data-draw]"));

        /* One timeline for the whole section, so this list IS the
           choreography. The stage is empty when it starts: the photo opens
           first, the copy rises into it, the graphic layer sketches itself on
           around the copy, and the controls arrive last, once there is
           something to control. Autoplay only starts when all of that has
           landed — the ring used to be a second into its count before the
           headline had finished arriving. */
        const tl = gsap.timeline({ onComplete: startAutoplay });

        tl
          /* --------------------------------------------------- the photo -- */
          .fromTo(
            imageRefs.current[0],
            { clipPath: "inset(0% 0% 0% 100%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.35, ease: "expo.inOut" },
            0.1,
          )
          .fromTo(
            imageRefs.current[0]?.querySelector("[data-photo]") ?? [],
            { scale: 1.22 },
            { scale: 1, duration: 1.6, ease: "swoop" },
            0.1,
          )
          /* the two circles peeking out from behind the amoeba */
          .fromTo(
            find("[data-hero-orb]"),
            { scale: 0.3, autoAlpha: 0 },
            {
              scale: 1,
              autoAlpha: 1,
              duration: 0.9,
              stagger: 0.14,
              ease: "back.out(1.7)",
              transformOrigin: "50% 50%",
            },
            0.55,
          )

          /* ---------------------------------------------------- the copy -- */
          .fromTo(
            headSplits.current[0]?.words ?? [],
            { yPercent: 114 },
            { yPercent: 0, duration: 1.25, stagger: 0.08, ease: "swoop" },
            0.15,
          )
          .fromTo(
            first?.querySelectorAll("[data-fade]") ?? [],
            { y: 22, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.09, ease: "swoop" },
            0.4,
          )
          .fromTo(
            bodySplits.current[0]?.lines ?? [],
            { yPercent: 110 },
            { yPercent: 0, duration: 0.7, stagger: 0.08, ease: "swoop" },
            0.5,
          )
          .fromTo(
            first?.querySelectorAll("[data-underline]") ?? [],
            { drawSVG: "0%" },
            { drawSVG: "100%", duration: 0.8, ease: "power2.out" },
            1.05,
          )

          /* ------------------------- the white accent curve on the photo -- */
          .set(find("[data-hero-curve]"), { autoAlpha: 1 }, 1)
          .fromTo(
            "[data-draw-curve]",
            { drawSVG: "0%" },
            { drawSVG: "100%", duration: 1.1, ease: "power2.inOut" },
            1,
          )

          /* ------------------------------------------------ the controls -- */
          .fromTo(
            find("[data-hero-controls]"),
            { y: 20, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.8, ease: "swoop" },
            1.4,
          )

          /* --------------- the doodles that have no stroke to draw with -- */
          .fromTo(
            solid,
            { scale: 0.55, autoAlpha: 0 },
            {
              scale: 1,
              autoAlpha: 1,
              duration: 0.7,
              stagger: 0.09,
              ease: "back.out(1.6)",
              transformOrigin: "50% 50%",
            },
            0.85,
          );

        /* Each sketched doodle appears on the frame its own stroke starts, so
           the drawing IS its entrance rather than something that happens to a
           shape already sitting there. Done per element because a doodle can
           hold more than one path, which would put a single shared stagger out
           of step with the wrappers it is meant to match. */
        sketched.forEach((el, i) => {
          const at = 0.7 + i * 0.16;
          tl.set(el, { autoAlpha: 1 }, at).fromTo(
            el.querySelectorAll("[data-draw]"),
            { drawSVG: "0%" },
            { drawSVG: "100%", duration: 1.1, stagger: 0.1, ease: "power2.inOut" },
            at,
          );
        });
      }, rootRef);
    };

    /* SplitText records where the lines break, so it has to measure against
       the real display font. `display: "swap"` lets the fallback paint first;
       splitting against that and letting `autoSplit` re-split on the swap
       would revert the very wrappers the entrance is driving, and the copy
       would snap into place mid-reveal. The font is preloaded, so this is
       normally already settled and `build` runs synchronously — the timeout is
       only there so a font that never resolves cannot leave the hero hidden
       for good. */
    if (document.fonts && document.fonts.status !== "loaded") {
      Promise.race([
        document.fonts.ready,
        new Promise((resolve) => setTimeout(resolve, FONT_TIMEOUT_MS)),
      ]).then(build);
    } else {
      build();
    }

    const onVisibility = () => {
      if (document.hidden) autoplayRef.current?.pause();
      else autoplayRef.current?.play();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      /* Back behind the curtain, so a remount (StrictMode, HMR) replays the
         entrance from the same blank stage the first paint started on. */
      rootRef.current?.setAttribute("data-hero-stage", "pending");
      document.removeEventListener("visibilitychange", onVisibility);
      autoplayRef.current?.kill();
      headSplits.current.forEach((s) => s.revert());
      bodySplits.current.forEach((s) => s.revert());
      headSplits.current = [];
      bodySplits.current = [];
      ctx?.revert();
    };
  }, [startAutoplay]);

  const handleNav = (fn: () => void) => {
    autoplayRef.current?.kill();
    fn();
  };

  return (
    <section
      ref={rootRef}
      data-hero-stage="pending"
      className="relative isolate overflow-hidden bg-surface"
      aria-roledescription="carousel"
      aria-label="Welcome to Avi-Cenna"
      onMouseEnter={() => autoplayRef.current?.pause()}
      onMouseLeave={() => autoplayRef.current?.play()}
    >
      <noscript dangerouslySetInnerHTML={{ __html: NOSCRIPT_CSS }} />

      <Aurora />

      {/* The mask. Authored in 0–1 bounding-box units and rewritten each frame. */}
      <svg aria-hidden width="0" height="0" className="absolute">
        <defs>
          <clipPath id="hero-blob" clipPathUnits="objectBoundingBox">
            <path ref={clipPathRef} d={INITIAL_BLOB_PATH} />
          </clipPath>
        </defs>
      </svg>

      {/* ------------------------------------------------------ the photo -- */}
      {/* Positioning on the outer track, animation on the inner box — GSAP
          writes `transform`, so the two must never share an element.
          The box is WIDER than tall: the mask lives in bounding-box units, so
          the amoeba stretches with its container, which is what gives the
          silhouette its horizontal spread. */}
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 z-0 hidden lg:flex justify-end",
          "items-start pt-[8%]",
          // Pad by the header height so the silhouette centres in the space
          // BELOW the nav rather than running up underneath it.
          "lg:z-10 lg:items-center lg:pt-(--header-h)",
          "right-[-1%]",
        )}
      >
        <div ref={blobBoxRef} style={{ aspectRatio: BLOB_ASPECT }} className="h-[38%] xl:h-[95%]">
          <div className="relative h-full w-full">
            {/* Circles peeking out from BEHIND the amoeba, as in the source.
                They sit under the mask, so the photo hides whatever part of
                each one falls inside the silhouette and only the escaping
                crescent shows. */}
            <span
              aria-hidden
              data-hero-orb
              data-enter
              className="absolute left-[48%] top-[-7%] h-[24%] w-[19%] rounded-full bg-gold-400"
            />
            <span
              aria-hidden
              data-hero-orb
              data-enter
              className="absolute bottom-[-6%] right-[1%] h-[32%] w-[25%] rounded-full bg-brand-400"
            />

            <div className="absolute inset-0" style={{ clipPath: "url(#hero-blob)" }}>
              {slides.map((slide, i) => (
                <div
                  key={slide.id}
                  data-hero-photo={i}
                  ref={(el) => {
                    imageRefs.current[i] = el;
                  }}
                  style={i === 0 ? FIRST_PHOTO : HIDDEN_PHOTO}
                  className="absolute inset-0 overflow-hidden"
                >
                  <div data-photo className="relative h-full w-full will-change-transform">
                    <Image
                      src={slide.image.src}
                      alt={slide.image.alt}
                      fill
                      priority={i === 0}
                      sizes="(min-width: 1024px) 62vw, 96vw"
                      style={{ objectPosition: slide.image.focal }}
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* the thin white curve that rides over the lower right of the
                photo in the reference */}
            <svg
              aria-hidden
              data-hero-curve
              data-enter
              viewBox="0 0 200 120"
              preserveAspectRatio="none"
              className="absolute bottom-[6%] right-[4%] h-[34%] w-[42%] text-white"
            >
              <path
                data-draw-curve
                d="M4 8c26 30 24 62 54 78 30 16 76 6 138 2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            {/* keeps the headline readable where the copy sits over the photo */}
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-r from-surface via-surface/75 to-transparent lg:hidden"
            />
          </div>
        </div>
      </div>

      <Doodles className="pointer-events-none absolute inset-0 z-20" />

      {/* ------------------------------------------------------- the copy -- */}
      <div className="shell relative z-30 pt-(--header-h)">
        <div className="grid min-h-[80svh] content-center py-14 lg:min-h-[88svh] lg:py-20">
          <div className="grid max-w-152">
            {slides.map((slide, i) => (
              <div
                key={slide.id}
                data-hero-copy={i}
                ref={(el) => {
                  textRefs.current[i] = el;
                }}
                style={HIDDEN_COPY}
                className="col-start-1 row-start-1"
                aria-hidden={index !== i}
                inert={index !== i}
              >
                <p
                  data-fade
                  className="inline-flex items-center gap-2 rounded-pill bg-brand-200/85 py-1.5 pl-2 pr-4 text-[0.75rem] font-bold text-brand-700 backdrop-blur"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-white">
                    <StarIcon className="h-3.5 w-3.5" />
                  </span>
                  {slide.eyebrow}
                </p>

                <div className="relative mt-5">
                  <h1
                    ref={(el) => {
                      headingRefs.current[i] = el;
                    }}
                    className="font-display text-display font-semibold [&_.word]:pb-2.5 leading-[0.98] tracking-[-0.035em] text-ink"
                  >
                    {slide.headline.join(" ")}
                  </h1>

                  <svg
                    aria-hidden
                    viewBox="0 0 240 14"
                    preserveAspectRatio="none"
                    className="absolute -bottom-2 left-0 h-3 w-[58%] text-accent-400"
                  >
                    <path
                      data-underline
                      d="M3 9c38-6 78-8 118-6 40 2 78 6 116 2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <p
                  ref={(el) => {
                    bodyRefs.current[i] = el;
                  }}
                  className="mt-8 max-w-[44ch] text-[1.02rem] font-medium leading-relaxed text-ink-body"
                >
                  {slide.body}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <span data-fade className="inline-block">
                    <Button href={slide.primary.href} arrow>
                      {slide.primary.label}
                    </Button>
                  </span>
                  <span data-fade className="inline-block">
                    <Button href={slide.secondary.href} variant="outline">
                      {slide.secondary.label}
                    </Button>
                  </span>
                </div>

                <p
                  data-fade
                  className="mt-7 flex items-center gap-2.5 text-[0.82rem] font-medium text-ink-muted"
                >
                  <span aria-hidden className="h-px w-8 bg-brand-400" />
                  {slide.proof}
                </p>
              </div>
            ))}
          </div>

          {/* ------------------------------------------------- controls --- */}
          <div data-hero-controls data-enter className="mt-12 flex items-center gap-5">
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleNav(() => goRelative(-1))}
                aria-label="Previous slide"
                className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-brand-200 bg-surface/80 text-ink backdrop-blur transition-all duration-base ease-out-expo hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-soft"
              >
                <ArrowIcon className="h-4 w-4 rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => handleNav(() => goRelative(1))}
                aria-label="Next slide"
                className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-brand-200 bg-surface/80 text-ink backdrop-blur transition-all duration-base ease-out-expo hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-soft"
              >
                <ArrowIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => handleNav(() => goTo(i, i > indexRef.current ? 1 : -1))}
                  aria-label={`Slide ${i + 1}: ${slide.headline.join(" ")}`}
                  aria-current={index === i}
                  className="focus-ring relative flex h-9 w-9 items-center justify-center"
                >
                  {index === i ? (
                    <>
                      <svg viewBox="0 0 36 36" className="absolute inset-0 h-9 w-9 -rotate-90">
                        <circle
                          cx="18"
                          cy="18"
                          r={RING_R}
                          className="fill-none stroke-brand-200"
                          strokeWidth="2"
                        />
                        <circle
                          ref={ringRef}
                          cx="18"
                          cy="18"
                          r={RING_R}
                          strokeDasharray={RING_C}
                          strokeDashoffset={RING_C}
                          strokeLinecap="round"
                          className="fill-none stroke-accent-500"
                          strokeWidth="2"
                        />
                      </svg>
                      <span className="h-2 w-2 rounded-full bg-accent-500" />
                    </>
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-brand-300 transition-colors duration-fast hover:bg-brand-500" />
                  )}
                </button>
              ))}
            </div>

            <span className="ml-auto font-semibold tabular-nums lg:ml-0">
              <span className="text-[1.05rem] text-ink">{String(index + 1).padStart(2, "0")}</span>
              <span className="mx-1 text-[0.8rem] text-ink-muted">/</span>
              <span className="text-[0.8rem] text-ink-muted">
                {String(slides.length).padStart(2, "0")}
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
