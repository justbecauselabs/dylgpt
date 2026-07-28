type Bucket = {
  timestamps: number[]
  dayKey: string
  dayCount: number
}

const buckets = new Map<string, Bucket>()

let globalDayKey = ''
let globalDayCount = 0

function utcDayKey(now = Date.now()): string {
  return new Date(now).toISOString().slice(0, 10)
}

function prune(timestamps: number[], windowMs: number, now: number): number[] {
  return timestamps.filter((ts) => now - ts < windowMs)
}

export type RateLimitResult =
  | { ok: true; remainingMinute: number; remainingDay: number }
  | {
      ok: false
      status: 429
      error: string
      retryAfterSeconds: number
    }

export function checkAndConsumeRateLimit(
  key: string,
  {
    perMinute,
    perDay,
    globalPerDay,
    now = Date.now(),
  }: {
    perMinute: number
    perDay: number
    globalPerDay: number
    now?: number
  }
): RateLimitResult {
  const dayKey = utcDayKey(now)
  if (globalDayKey !== dayKey) {
    globalDayKey = dayKey
    globalDayCount = 0
  }

  if (globalDayCount >= globalPerDay) {
    return {
      ok: false,
      status: 429,
      error: 'Daily SMS budget reached. Try again tomorrow.',
      retryAfterSeconds: secondsUntilUtcMidnight(now),
    }
  }

  let bucket = buckets.get(key)
  if (!bucket || bucket.dayKey !== dayKey) {
    bucket = { timestamps: [], dayKey, dayCount: 0 }
    buckets.set(key, bucket)
  }

  bucket.timestamps = prune(bucket.timestamps, 60_000, now)

  if (bucket.dayCount >= perDay) {
    return {
      ok: false,
      status: 429,
      error: 'Personal daily SMS limit reached. Try again tomorrow.',
      retryAfterSeconds: secondsUntilUtcMidnight(now),
    }
  }

  if (bucket.timestamps.length >= perMinute) {
    const oldest = bucket.timestamps[0]
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + 60_000 - now) / 1000))
    return {
      ok: false,
      status: 429,
      error: 'Sending too fast. Wait a moment to keep SMS costs down.',
      retryAfterSeconds,
    }
  }

  bucket.timestamps.push(now)
  bucket.dayCount += 1
  globalDayCount += 1

  return {
    ok: true,
    remainingMinute: Math.max(0, perMinute - bucket.timestamps.length),
    remainingDay: Math.max(0, perDay - bucket.dayCount),
  }
}

function secondsUntilUtcMidnight(now: number): number {
  const d = new Date(now)
  const next = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1)
  return Math.max(1, Math.ceil((next - now) / 1000))
}
