import { describe, expect, it } from 'vitest';

import { isRetryableTransactionError, runTransactionWithRetry } from '../../lib/db/transaction';

describe('server db transaction helper', () => {
  it('retries transient transaction conflicts and eventually succeeds', async () => {
    let attempts = 0;

    const runner = async <TResult>(callback: (tx: { attempt: number }) => Promise<TResult>): Promise<TResult> => {
      attempts += 1;

      if (attempts < 3) {
        const error = new Error('serialization failure') as Error & { code: string };
        error.code = 'P2034';
        throw error;
      }

      return callback({ attempt: attempts });
    };

    const result = await runTransactionWithRetry(runner, (tx) => Promise.resolve(tx.attempt), {
      maxRetries: 3,
      baseDelayMs: 0,
      maxDelayMs: 0
    });

    expect(result).toBe(3);
    expect(attempts).toBe(3);
  });

  it('does not retry non-retryable errors', async () => {
    let attempts = 0;
    const nonRetryableError = new Error('fatal');

    const runner = async <TResult>(callback: (tx: { attempt: number }) => Promise<TResult>): Promise<TResult> => {
      attempts += 1;
      await callback({ attempt: attempts });
      throw nonRetryableError;
    };

    await expect(
      runTransactionWithRetry(runner, () => Promise.resolve('ok'), {
        maxRetries: 3,
        baseDelayMs: 0,
        maxDelayMs: 0
      })
    ).rejects.toBe(nonRetryableError);

    expect(attempts).toBe(1);
  });

  it('throws after retry budget is exhausted', async () => {
    let attempts = 0;
    const retryableError = new Error('deadlock') as Error & { code: string };
    retryableError.code = '40P01';

    const runner = async <TResult>(callback: (tx: { attempt: number }) => Promise<TResult>): Promise<TResult> => {
      attempts += 1;
      await callback({ attempt: attempts });
      throw retryableError;
    };

    await expect(
      runTransactionWithRetry(runner, () => Promise.resolve('never'), {
        maxRetries: 2,
        baseDelayMs: 0,
        maxDelayMs: 0
      })
    ).rejects.toBe(retryableError);

    expect(attempts).toBe(3);
  });

  it('detects retryable transaction errors from nested causes', () => {
    expect(isRetryableTransactionError({ code: 'P2034' })).toBe(true);
    expect(isRetryableTransactionError({ cause: { code: '40001' } })).toBe(true);
    expect(isRetryableTransactionError({ cause: { code: '40P01' } })).toBe(true);
    expect(isRetryableTransactionError({ code: '23505' })).toBe(false);
    expect(isRetryableTransactionError(new Error('unknown'))).toBe(false);
  });
});
