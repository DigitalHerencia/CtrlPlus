import { describe, expect, it } from 'vitest';

import { getRolePermissions, hasPermission } from '../../features/authz/permissions';
import { PermissionError, requirePermission } from '../../lib/server/auth/require-permission';

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

  it('allows access when user role includes requested permission', () => {
    const context = requirePermission({
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

  it('denies access when role misses required permission', () => {
    expect(() =>
      requirePermission({
        headers: {
          'x-clerk-user-id': 'user_viewer',
          'x-clerk-user-email': 'viewer@example.com'
        },
        tenantId: 'tenant_acme',
        permission: 'billing:read'
      })
    ).toThrowError(PermissionError);
  });
});


