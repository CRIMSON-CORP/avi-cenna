/**
 * Per-IP submission limits for the public forms.
 *
 * In-memory and per-process: it resets on restart, and under a clustered
 * process manager each worker keeps its own count. Good enough to stop a
 * script hammering the mailboxes; swap the Map for Redis if the site ever
 * runs more than one process.
 */

type Window = { count: number; reset: number };

const windows = new Map<string, Window>();

/** Nigerian mobile carriers put many subscribers behind one address, so the
    allowance has to clear a family filling in two forms from the same phone
    while still stopping a loop. */
export const FORM_LIMIT = { max: 5, windowMs: 15 * 60_000 };

export type RateLimitResult = { ok: true } | { ok: false; retryAfter: number };

export function rateLimit(key: string, { max, windowMs } = FORM_LIMIT): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const current = windows.get(key);
  if (!current || now > current.reset) {
    windows.set(key, { count: 1, reset: now + windowMs });
    return { ok: true };
  }

  current.count += 1;
  if (current.count > max) {
    return { ok: false, retryAfter: Math.ceil((current.reset - now) / 1000) };
  }
  return { ok: true };
}

let lastSweep = 0;

/** Without this the Map grows for every address that ever posted. */
function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, window] of windows) {
    if (now > window.reset) windows.delete(key);
  }
}

/**
 * The client address, or null when it cannot be established.
 *
 * X-Forwarded-For is set by the client unless a proxy overwrites or appends
 * to it, so the LAST entry is the only one worth trusting — that is the hop
 * nginx added. Requires `proxy_set_header X-Forwarded-For
 * $proxy_add_x_forwarded_for;` in front of the app. Served directly with no
 * proxy, there is no header and this returns null.
 */
export function clientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const hops = forwarded.split(",").map((h) => h.trim()).filter(Boolean);
    if (hops.length > 0) return hops[hops.length - 1];
  }
  return request.headers.get("x-real-ip")?.trim() || null;
}
