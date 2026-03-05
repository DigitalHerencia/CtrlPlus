/**
 * Tenancy assertion helpers.
 *
 * These utilities enforce tenant isolation and role-based authorization
 * across all server actions and fetchers. They are the primary security
 * gatekeepers for the multi-tenant data layer.
 */

import { prisma } from "@/lib/prisma";
import { hasRole, type TenantRole } from "@/lib/auth/rbac";

/**
 * Asserts that the specified user is an **active** member of the given
 * tenant and holds at least the `required` role.
 *
 * This is the canonical authorization check — call it in every server
 * action and authenticated fetcher immediately after `getSession()`.
 *
 * @param tenantId - Tenant to scope the membership lookup to
 * @param userId   - Clerk user ID from the current session
 * @param required - Minimum required role, or an array of acceptable roles
 *
 * @throws {Error} "Unauthorized: not a member of this tenant"
 *   when no active membership record is found.
 * @throws {Error} "Forbidden: insufficient role"
 *   when the membership role does not satisfy `required`.
 *
 * @example
 * ```ts
 * // Require at least ADMIN
 * await assertTenantMembership(tenantId, user.id, "ADMIN");
 *
 * // Accept OWNER or ADMIN
 * await assertTenantMembership(tenantId, user.id, ["OWNER", "ADMIN"]);
 * ```
 */
export async function assertTenantMembership(
  tenantId: string,
  userId: string,
  required: TenantRole | TenantRole[]
): Promise<void> {
  const membership = await prisma.tenantUserMembership.findFirst({
    where: {
      tenantId,
      userId,
      status: "ACTIVE",
    },
  });

  if (!membership) {
    throw new Error("Unauthorized: not a member of this tenant");
  }

  if (!hasRole(membership.role, required)) {
    throw new Error("Forbidden: insufficient role");
  }
}

/**
 * Defensive scope guard: verifies that a fetched record belongs to the
 * current session's tenant.
 *
 * Call this before mutating any tenant-owned record that was fetched
 * **without** a `tenantId` filter to prevent cross-tenant data access.
 *
 * @param recordTenantId - The `tenantId` stored on the fetched record
 * @param tenantId       - The current session's resolved tenant ID
 *
 * @throws {Error} "Forbidden: cross-tenant access detected"
 *   when the two tenant IDs do not match.
 *
 * @example
 * ```ts
 * const wrap = await prisma.wrap.findUnique({ where: { id: wrapId } });
 * assertTenantScope(wrap.tenantId, tenantId); // throws if different tenant
 * ```
 */
export function assertTenantScope(
  recordTenantId: string,
  tenantId: string
): void {
  if (recordTenantId !== tenantId) {
    throw new Error("Forbidden: cross-tenant access detected");
  }
}
