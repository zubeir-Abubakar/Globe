/**
 * Best-effort, in-process rate limiting for the public contact endpoint.
 *
 * This deliberately has no third-party dependency and no shared storage. It
 * protects a single Node.js process; it is not a replacement for edge/WAF rate
 * limiting. On Vercel or another reverse proxy, the client address must arrive
 * in a trusted forwarding header. If no address is available, the route skips
 * the limiter rather than putting every visitor into one shared bucket.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 8;
const MAX_TRACKED_CLIENTS = 5_000;

type Entry = { count: number; resetAt: number };
const entries = new Map<string, Entry>();

export function clientAddress(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (forwarded) return forwarded;
  return (
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("cf-connecting-ip")?.trim() ||
    null
  );
}

export function checkContactRateLimit(key: string, now = Date.now()) {
  let entry = entries.get(key);
  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + WINDOW_MS };
  }

  entry.count += 1;
  entries.set(key, entry);

  if (entries.size > MAX_TRACKED_CLIENTS) {
    for (const [client, value] of entries) {
      if (value.resetAt <= now) entries.delete(client);
    }
    while (entries.size > MAX_TRACKED_CLIENTS) {
      const oldest = entries.keys().next().value;
      if (oldest === undefined) break;
      entries.delete(oldest);
    }
  }

  return {
    limited: entry.count > MAX_REQUESTS,
    remaining: Math.max(0, MAX_REQUESTS - entry.count),
    retryAfter: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
  };
}
