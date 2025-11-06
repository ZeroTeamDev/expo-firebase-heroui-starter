type Bucket = { tokens: number; lastRefill: number };

const buckets = new Map<string, Bucket>();

export interface RateLimitOptions {
  capacity: number; // max tokens
  refillPerSec: number; // tokens per second
}

export function rateLimit(key: string, opts: RateLimitOptions): boolean {
  const now = Date.now();
  const bucket = buckets.get(key) || { tokens: opts.capacity, lastRefill: now };
  // Refill
  const elapsed = (now - bucket.lastRefill) / 1000;
  const refill = elapsed * opts.refillPerSec;
  bucket.tokens = Math.min(opts.capacity, bucket.tokens + refill);
  bucket.lastRefill = now;
  // Consume
  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    buckets.set(key, bucket);
    return true;
  }
  buckets.set(key, bucket);
  return false;
}


