/**
 * Blob silhouettes for the hero photo mask.
 *
 * Authored in a 100×100 coordinate space (not 0–1) purely for precision —
 * MorphSVG interpolates far more cleanly with numbers at this scale. The
 * clipPath scales them down with `transform="scale(0.01)"` and
 * `clipPathUnits="objectBoundingBox"`, so one path fits the container at any
 * size, and the traced outline SVG reuses the exact same coordinate space.
 *
 * MorphSVG matches differing point counts on its own, so these are free to be
 * genuinely different shapes rather than structurally identical ones. Keep all
 * coordinates inside roughly 3–97 though: anything past the bounding box gets
 * sliced off square by the container edge, which reads as a bug.
 */

/* Every shape sits inside a ~6–94 envelope rather than filling 0–100.
   That inset is deliberate: a curve whose lowest point is a pixel or two off
   the container edge is so shallow across that span that it reads as a flat
   crop, not a silhouette. The eye needs to see the curve turn back on itself.
   The inset also leaves room for the white rim stroke to sit outside the fill.
   The container is sized up to compensate. */
export const BLOB_PATHS = [
  // 1 — settled and round, weight in the upper right
  "M50,6 C72,6 90,17 93,37 C96,57 86,78 68,88 C50,96 26,92 15,78 C6,64 6,38 16,24 C26,10 30,6 50,6 Z",
  // 2 — broader, shoulders pulled wide, dipping to the lower left
  "M55,7 C76,9 88,20 92,38 C96,56 93,73 82,83 C70,93 52,95 37,90 C22,85 11,75 8,60 C5,45 9,27 19,17 C29,8 40,6 55,7 Z",
  // 3 — squarer and tilted, mass carried on the left
  "M46,7 C68,6 86,15 92,34 C96,53 91,76 73,87 C55,95 29,92 16,79 C7,66 6,40 14,26 C22,12 30,8 46,7 Z",
] as const;

/** A near-identical variant used for the idle wobble, so the blob is never static. */
export const BLOB_DRIFT =
  "M51,6 C73,6 91,17 94,38 C96,58 85,80 66,89 C48,95 24,92 14,78 C6,64 7,37 17,23 C27,9 30,6 51,6 Z";

export function blobFor(index: number) {
  return BLOB_PATHS[index % BLOB_PATHS.length];
}

/* 
<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="a"><path fill="currentColor" d="M794 617.5Q823 735 703.5 746T495 772.5q-89 15.5-194-18t-87.5-144Q231 500 214 390t77-177.5q94-67.5 192-15t245.5 41q147.5-11.5 92 125t-26.5 254Z"/></clipPath></defs><g clip-path="url(#a)"><path fill="#444CF7" d="M794 617.5Q823 735 703.5 746T495 772.5q-89 15.5-194-18t-87.5-144Q231 500 214 390t77-177.5q94-67.5 192-15t245.5 41q147.5-11.5 92 125t-26.5 254Z"/></g></svg>


*/
