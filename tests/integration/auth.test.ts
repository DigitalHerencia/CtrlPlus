import { describe, expect, it } from 'vitest';

import { AuthError, requireAuth } from '../../lib/server/auth/require-auth';

describe('requireAuth', () => {
  it('returns authenticated user from Clerk headers', () => {
    const user = requireAuth({
      headers: {
        'x-clerk-user-id': 'user_123',
        'x-clerk-user-email': 'owner@example.com',
        'x-clerk-org-id': 'org_should_be_ignored'
      }
    });

    expect(user).toEqual({
      userId: 'user_123',
      email: 'owner@example.com'
    });
  });

  it('rejects generic non-Clerk user headers', () => {
    expect(() =>
      requireAuth({
        headers: {
          'x-user-id': 'user_234',
          'x-user-email': 'ops@example.com'
        }
      })
    ).toThrowError(AuthError);
  });

  it('throws 401 when user identity is missing', () => {
    expect(() =>
      requireAuth({
        headers: {
          host: 'acme.localhost:3000'
        }
      })
    ).toThrowError(AuthError);

    try {
      requireAuth({
        headers: {
          host: 'acme.localhost:3000'
        }
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AuthError);
      expect((error as AuthError).statusCode).toBe(401);
      expect((error as AuthError).message).toBe('Authentication required');
    }
  });
});


