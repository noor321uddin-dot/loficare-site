// In-memory sliding window per key. Per process, which is enough for a single Node instance (README says so).
const buckets = new Map();
let lastSweep = Date.now();

export function allow(key, limit, windowMs) {
  const now = Date.now();
  if (now - lastSweep > windowMs) {
    for (const [k, times] of buckets) {
      const kept = times.filter((t) => now - t < windowMs);
      if (kept.length) buckets.set(k, kept); else buckets.delete(k);
    }
    lastSweep = now;
  }
  const times = (buckets.get(key) || []).filter((t) => now - t < windowMs);
  if (times.length >= limit) { buckets.set(key, times); return false; }
  times.push(now);
  buckets.set(key, times);
  return true;
}
