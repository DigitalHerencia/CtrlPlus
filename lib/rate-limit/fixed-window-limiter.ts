export interface FixedWindowRateLimiterOptions {
  readonly limit: number;
  readonly windowMs: number;
}

export interface RateLimitDecision {
  readonly allowed: boolean;
  readonly remaining: number;
  readonly retryAfterSeconds: number;
}

export class RateLimitError extends Error {
  readonly statusCode: number;
  readonly retryAfterSeconds: number;

  constructor(message: string, retryAfterSeconds: number) {
    super(message);
    this.name = 'RateLimitError';
    this.statusCode = 429;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

interface WindowCounter {
  count: number;
  resetAt: number;
}

export class FixedWindowRateLimiter {
  private readonly counters = new Map<string, WindowCounter>();

  constructor(private readonly options: FixedWindowRateLimiterOptions) {}

  reset(): void {
    this.counters.clear();
  }

  consume(key: string, now = Date.now()): RateLimitDecision {
    const existingCounter = this.counters.get(key);

    if (!existingCounter || existingCounter.resetAt <= now) {
      this.counters.set(key, {
        count: 1,
        resetAt: now + this.options.windowMs
      });

      return {
        allowed: true,
        remaining: this.options.limit - 1,
        retryAfterSeconds: Math.ceil(this.options.windowMs / 1000)
      };
    }

    if (existingCounter.count >= this.options.limit) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds: Math.max(1, Math.ceil((existingCounter.resetAt - now) / 1000))
      };
    }

    existingCounter.count += 1;

    return {
      allowed: true,
      remaining: this.options.limit - existingCounter.count,
      retryAfterSeconds: Math.max(1, Math.ceil((existingCounter.resetAt - now) / 1000))
    };
  }
}
