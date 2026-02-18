import { describe, expect, it } from 'vitest';

import { TenantAccessError, requireTenant } from '../../lib/server/tenancy/require-tenant';
import { resolveTenant } from '../../lib/server/tenancy/resolve-tenant';

describe('tenant resolution middleware primitives', () => {
  it('resolves tenantId from a valid subdomain', () => {
    const tenant = resolveTenant({
      host: 'acme.localhost:3000'
    });

    expect(tenant).toEqual({
      tenantId: 'tenant_acme',
      slug: 'acme'
    });
  });

  it('returns not found for unknown subdomain', () => {
    expect(() =>
      requireTenant({
        headers: {
          host: 'unknown.localhost:3000'
        }
      })
    ).toThrowError(TenantAccessError);

    try {
      requireTenant({
        headers: {
          host: 'unknown.localhost:3000'
        }
      });
    } catch (error) {
      expect(error).toBeInstanceOf(TenantAccessError);
      expect((error as TenantAccessError).statusCode).toBe(404);
      expect((error as TenantAccessError).message).toBe('Tenant not found');
    }
  });

  it('fails on cross-tenant access attempts', () => {
    expect(() =>
      requireTenant({
        headers: {
          host: 'acme.localhost:3000'
        },
        routeTenantId: 'tenant_beta'
      })
    ).toThrowError(TenantAccessError);

    try {
      requireTenant({
        headers: {
          host: 'acme.localhost:3000'
        },
        routeTenantId: 'tenant_beta'
      });
    } catch (error) {
      expect(error).toBeInstanceOf(TenantAccessError);
      expect((error as TenantAccessError).statusCode).toBe(403);
      expect((error as TenantAccessError).message).toBe('Cross-tenant access denied');
    }
  });

  it('ignores client-provided tenantId headers', () => {
    const context = requireTenant({
      headers: {
        host: 'acme.localhost:3000',
        'x-tenant-id': 'tenant_beta'
      }
    });

    expect(context.tenant.tenantId).toBe('tenant_acme');
  });
});

