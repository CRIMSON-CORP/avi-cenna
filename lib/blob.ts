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

/* ------------------------------------------------------- RUNTIME VARIANTS -- */
/**
 * More blobs, without tracing more blobs.
 *
 * WHY THIS IS NOT INTERPOLATION THROUGH SAMPLED POINTS. Two earlier attempts
 * failed in ways worth recording, because both look correct until you stare
 * at the result:
 *
 *   SCALING THE TRACED POINTS radially by a wave turned the outline's own
 *   bumps into limbs — a wave on top of a wave. Nothing that protrudes can be
 *   smoothed away afterwards, because the protrusion is in the shape itself.
 *
 *   CATMULL-ROM THROUGH SAMPLES fixed the limbs but left the outline reading
 *   as a rounded polygon. That spline is tangent-continuous but not
 *   CURVATURE-continuous: at every sample the curvature jumps, and the eye
 *   reads each jump as a faint point. Eighteen samples meant eighteen of them.
 *
 * So the radius here is not sampled and joined up — it IS a smooth function.
 * The traced outline is Fourier-analysed into a handful of harmonics, which
 * has derivatives of every order, and a variant multiplies it by another such
 * function. The curve is then emitted from the exact analytic tangent at each
 * step, so the only error left is a cubic's approximation of an arc over 30°,
 * which is far below anything visible.
 *
 * Keeping five harmonics is the balance: enough to hold the traced profile's
 * character (the long shallow left flank, the fuller lower right), few enough
 * that nothing sharp survives the reconstruction.
 *
 * ON HYDRATION. `blobVariant` takes a seed rather than calling Math.random,
 * so the same seed yields the same numbers on the server and on the client.
 * Anything wanting a fresh shape per visit asks for it after hydration — see
 * `useClientSeed` in lib/isomorphic.ts.
 */

/** Deterministic pseudo-random in [0, 1) — a hash, not a generator. */
function noise(seed: number) {
  const n = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return n - Math.floor(n);
}

/** Harmonics kept from the traced profile, and cubic segments emitted. */
const HARMONICS = 5;
const SEGMENTS = 16;

type Series = { cos: number[]; sin: number[] };

/** Measures the traced outline's radius all the way round, then keeps only
    its lowest harmonics — the smooth core of the shape. */
function profileSeries(shape: number[]): Series {
  const BUCKETS = 360;
  const sums = new Array(BUCKETS).fill(0);
  const counts = new Array(BUCKETS).fill(0);
  const dense: number[][] = [];

  for (let i = 2; i < shape.length; i += 6) {
    const p0 = [shape[i - 2], shape[i - 1]];
    const c1 = [shape[i], shape[i + 1]];
    const c2 = [shape[i + 2], shape[i + 3]];
    const p1 = [shape[i + 4], shape[i + 5]];

    for (let step = 0; step < 60; step++) {
      const t = step / 60;
      const u = 1 - t;
      dense.push([
        u * u * u * p0[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p1[0],
        u * u * u * p0[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p1[1],
      ]);
    }
  }

  const cx = dense.reduce((sum, p) => sum + p[0], 0) / dense.length;
  const cy = dense.reduce((sum, p) => sum + p[1], 0) / dense.length;

  for (const [x, y] of dense) {
    const dx = x - cx;
    const dy = y - cy;
    let angle = Math.atan2(dy, dx);
    if (angle < 0) angle += Math.PI * 2;
    const bucket = Math.floor((angle / (Math.PI * 2)) * BUCKETS) % BUCKETS;
    sums[bucket] += Math.hypot(dx, dy);
    counts[bucket] += 1;
  }

  /* Carry the last known radius across any bucket the outline skipped, so the
     transform below is fed a continuous function rather than a hole. */
  const radii = new Array(BUCKETS).fill(0);
  let previous = 0.5;
  for (let i = 0; i < BUCKETS; i++) {
    previous = counts[i] > 0 ? sums[i] / counts[i] : previous;
    radii[i] = previous;
  }

  const cos: number[] = [];
  const sin: number[] = [];
  for (let k = 0; k <= HARMONICS; k++) {
    let a = 0;
    let b = 0;
    for (let i = 0; i < BUCKETS; i++) {
      const t = (i / BUCKETS) * Math.PI * 2;
      a += radii[i] * Math.cos(k * t);
      b += radii[i] * Math.sin(k * t);
    }
    cos.push((2 / BUCKETS) * a);
    sin.push((2 / BUCKETS) * b);
  }
  cos[0] /= 2;

  return { cos, sin };
}

/** The traced hero outline, reduced to its smooth core once at module load. */
const SOURCE_SERIES = profileSeries(SLIDE_SHAPES[0]);

function seriesAt(series: Series, t: number) {
  let value = series.cos[0];
  for (let k = 1; k < series.cos.length; k++) {
    value += series.cos[k] * Math.cos(k * t) + series.sin[k] * Math.sin(k * t);
  }
  return value;
}

function seriesSlope(series: Series, t: number) {
  let slope = 0;
  for (let k = 1; k < series.cos.length; k++) {
    slope += k * (series.sin[k] * Math.cos(k * t) - series.cos[k] * Math.sin(k * t));
  }
  return slope;
}

/** Re-fits to 0–1 so every variant fills its box identically. */
function refit(flat: number[]) {
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 0; i < flat.length; i += 2) {
    xs.push(flat[i]);
    ys.push(flat[i + 1]);
  }
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const width = Math.max(...xs) - minX;
  const height = Math.max(...ys) - minY;

  return flat.map((value, i) => (i % 2 === 0 ? (value - minX) / width : (value - minY) / height));
}

/**
 * A blob for the given seed. Same seed, same shape, every time and everywhere.
 *
 * Two slow waves only. Anything going round more than four times reads as a
 * ripple on the edge rather than as the shape being a different shape, and
 * the amplitude ceiling is what keeps the silhouette one rounded mass — by
 * about 0.14 the two waves can line up and pinch it into a clover.
 */
export function blobVariant(seed: number): number[] {
  const amp = 0.055 + noise(seed) * 0.045;
  const k1 = 2 + Math.floor(noise(seed + 1) * 2);
  const k2 = 3 + Math.floor(noise(seed + 3) * 2);
  const p1 = noise(seed + 2) * Math.PI * 2;
  const p2 = noise(seed + 4) * Math.PI * 2;
  /* Turns the traced profile under the wobble, so two variants are never the
     same shape wearing a different ripple. */
  const spin = noise(seed + 5) * Math.PI * 2;

  /* The radius and its exact derivative. Both are finite sums of sines, so
     both are smooth everywhere — which is the whole point of this approach. */
  const radius = (t: number) => {
    const base = seriesAt(SOURCE_SERIES, t + spin);
    return base * (1 + amp * (Math.sin(k1 * t + p1) + 0.45 * Math.sin(k2 * t + p2)));
  };

  const slope = (t: number) => {
    const base = seriesAt(SOURCE_SERIES, t + spin);
    const baseSlope = seriesSlope(SOURCE_SERIES, t + spin);
    const wobble = amp * (Math.sin(k1 * t + p1) + 0.45 * Math.sin(k2 * t + p2));
    const wobbleSlope = amp * (k1 * Math.cos(k1 * t + p1) + 0.45 * k2 * Math.cos(k2 * t + p2));
    return baseSlope * (1 + wobble) + base * wobbleSlope;
  };

  /* Position and velocity in the plane, from the polar pair. */
  const point = (t: number) => {
    const r = radius(t);
    return [Math.cos(t) * r, Math.sin(t) * r];
  };

  const velocity = (t: number) => {
    const r = radius(t);
    const dr = slope(t);
    return [dr * Math.cos(t) - r * Math.sin(t), dr * Math.sin(t) + r * Math.cos(t)];
  };

  /* Hermite to Bézier: every segment gets the curve's real tangent at both
     ends, scaled by a third of the step. Matching tangents on both sides of
     each join is what removes the creases a spline through points leaves. */
  const step = (Math.PI * 2) / SEGMENTS;
  const start = point(0);
  const flat: number[] = [start[0], start[1]];

  for (let i = 0; i < SEGMENTS; i++) {
    const t0 = i * step;
    const t1 = t0 + step;
    const from = point(t0);
    const fromV = velocity(t0);
    const to = point(t1);
    const toV = velocity(t1);

    flat.push(
      from[0] + (fromV[0] * step) / 3,
      from[1] + (fromV[1] * step) / 3,
      to[0] - (toV[0] * step) / 3,
      to[1] - (toV[1] * step) / 3,
      to[0],
      to[1],
    );
  }

  return refit(flat);
}
