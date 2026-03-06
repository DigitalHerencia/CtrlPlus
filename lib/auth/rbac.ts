/**
 * Role-Based Access Control (RBAC)
 *
 * Permission checking utilities for authorization.
 * Use in conjunction with lib/tenancy/assert.ts for full security pipeline.
 */

import { assertTenantMembership, hasMinimumRole } from "@/lib/tenancy/assert";
import { type TenantRole, hasRolePermission } from "@/lib/tenancy/types";

export { assertTenantMembership, hasMinimumRole };
export type { TenantRole };

/**
 * Role definitions with descriptions
 */
export const ROLES = {
  owner: {
    name: "Owner",
    description: "Full control over tenant, can manage all resources and users",
  },
  admin: {
    name: "Admin",
    description: "Can manage catalog, bookings, and view billing",
  },
  member: {
    name: "Member",
    description: "Can view catalog and create bookings",
  },
} as const;

/**
 * Nested permission definitions keyed by domain.
 */
export const PERMISSIONS = {
  catalog: {
    read: "catalog:view" as const,
    write: "catalog:create" as const,
    update: "catalog:update" as const,
    delete: "catalog:delete" as const,
  },
  scheduling: {
    read: "scheduling:view" as const,
    write: "scheduling:create" as const,
  },
  visualizer: {
    write: "visualizer:create" as const,
  },
  billing: {
    read: "billing:view" as const,
    write: "billing:manage" as const,
  },
  admin: {
    read: "admin:read" as const,
    write: "admin:write" as const,
    users: "admin:users" as const,
  },
  settings: {
    read: "settings:view" as const,
    update: "settings:update" as const,
  },
} as const;

export type Permission =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS][keyof (typeof PERMISSIONS)[keyof typeof PERMISSIONS]];

/**
 * Map of role → list of granted permissions.
 */
export const ROLE_PERMISSIONS: Record<TenantRole, string[]> = {
  owner: [
    PERMISSIONS.catalog.read,
    PERMISSIONS.catalog.write,
    PERMISSIONS.catalog.update,
    PERMISSIONS.catalog.delete,
    PERMISSIONS.scheduling.read,
    PERMISSIONS.scheduling.write,
    PERMISSIONS.visualizer.write,
    PERMISSIONS.billing.read,
    PERMISSIONS.billing.write,
    PERMISSIONS.admin.read,
    PERMISSIONS.admin.write,
    PERMISSIONS.admin.users,
    PERMISSIONS.settings.read,
    PERMISSIONS.settings.update,
  ],
  admin: [
    PERMISSIONS.catalog.read,
    PERMISSIONS.catalog.write,
    PERMISSIONS.catalog.update,
    PERMISSIONS.scheduling.read,
    PERMISSIONS.scheduling.write,
    PERMISSIONS.visualizer.write,
    PERMISSIONS.billing.read,
    PERMISSIONS.admin.read,
    PERMISSIONS.settings.read,
  ],
  member: [PERMISSIONS.catalog.read, PERMISSIONS.scheduling.read, PERMISSIONS.visualizer.write],
};

/**
 * Check if a role has a specific permission.
 */
export function roleHasPermission(role: TenantRole, permission: string): boolean {
  return (ROLE_PERMISSIONS[role] ?? []).includes(permission);
}

/**
 * Check if userRole satisfies the required role (or any role in an array).
 */
export function hasRole(userRole: TenantRole, required: TenantRole | TenantRole[]): boolean {
  if (Array.isArray(required)) {
    return required.some((r) => hasRolePermission(userRole, r));
  }
  return hasRolePermission(userRole, required);
}

/**
 * Check if userRole has a specific permission string.
 */
export function hasPermission(userRole: TenantRole, permission: string): boolean {
  return (ROLE_PERMISSIONS[userRole] ?? []).includes(permission);
}

/**
 * Assert that userRole satisfies the required role; throws if not.
 */
export function requireRole(userRole: TenantRole, required: TenantRole | TenantRole[]): void {
  if (!hasRole(userRole, required)) {
    throw new Error("Forbidden: insufficient role");
  }
}
