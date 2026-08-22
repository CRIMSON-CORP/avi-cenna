/**
 * Hero photo mask — the amoeba, traced from the reference design in Figma and
 * normalised to `objectBoundingBox` units (0–1).
 *
 * SHAPES[0] IS THE TRACED SOURCE SHAPE. Do not "tidy" it — its asymmetry (the
 * long shallow left flank, the kink at the lower right, the notch up top) is
 * the whole character, and every attempt to approximate it with a generated
 * polar radius produced a dented circle instead.
 *
 * SHAPES[1] and [2] are siblings derived from it by scaling every point
 * radially about the centroid by a smooth function of its angle, so they read
 * as the same blob caught in a different pose rather than as unrelated shapes.
 * They were generated rather than hand-drawn, which is why all three carry an
 * identical command structure: M + 12 cubic curves + Z, 74 numbers in matching
 * positions. That is what lets a slide change interpolate the coordinates
 * element-wise — no morph plugin, and no fixed from/to values that could snap
 * the outline back when a tween lands.
 *
 * TO REPLACE OR ADD A SHAPE: trace it in Figma, then run the generator at
 * `scripts/blob-from-figma.mjs` over the exported path. Editing these numbers by
 * hand is not advisable; a mismatched point count will break the interpolation.
 */

/** Natural aspect of the traced outline. The container must match it or the
    silhouette renders stretched — bounding-box units scale with the box. */
export const BLOB_ASPECT = 1.1056;

/** Flat [x0, y0, x1, y1, …] — anchors and control points interleaved. */
export const SLIDE_SHAPES: number[][] = [
  // 0 — the traced source shape
  [
    0.1828, 0.0827, 0.1099, 0.1421, 0.0968, 0.2901, 0.0956, 0.3667, 0.0896, 0.4222, 0.0791,
    0.545, 0.0466, 0.6084, 0.006, 0.6876, 0, 0.7484, 0.0263, 0.8158, 0.0621, 0.9074, 0.1859,
    0.9782, 0.3333, 0.9782, 0.4074, 0.9782, 0.4313, 0.9307, 0.5591, 0.9307, 0.7097, 0.9307,
    0.7288, 1, 0.8136, 0.9888, 0.8937, 0.9782, 0.9809, 0.8501, 0.9904, 0.7233, 1, 0.5965,
    0.9761, 0.4591, 0.9689, 0.3957, 0.9643, 0.3544, 0.9713, 0.2703, 0.8984, 0.1936, 0.8387,
    0.1308, 0.7848, 0.1042, 0.6189, 0.0919, 0.5484, 0.0867, 0.4588, 0.0682, 0.4146, 0.0497,
    0.2958, 0, 0.2313, 0.0431, 0.1828, 0.0827,
  ],
  // 1 — shoulders lifted, lower left carrying more weight
  [
    0.1756, 0.0997, 0.1196, 0.1743, 0.131, 0.3283, 0.1392, 0.3998, 0.1364, 0.4482, 0.1133,
    0.555, 0.0709, 0.6147, 0.0175, 0.6941, 0, 0.7581, 0.0139, 0.8323, 0.042, 0.9321, 0.1715,
    1, 0.3281, 0.9764, 0.4022, 0.9588, 0.4248, 0.9108, 0.5378, 0.8876, 0.6687, 0.8905, 0.6844,
    0.9491, 0.765, 0.9502, 0.8463, 0.9529, 0.9566, 0.8568, 0.9848, 0.7408, 1, 0.6128, 0.9581,
    0.4735, 0.9366, 0.414, 0.9222, 0.3774, 0.9117, 0.3067, 0.8316, 0.2485, 0.776, 0.1981,
    0.7314, 0.1733, 0.5967, 0.1382, 0.5346, 0.1162, 0.4476, 0.0786, 0.4024, 0.0541, 0.2806, 0,
    0.2182, 0.0506, 0.1756, 0.0997,
  ],
  // 2 — crown pushed right, left flank pinched in
  [
    0.234, 0.0767, 0.1645, 0.1279, 0.139, 0.2654, 0.1278, 0.34, 0.1138, 0.3965, 0.0876, 0.5307,
    0.0502, 0.6031, 0.0062, 0.6941, 0, 0.7634, 0.029, 0.8388, 0.0711, 0.9371, 0.2053, 1,
    0.3553, 0.9791, 0.4264, 0.9671, 0.4485, 0.9162, 0.5621, 0.9004, 0.6917, 0.8964, 0.7081,
    0.9629, 0.7832, 0.9549, 0.8563, 0.9492, 0.9479, 0.8353, 0.9722, 0.7144, 1, 0.5854, 0.9931,
    0.4342, 0.9906, 0.3617, 0.9877, 0.3141, 0.9956, 0.2179, 0.9173, 0.1335, 0.851, 0.0692,
    0.7927, 0.0461, 0.6224, 0.0561, 0.5549, 0.0624, 0.4741, 0.0565, 0.4356, 0.0427, 0.3336, 0,
    0.2776, 0.0412, 0.234, 0.0767,
  ],
];

const round = (n: number) => Math.round(n * 10000) / 10000;

/** Formats a flat coordinate array back into `M … C×12 … Z`. */
export function pathFromCoords(c: number[]): string {
  let d = `M${round(c[0])},${round(c[1])}`;
  for (let i = 2; i < c.length; i += 6) {
    d += `C${round(c[i])},${round(c[i + 1])} ${round(c[i + 2])},${round(c[i + 3])} ${round(c[i + 4])},${round(c[i + 5])}`;
  }
  return `${d}Z`;
}

export function shapeFor(index: number) {
  return SLIDE_SHAPES[index % SLIDE_SHAPES.length];
}

/** Deterministic first frame, so server and client markup agree on hydration. */
export const INITIAL_BLOB_PATH = pathFromCoords(SLIDE_SHAPES[0]);
