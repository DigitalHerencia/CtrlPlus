import { describe, expect, it } from 'vitest';

import { AuthError, requireAuth } from '../../lib/server/auth/require-auth';

describe('requireAuth', () => {
  it('returns authenticated user from Clerk headers when session context is unavailable', async () => {
    const user = await requireAuth({
      headers: {
        'x-clerk-user-id': 'user_123',
        'x-clerk-user-email': 'owner@example.com',
        'x-clerk-org-id': 'org_acme'
      }
    });

    expect(user).toEqual({
      userId: 'user_123',
      email: 'owner@example.com',
      orgId: 'org_acme',
      privateMetadata: {}
    });
  });

  it('rejects generic non-Clerk user headers', async () => {
    await expect(() =>
      requireAuth({
        headers: {
          'x-user-id': 'user_234',
          'x-user-email': 'ops@example.com'
        }
      })
    ).rejects.toThrowError(AuthError);
  });

  it('throws 401 when user identity is missing', async () => {
    await expect(() =>
      requireAuth({
        headers: {
          host: 'acme.localhost:3000'
        }
      })
    ).rejects.toThrowError(AuthError);
  });
});
