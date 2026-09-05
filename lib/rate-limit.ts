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

/** How many proxies sit in front of the app. Only the entries our own proxies
    appended are trustworthy — anyone can send an X-Forwarded-For of their own
    invention. Apache alone is 1; a CDN in front of it is 2. Set it too low
    behind a CDN and every visitor keys to the CDN's address, which rate-limits
    the whole site as one person. */
const TRUSTED_HOPS = Math.max(1, Number(process.env.TRUSTED_PROXY_HOPS ?? 1));

let described = false;

/** The client address, or null when it cannot be established. */
export function clientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  let ip: string | null = null;

  if (forwarded) {
    const hops = forwarded.split(",").map((h) => h.trim()).filter(Boolean);
    if (hops.length > 0) {
      ip = hops[Math.max(0, hops.length - TRUSTED_HOPS)];
    }
  }
  ip ??= request.headers.get("x-real-ip")?.trim() || null;

  /* Once per process, so the first real submission after a deploy says what
     the proxy chain actually looks like and whether TRUSTED_PROXY_HOPS is
     right. Guessing this from outside the server is not possible. */
  if (!described) {
    described = true;
    console.info(
      `[rate-limit] x-forwarded-for: ${forwarded ?? "(absent)"} ` +
        `| TRUSTED_PROXY_HOPS=${TRUSTED_HOPS} -> ${ip ?? "(no address; limiter disabled)"}`,
    );
  }

  return ip;
}
