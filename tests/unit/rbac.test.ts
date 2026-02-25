import { describe, expect, it } from 'vitest';

import { getRolePermissions, hasPermission } from '../../features/authz/permissions';
import { PermissionError, requirePermission } from '../../lib/auth/require-permission';

describe('rbac permission layer', () => {
  it('grants owner access to admin operations', () => {
    expect(hasPermission('owner', 'admin:write')).toBe(true);
  });

  it('restricts viewer from write operations', () => {
    expect(hasPermission('viewer', 'schedule:write')).toBe(false);
  });

  it('exposes deterministic role permissions', () => {
    const permissions = getRolePermissions('manager');

    expect(permissions).toContain('billing:read');
    expect(permissions).not.toContain('billing:write');
  });

  it('allows access for valid tenant membership without org context', async () => {
    const context = await requirePermission({
      headers: {
        'x-clerk-user-id': 'user_123',
        'x-clerk-user-email': 'owner@example.com'
      },
      tenantId: 'tenant_acme',
      permission: 'catalog:write'
    });

    expect(context.role).toBe('manager');
    expect(context.user.userId).toBe('user_123');
    expect(context.permission).toBe('catalog:write');
  });

  it('denies access when tenant membership is missing', async () => {
    await expect(() =>
      requirePermission({
        headers: {
          'x-clerk-user-id': 'user_unknown',
          'x-clerk-user-email': 'unknown@example.com'
        },
        tenantId: 'tenant_acme',
        permission: 'catalog:read'
      })
    ).rejects.toThrowError(PermissionError);
  });

  it('denies cross-tenant access even with valid membership in another tenant', async () => {
    await expect(() =>
      requirePermission({
        headers: {
          'x-clerk-user-id': 'user_123',
          'x-clerk-user-email': 'owner@example.com',
          'x-clerk-org-id': 'org_acme'
        },
        tenantId: 'tenant_beta',
        permission: 'catalog:read'
      })
    ).rejects.toThrowError(PermissionError);
  });

  it('denies access when role misses required permission', async () => {
    await expect(() =>
      requirePermission({
        headers: {
          'x-clerk-user-id': 'user_viewer',
          'x-clerk-user-email': 'viewer@example.com'
        },
        tenantId: 'tenant_acme',
        permission: 'billing:read'
      })
    ).rejects.toThrowError(PermissionError);
  });
});
