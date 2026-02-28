const PRISMA_RETRYABLE_CONFLICT_CODE = 'P2034';
const POSTGRES_RETRYABLE_CODES = new Set(['40001', '40P01']);

export interface TransactionRunner<TTransactionClient> {
  <TResult>(callback: (tx: TTransactionClient) => Promise<TResult>): Promise<TResult>;
}

export interface TransactionRetryOptions {
  readonly maxRetries?: number;
  readonly baseDelayMs?: number;
  readonly maxDelayMs?: number;
}

const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_BASE_DELAY_MS = 25;
const DEFAULT_MAX_DELAY_MS = 250;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readErrorCode(error: unknown): string | null {
  if (!isRecord(error)) {
    return null;
  }

  if (typeof error.code === 'string') {
    return error.code;
  }

  if ('cause' in error) {
    return readErrorCode(error.cause);
  }

  return null;
}

function wait(delayMs: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}

function getBackoffDelay(attempt: number, baseDelayMs: number, maxDelayMs: number): number {
  const delay = baseDelayMs * 2 ** Math.max(attempt - 1, 0);
  return Math.min(delay, maxDelayMs);
}

export function isRetryableTransactionError(error: unknown): boolean {
  const code = readErrorCode(error);

  if (!code) {
    return false;
  }

  return code === PRISMA_RETRYABLE_CONFLICT_CODE || POSTGRES_RETRYABLE_CODES.has(code);
}

export async function runTransactionWithRetry<TTransactionClient, TResult>(
  runner: TransactionRunner<TTransactionClient>,
  operation: (tx: TTransactionClient) => Promise<TResult>,
  options: TransactionRetryOptions = {}
): Promise<TResult> {
  const maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
  const baseDelayMs = options.baseDelayMs ?? DEFAULT_BASE_DELAY_MS;
  const maxDelayMs = options.maxDelayMs ?? DEFAULT_MAX_DELAY_MS;

  let retries = 0;

  while (true) {
    try {
      return await runner(operation);
    } catch (error) {
      if (!isRetryableTransactionError(error) || retries >= maxRetries) {
        throw error;
      }

      retries += 1;
      await wait(getBackoffDelay(retries, baseDelayMs, maxDelayMs));
    }
  }
}
