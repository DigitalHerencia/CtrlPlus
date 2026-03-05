/**
 * Role-Based Access Control (RBAC)
 *
 * Permission checking utilities for authorization.
 * Use in conjunction with lib/tenancy/assert.ts for full security pipeline.
 */

import { assertTenantMembership, hasMinimumRole } from "@/lib/tenancy/assert";
import { type TenantRole } from "@/lib/tenancy/types";

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
 * Permission definitions
 * Define what each role can do
 */
export const PERMISSIONS = {
  // Catalog permissions
  "catalog:view": ["owner", "admin", "member"],
  "catalog:create": ["owner", "admin"],
  "catalog:update": ["owner", "admin"],
  "catalog:delete": ["owner", "admin"],

  // Booking permissions
  "booking:view": ["owner", "admin", "member"],
  "booking:create": ["owner", "admin", "member"],
  "booking:update": ["owner", "admin"],
  "booking:cancel": ["owner", "admin"],

  // Billing permissions
  "billing:view": ["owner", "admin"],
  "billing:manage": ["owner"],

  // User management permissions
  "users:view": ["owner", "admin"],
  "users:invite": ["owner", "admin"],
  "users:manage": ["owner"],

  // Tenant settings permissions
  "settings:view": ["owner", "admin"],
  "settings:update": ["owner"],
} as const;

export type Permission = keyof typeof PERMISSIONS;

/**
 * Check if a role has a specific permission.
 */
export function roleHasPermission(role: TenantRole, permission: Permission): boolean {
  const allowedRoles = PERMISSIONS[permission] as readonly string[];
  return allowedRoles.includes(role);
}
