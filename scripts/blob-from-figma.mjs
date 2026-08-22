#!/usr/bin/env node
/**
 * Turn a Figma-traced blob into the coordinate arrays used by lib/blob.ts.
 *
 * HOW TO CHANGE THE HERO BLOB SHAPE
 * ---------------------------------
 *  1. Drop the reference image into Figma, trace the outline with the pen tool,
 *     give it a fill, and copy the shape as SVG.
 *  2. Take the `d="…"` value out of that SVG.
 *  3. Run:
 *
 *        node scripts/blob-from-figma.mjs "M72.65 21.45C42.15 43.95 …Z"
 *
 *     Optionally pass how many sibling variants you want (default 2):
 *
 *        node scripts/blob-from-figma.mjs "M…Z" 3
 *
 *  4. Paste the printed BLOB_ASPECT and SLIDE_SHAPES arrays into lib/blob.ts.
 *
 * The variants are derived from your shape by scaling every point radially
 * about the centroid by a smooth function of its angle, so they stay
 * recognisably the same blob in a different pose. Because they are generated
 * from one source, all shapes keep an identical command structure — which is
 * what lets the hero interpolate between them coordinate-by-coordinate.
 *
 * ONLY CUBIC PATHS. Trace with the pen tool so Figma emits `C` curves; a path
 * containing arcs or quadratics will be rejected rather than silently mangled.
 */

const input = process.argv[2];
const variantCount = Number(process.argv[3] ?? 2);

if (!input) {
  console.error("Usage: node scripts/blob-from-figma.mjs \"<svg path d>\" [variants]");
  process.exit(1);
}

const commands = input.match(/[A-Za-z]/g) ?? [];
const unsupported = commands.filter((c) => !"MCZmcz".includes(c));
if (unsupported.length) {
  console.error(
    `Unsupported path commands: ${[...new Set(unsupported)].join(", ")}.\n` +
      "Re-trace with the pen tool so the path is made of cubic (C) curves only.",
  );
  process.exit(1);
}

const nums = (input.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
const pts = [];
for (let i = 0; i < nums.length; i += 2) pts.push([nums[i], nums[i + 1]]);

if ((pts.length - 1) % 3 !== 0) {
  console.error(
    `Got ${pts.length} points, which is not 1 + 3n — the path does not look like a\n` +
      "closed run of cubic curves. Check the traced shape is closed.",
  );
  process.exit(1);
}

// Bounding box over the whole control hull; the curve is guaranteed inside it.
const xs = pts.map((p) => p[0]);
const ys = pts.map((p) => p[1]);
const minX = Math.min(...xs);
const minY = Math.min(...ys);
const w = Math.max(...xs) - minX;
const h = Math.max(...ys) - minY;

const norm = pts.map(([x, y]) => [(x - minX) / w, (y - minY) / h]);
const cx = norm.reduce((s, p) => s + p[0], 0) / norm.length;
const cy = norm.reduce((s, p) => s + p[1], 0) / norm.length;

function deform(amp, freq, phase) {
  const moved = norm.map(([x, y]) => {
    const dx = x - cx;
    const dy = y - cy;
    const k = 1 + amp * Math.sin(freq * Math.atan2(dy, dx) + phase);
    return [cx + dx * k, cy + dy * k];
  });
  // Re-fit to 0–1 so every variant fills its box identically.
  const vx = moved.map((p) => p[0]);
  const vy = moved.map((p) => p[1]);
  const nx = Math.min(...vx);
  const ny = Math.min(...vy);
  const nw = Math.max(...vx) - nx;
  const nh = Math.max(...vy) - ny;
  return moved.map(([x, y]) => [(x - nx) / nw, (y - ny) / nh]);
}

const round = (n) => Math.round(n * 10000) / 10000;
const shapes = [norm];
for (let i = 0; i < variantCount; i++) {
  shapes.push(deform(0.085 + i * 0.005, 3 - (i % 2), 0.9 + i * 1.5));
}

console.log(`\n// Traced outline is ${w.toFixed(1)} x ${h.toFixed(1)}, ${pts.length} points.`);
console.log(`export const BLOB_ASPECT = ${round(w / h)};\n`);
console.log("export const SLIDE_SHAPES: number[][] = [");
shapes.forEach((s, i) => {
  const flat = s.flatMap(([x, y]) => [round(x), round(y)]);
  console.log(`  // ${i === 0 ? "traced source shape" : `variant ${i}`}`);
  console.log(`  [${flat.join(", ")}],`);
});
console.log("];");
