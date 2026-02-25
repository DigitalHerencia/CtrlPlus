import { describe, expect, it } from 'vitest';

import { createLogContext, redactLogData } from '../../lib/observability/structured-logger';

describe('structured logger', () => {
  it('uses correlation id from headers when present', () => {
    const context = createLogContext({
      headers: {
        'x-correlation-id': 'corr_123',
        'x-clerk-user-id': 'user_owner'
      },
      tenantId: 'tenant_acme',
      source: 'test.unit'
    });

    expect(context.correlationId).toBe('corr_123');
    expect(context.actorId).toBe('user_owner');
    expect(context.tenantId).toBe('tenant_acme');
    expect(context.source).toBe('test.unit');
  });

  it('redacts known sensitive keys recursively', () => {
    const redacted = redactLogData({
      authorization: 'Bearer test',
      nested: {
        customerEmail: 'customer@example.com',
        stripeToken: 'tok_abc'
      },
      items: [
        {
          password: 'secret'
        },
        {
          ok: true
        }
      ]
    }) as {
      authorization: string;
      nested: { customerEmail: string; stripeToken: string };
      items: readonly [{ password: string }, { ok: boolean }];
    };

    expect(redacted.authorization).toBe('[REDACTED]');
    expect(redacted.nested.customerEmail).toBe('[REDACTED]');
    expect(redacted.nested.stripeToken).toBe('[REDACTED]');
    expect(redacted.items[0].password).toBe('[REDACTED]');
    expect(redacted.items[1].ok).toBe(true);
  });
});
