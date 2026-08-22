"use client";

/**
 * Aurora wash behind the hero, in the two brand colours.
 *
 * Three large, heavily blurred colour fields drifting on deliberately
 * mismatched periods (29s / 37s / 43s). Because those numbers share no common
 * factor, the composite pattern takes a very long time to repeat — which is
 * what keeps it reading as ambient light rather than as a looping animation.
 *
 * Each field also scales and shifts opacity slightly out of phase with its own
 * drift, so the colours appear to breathe rather than merely slide around.
 */
export function Aurora() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* brand blue */}
      <div
        data-aurora
        data-period="29"
        data-dx="14"
        data-dy="-10"
        className="absolute left-[10%] top-[20%] h-[15vw] w-[15vw] rounded-full opacity-35 blur-[70px] bg-[radial-gradient(circle_at_50%_50%,var(--color-brand-400)_0%,var(--color-brand-300)_38%,transparent_70%)]"
      />

      {/* gold, the quietest of the three — just warms the middle */}
      <div
        data-aurora
        data-period="43"
        data-dx="9"
        data-dy="14"
        className="absolute left-[33%] top-[10%] h-[13vw] w-[13vw] rounded-full opacity-35 blur-[70px] bg-[radial-gradient(circle_at_50%_50%,var(--color-gold-400)_0%,var(--color-gold-300)_40%,transparent_70%)]"
      />
    </div>
  );
}
