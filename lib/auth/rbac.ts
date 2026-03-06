/**
 * Role-Based Access Control (RBAC)
 *
 * Permission checking utilities for authorization.
 * Use in conjunction with lib/tenancy/assert.ts for full security pipeline.
 */

import { assertTenantMembership } from "@/lib/tenancy/assert"
import { type TenantRole, ROLE_HIERARCHY } from "@/lib/tenancy/types"

export { assertTenantMembership }
export type { TenantRole }

// ─── Permission definitions ───────────────────────────────────────────────────

/**
 * Nested permission definitions organized by domain.
 * Each value is a unique permission string used in ROLE_PERMISSIONS.
 */
export const PERMISSIONS = {
  catalog: {
    read: "catalog:read",
    write: "catalog:write",
    delete: "catalog:delete"
  },
  scheduling: {
    read: "scheduling:read",
    write: "scheduling:write"
  },
  billing: {
    read: "billing:read",
    write: "billing:write"
  },
  admin: {
    read: "admin:read",
    write: "admin:write",
    users: "admin:users"
  },
  visualizer: {
    write: "visualizer:write"
  }
} as const

export type Permission =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS][keyof (typeof PERMISSIONS)[keyof typeof PERMISSIONS]]

/**
 * Role-to-permissions mapping.
 * Each role includes all permissions of lower roles.
 */
export const ROLE_PERMISSIONS: Record<TenantRole, string[]> = {
  owner: [
    PERMISSIONS.catalog.read,
    PERMISSIONS.catalog.write,
    PERMISSIONS.catalog.delete,
    PERMISSIONS.scheduling.read,
    PERMISSIONS.scheduling.write,
    PERMISSIONS.billing.read,
    PERMISSIONS.billing.write,
    PERMISSIONS.admin.read,
    PERMISSIONS.admin.write,
    PERMISSIONS.admin.users,
    PERMISSIONS.visualizer.write
  ],
  admin: [
    PERMISSIONS.catalog.read,
    PERMISSIONS.catalog.write,
    PERMISSIONS.scheduling.read,
    PERMISSIONS.scheduling.write,
    PERMISSIONS.billing.read,
    PERMISSIONS.admin.read,
    PERMISSIONS.visualizer.write
  ],
  member: [PERMISSIONS.catalog.read, PERMISSIONS.scheduling.read, PERMISSIONS.visualizer.write]
}

// ─── Utility functions ────────────────────────────────────────────────────────

/**
 * Check if a role satisfies the required role (considering hierarchy).
 * owner satisfies any requirement; admin satisfies admin and member; etc.
 *
 * @param userRole - The user's current role
 * @param requiredRole - The required role or array of acceptable roles
 */
export function hasRole(userRole: TenantRole, requiredRole: TenantRole | TenantRole[]): boolean {
  const userLevel = ROLE_HIERARCHY[userRole] ?? 0

  if (Array.isArray(requiredRole)) {
    return requiredRole.some((r) => userLevel >= (ROLE_HIERARCHY[r] ?? 0))
  }

  return userLevel >= (ROLE_HIERARCHY[requiredRole] ?? 0)
}

/**
 * Assert that a role satisfies the required role.
 * Throws "Forbidden: insufficient role" if not satisfied.
 *
 * @param userRole - The user's current role
 * @param requiredRole - The required role or array of acceptable roles
 * @throws Error if role is insufficient
 */
export function requireRole(userRole: TenantRole, requiredRole: TenantRole | TenantRole[]): void {
  if (!hasRole(userRole, requiredRole)) {
    throw new Error("Forbidden: insufficient role")
  }
}

/**
 * Check if a role has a specific permission.
 *
 * @param role - The role to check
 * @param permission - The permission string to check for
 */
export function hasPermission(role: TenantRole, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role]
  if (!permissions) return false
  return permissions.includes(permission)
}

/**
 * @deprecated Legacy role display metadata kept for backward compatibility.
 *
 * This constant only provides human-readable labels and descriptions for roles.
 * For authorization, prefer using `TenantRole` together with `ROLE_PERMISSIONS`
 * and the `PERMISSIONS` map. New code should define role presentation (labels,
 * descriptions, etc.) closer to the UI or domain that renders it instead of
 * relying on this shared constant.
 */
export const ROLES = {
  owner: {
    name: "Owner",
    description: "Full control over tenant, can manage all resources and users"
  },
  admin: {
    name: "Admin",
    description: "Can manage catalog, bookings, and view billing"
  },
  member: {
    name: "Member",
    description: "Can view catalog and create bookings"
  }
} as const
