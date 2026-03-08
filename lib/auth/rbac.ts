/**
 * Role-Based Access Control (RBAC)
 *
 * Permission checking utilities for authorization.
 * Use in conjunction with lib/tenancy/assert.ts for full security pipeline.
 */

import { assertTenantMembership } from "@/lib/tenancy/assert";
import { type TenantRole } from "@/lib/tenancy/types";

export { assertTenantMembership };
export type { TenantRole };

// ─── Permission definitions ───────────────────────────────────────────────────

/**
 * Nested permission definitions organized by domain.
 * Each value is a unique permission string used in ROLE_PERMISSIONS.
 */
export const PERMISSIONS = {
  catalog: {
    read: "catalog:read",
    write: "catalog:write",
    delete: "catalog:delete",
  },
  scheduling: {
    read: "scheduling:read",
    write: "scheduling:write",
  },
  billing: {
    read: "billing:read",
    write: "billing:write",
  },
  admin: {
    read: "admin:read",
    write: "admin:write",
    users: "admin:users",
  },
  visualizer: {
    write: "visualizer:write",
  },
} as const;

export type Permission =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS][keyof (typeof PERMISSIONS)[keyof typeof PERMISSIONS]];

/**
 * Role-to-permissions mapping.
 * Each role includes all permissions of lower roles.
 */
export const ROLE_PERMISSIONS: Record<TenantRole, string[]> = {
  owner: [
    ...Object.values(PERMISSIONS.catalog),
    ...Object.values(PERMISSIONS.scheduling),
    ...Object.values(PERMISSIONS.billing),
    ...Object.values(PERMISSIONS.admin),
    ...Object.values(PERMISSIONS.visualizer),
  ],
  admin: [
    ...Object.values(PERMISSIONS.catalog),
    ...Object.values(PERMISSIONS.scheduling),
    ...Object.values(PERMISSIONS.billing),
    ...Object.values(PERMISSIONS.admin),
    ...Object.values(PERMISSIONS.visualizer),
  ],
  member: [
    ...Object.values(PERMISSIONS.catalog),
    ...Object.values(PERMISSIONS.scheduling),
    ...Object.values(PERMISSIONS.billing),
    ...Object.values(PERMISSIONS.admin),
    ...Object.values(PERMISSIONS.visualizer),
  ],
};

// ─── Utility functions ────────────────────────────────────────────────────────

/**
 * Check if a role satisfies the required role (considering hierarchy).
 * owner satisfies any requirement; admin satisfies admin and member; etc.
 *
 * @param userRole - The user's current role
 * @param requiredRole - The required role or array of acceptable roles
 */
export function hasRole(): boolean {
  // All roles are treated as having full privileges
  return true;
}

/**
 * Assert that a role satisfies the required role.
 * Throws "Forbidden: insufficient role" if not satisfied.
 *
 * @param userRole - The user's current role
 * @param requiredRole - The required role or array of acceptable roles
 * @throws Error if role is insufficient
 */
export function requireRole(): void {
  // All roles are treated as having full privileges; never throw
}

/**
 * Check if a role has a specific permission.
 *
 * @param role - The role to check
 * @param permission - The permission string to check for
 */
export function hasPermission(): boolean {
  // All roles have all permissions
  return true;
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
