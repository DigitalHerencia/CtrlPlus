/**
 * Tenancy Assertion Helpers
 *
 * Defensive security checks for tenant scoping and permissions.
 * Use these to prevent cross-tenant data leaks.
 */

import { prisma } from "@/lib/prisma";
import { type TenantRole, hasRolePermission } from "./types";

/**
 * Assert that a user is a member of a tenant with required role.
 * Throws error if membership doesn't exist or insufficient permission.
 *
 * @param tenantId - Tenant ID to check
 * @param userId - Clerk user ID
 * @param requiredRole - Minimum role required (defaults to 'member')
 * @throws Error if user is not a member or has insufficient permission
 *
 * @example
 * ```typescript
 * // In Server Action
 * export async function deleteWrap(wrapId: string) {
 *   const { userId, tenantId } = await requireAuth();
 *
 *   // Only admins can delete wraps
 *   await assertTenantMembership(tenantId, userId, 'admin');
 *
 *   // Proceed with deletion...
 * }
 * ```
 */
export async function assertTenantMembership(
  tenantId: string,
  userId: string,
  requiredRole: TenantRole = "member",
): Promise<void> {
  const membership = await prisma.tenantUserMembership.findUnique({
    where: {
      tenantId_userId: {
        tenantId,
        userId,
      },
      deletedAt: null,
    },
    select: {
      role: true,
    },
  });

  if (!membership) {
    throw new Error(`Forbidden - User is not a member of tenant ${tenantId}`);
  }

  if (!hasRolePermission(membership.role as TenantRole, requiredRole)) {
    throw new Error(
      `Forbidden - User role '${membership.role}' insufficient, requires '${requiredRole}' or higher`,
    );
  }
}

/**
 * Assert that a record belongs to the current tenant.
 * Use this as a defensive check before operating on tenant-owned resources.
 *
 * @param recordTenantId - The tenantId field from the database record
 * @param currentTenantId - The tenantId from session context
 * @throws Error if tenantIds don't match
 *
 * @example
 * ```typescript
 * export async function updateWrap(wrapId: string, data: WrapInput) {
 *   const { userId, tenantId } = await requireAuth();
 *
 *   // Fetch the wrap
 *   const wrap = await prisma.wrap.findUnique({ where: { id: wrapId } });
 *   if (!wrap) throw new Error('Wrap not found');
 *
 *   // SECURITY: Verify wrap belongs to current tenant
 *   assertTenantScope(wrap.tenantId, tenantId);
 *
 *   // Safe to proceed with update...
 * }
 * ```
 */
export function assertTenantScope(recordTenantId: string, currentTenantId: string): void {
  if (recordTenantId !== currentTenantId) {
    throw new Error(
      "Forbidden - Record does not belong to current tenant (cross-tenant access attempt)",
    );
  }
}

/**
 * Get user's role within a tenant.
 * Returns null if user is not a member.
 */
export async function getUserTenantRole(
  tenantId: string,
  userId: string,
): Promise<TenantRole | null> {
  const membership = await prisma.tenantUserMembership.findUnique({
    where: {
      tenantId_userId: {
        tenantId,
        userId,
      },
      deletedAt: null,
    },
    select: {
      role: true,
    },
  });

  return membership ? (membership.role as TenantRole) : null;
}

/**
 * Check if user has a specific role or higher in tenant.
 * Returns false if user is not a member.
 */
export async function hasMinimumRole(
  tenantId: string,
  userId: string,
  requiredRole: TenantRole,
): Promise<boolean> {
  const userRole = await getUserTenantRole(tenantId, userId);
  if (!userRole) return false;

  return hasRolePermission(userRole, requiredRole);
}
