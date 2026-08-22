"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * The hand-drawn graphic layer.
 *
 * Everything here is a stroked SVG path rather than a flat shape, so each one
 * can *draw itself on* with stroke-dashoffset — that reveal is what sells the
 * "sketched by hand" feel. Once drawn, each doodle picks up an idle loop on its
 * own duration, so they never fall into visible lockstep with one another.
 *
 * Three depth planes parallax against the pointer at different rates, which is
 * what stops the composition reading as a flat sticker sheet.
 *
 *   data-draw      → stroke draws on at mount
 *   data-float     → idle bob / sway, seeded per element
 *   data-twinkle   → scale + opacity pulse
 *   data-depth     → parallax strength (higher = moves further)
 */
export function Doodles({ className }: { className?: string }) {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = scope.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      /* ---------------------------------------------- draw the strokes --- */
      /* DrawSVG handles the dash maths, so each doodle sketches itself on. */
      gsap.fromTo(
        "[data-draw]",
        { drawSVG: "0%" },
        {
          drawSVG: "100%",
          duration: 1.2,
          stagger: 0.14,
          delay: 0.5,
          ease: "power2.inOut",
        },
      );

      /* ------------------------------------------------------ idle life --- */
      gsap.utils.toArray<HTMLElement>("[data-float]").forEach((el, i) => {
        const drift = 6 + (i % 4) * 3;
        gsap.to(el, {
          y: `+=${drift}`,
          rotation: i % 2 === 0 ? 4 : -5,
          duration: 3 + (i % 5) * 0.55,
          delay: i * 0.18,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          transformOrigin: "50% 50%",
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-twinkle]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { scale: 0.72, opacity: 0.45 },
          {
            scale: 1.12,
            opacity: 1,
            duration: 1.3 + i * 0.35,
            delay: 0.8 + i * 0.4,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            transformOrigin: "50% 50%",
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-spin]").forEach((el, i) => {
        gsap.to(el, {
          rotation: 360,
          duration: 26 + i * 9,
          ease: "none",
          repeat: -1,
          transformOrigin: "50% 50%",
        });
      });

      /* ------------------------------------------------------- parallax --- */
      const movers = gsap.utils.toArray<HTMLElement>("[data-depth]");
      const setters = movers.map((el) => ({
        el,
        depth: Number(el.dataset.depth ?? 1),
        x: gsap.quickTo(el, "xPercent", { duration: 0.9, ease: "power3.out" }),
        y: gsap.quickTo(el, "yPercent", { duration: 0.9, ease: "power3.out" }),
      }));

      const onPointerMove = (event: PointerEvent) => {
        const nx = event.clientX / window.innerWidth - 0.5;
        const ny = event.clientY / window.innerHeight - 0.5;
        setters.forEach(({ depth, x, y }) => {
          x(-nx * depth * 14);
          y(-ny * depth * 14);
        });
      };

      // Fine pointers only — on touch there's nothing to parallax against.
      const finePointer = window.matchMedia("(pointer: fine)").matches;
      if (finePointer) window.addEventListener("pointermove", onPointerMove);

      return () => {
        if (finePointer) window.removeEventListener("pointermove", onPointerMove);
      };
    }, root);

    return () => ctx.revert();
  }, []);

  const stroke = {
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <div ref={scope} aria-hidden className={className}>
      {/* ---------------------------------------------------- back plane --- */}

      {/* Positions cluster tight around the blob (which occupies roughly the
          right 45% from lg up) so the doodles read as belonging to it rather
          than as scatter across an empty background. */}

      {/* dotted matrix, tucked into the blob's upper-left shoulder */}
      <div data-depth="0.5" data-float className="absolute right-[4%] top-[5%] hidden lg:block">
        <svg width="172" height="116" viewBox="0 0 86 58" className="text-brand-300/80">
          {Array.from({ length: 4 }).map((_, row) =>
            Array.from({ length: 6 }).map((__, col) => (
              <circle
                key={`${row}-${col}`}
                cx={4 + col * 16}
                cy={4 + row * 16}
                r="2.4"
                fill="currentColor"
              />
            )),
          )}
        </svg>
      </div>

      {/* concentric orbit ring */}
      <div data-depth="0.9" className="absolute right-[15%] top-[3%] hidden opacity-70 lg:block">
        <div data-spin>
          <svg width="72" height="72" viewBox="0 0 72 72" className="text-accent-300">
            <circle
              cx="36"
              cy="36"
              r="30"
              {...stroke}
              stroke="currentColor"
              strokeWidth="1.6"
              strokeDasharray="5 9"
            />
            <circle cx="36" cy="6" r="3.4" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* ---------------------------------------------------- mid plane ---- */}

      {/* the squiggle arrow, aimed from the copy toward the photo */}
      <div data-depth="1.4" data-float className="absolute left-[50%] top-[40%] hidden xl:block">
        <svg width="132" height="72" viewBox="0 0 132 72" className="text-brand-500">
          <path
            data-draw
            d="M4 58C18 30 40 12 68 16c16 2 22 14 18 24-3 8-14 10-18 3-5-9 6-19 18-21 14-3 26 2 38 12"
            {...stroke}
            stroke="currentColor"
            strokeWidth="2.4"
          />
          <path
            data-draw
            d="M112 22l14 10-16 8"
            {...stroke}
            stroke="currentColor"
            strokeWidth="2.4"
          />
        </svg>
      </div>

      {/* saturn, sitting above the blob */}
      <div
        data-depth="1.8"
        data-float
        className="absolute right-[26%] top-[4%] sm:right-[30%] lg:right-[30%] lg:top-[4%]"
      >
        <svg width="66" height="52" viewBox="0 0 66 52" className="text-gold-500">
          <circle cx="30" cy="24" r="13" fill="currentColor" opacity="0.9" />
          <ellipse
            cx="30"
            cy="26"
            rx="28"
            ry="9"
            {...stroke}
            stroke="currentColor"
            strokeWidth="2.4"
            transform="rotate(-18 30 26)"
          />
          <circle cx="25" cy="20" r="2.6" className="fill-surface-alt" opacity="0.55" />
        </svg>
      </div>

      {/* loop-de-loop scribble, lower left of the blob */}
      <div
        data-depth="1.2"
        data-float
        className="absolute bottom-[16%] right-[40%] hidden lg:block"
      >
        <svg width="96" height="60" viewBox="0 0 96 60" className="text-accent-400">
          <path
            data-draw
            d="M4 44c10-16 22-30 36-32 10-2 14 8 8 14-7 7-16-1-12-10C42 4 62 2 76 12c10 7 14 20 16 34"
            {...stroke}
            stroke="currentColor"
            strokeWidth="2.2"
          />
        </svg>
      </div>

      {/* hand-drawn spiral */}
      <div
        data-depth="1.1"
        data-float
        className="absolute bottom-[10%] right-[30%] hidden opacity-80 lg:block"
      >
        <svg width="54" height="54" viewBox="0 0 54 54" className="text-brand-400">
          <path
            data-draw
            d="M27 27c0-5 6-8 10-5 5 4 3 13-4 16-9 4-20-2-22-12C9 13 22 3 35 5c15 2 24 16 22 30"
            {...stroke}
            stroke="currentColor"
            strokeWidth="2.2"
          />
        </svg>
      </div>

      {/* --------------------------------------------------- front plane --- */}

      {/* sparkles, deliberately out of phase with one another */}
      <Sparkle
        className="absolute left-[49%] top-[74%] hidden text-gold-400 lg:block"
        size={30}
        depth="2.2"
      />
      <Sparkle className="absolute right-[20%] top-[14%] text-accent-400" size={22} depth="2.6" />
      <Sparkle
        className="absolute bottom-[18%] right-[6%] hidden text-brand-400 sm:block"
        size={26}
        depth="2"
      />
      <Sparkle
        className="absolute left-[44%] top-[52%] hidden text-brand-300 xl:block"
        size={18}
        depth="2.4"
      />

      {/* small solid dots for punctuation */}
      <span
        data-depth="2.8"
        data-float
        className="absolute left-[45%] top-[40%] hidden h-3 w-3 rounded-full bg-accent-500/80 lg:block"
      />
      <span
        data-depth="2.4"
        data-float
        className="absolute bottom-[28%] right-[44%] hidden h-2.5 w-2.5 rounded-full bg-brand-500/70 lg:block"
      />
    </div>
  );
}

function Sparkle({ className, size, depth }: { className?: string; size: number; depth: string }) {
  return (
    <div data-depth={depth} className={className}>
      <div data-twinkle>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          {/* four-point star with concave sides — the classic doodle sparkle */}
          <path d="M12 0c.9 6.4 4.7 10.2 11.1 11.1C16.7 12 12.9 15.8 12 22.2 11.1 15.8 7.3 12 .9 11.1 7.3 10.2 11.1 6.4 12 0Z" />
        </svg>
      </div>
    </div>
  );
}
