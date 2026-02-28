import { describe, expect, it } from 'vitest';

import { assertTenantScope } from '../../lib/tenancy/assert-tenant-scope';
import { TenantAccessError, requireTenant } from '../../lib/tenancy/require-tenant';
import { resolveTenant } from '../../lib/tenancy/resolve-tenant';

describe('tenant resolution middleware primitives', () => {
  it('resolves tenantId from a valid subdomain', () => {
    const tenant = resolveTenant({
      host: 'acme.localhost:3000'
    });

    expect(tenant).toEqual({
      tenantId: 'tenant_acme',
      slug: 'acme',
      clerkOrgId: 'org_acme'
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
  });

  it('fails on cross-tenant access attempts', () => {
    expect(() => assertTenantScope('tenant_acme', 'tenant_beta')).toThrowError(TenantAccessError);
  });

  it('prefers host header over x-forwarded-host for tenant resolution', () => {
    const context = requireTenant({
      headers: {
        host: 'acme.localhost:3000',
        'x-forwarded-host': 'beta.localhost:3000'
      }
    });

    expect(context.tenant).toEqual({
      tenantId: 'tenant_acme',
      slug: 'acme',
      clerkOrgId: 'org_acme'
    });
  });

  it('ignores client-provided tenantId headers', () => {
    const context = requireTenant({
      headers: {
        host: 'acme.localhost:3000',
        'x-tenant-id': 'tenant_beta'
      }
    });

    expect(context.tenantId).toBe('tenant_acme');
  });
});
