import { FixedWindowRateLimiter } from './fixed-window-limiter';

const DEFAULT_UPLOAD_LIMIT = 5;
const DEFAULT_UPLOAD_WINDOW_MS = 60_000;

export const uploadRateLimiter = new FixedWindowRateLimiter({
  limit: DEFAULT_UPLOAD_LIMIT,
  windowMs: DEFAULT_UPLOAD_WINDOW_MS
});
