import { MembershipStatus, TenantRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Verifies the requesting user is an active ADMIN or OWNER of the tenant.
 * Throws a Forbidden error if the check fails.
 *
 * Used as a read-access guard in all admin fetchers.
 *
 * @param tenantId         - Tenant scope (server-side verified)
 * @param requestingUserId - Clerk user ID of the requesting user
 */
export async function assertAdminOrOwner(
  tenantId: string,
  requestingUserId: string
): Promise<void> {
  const membership = await prisma.tenantUserMembership.findFirst({
    where: {
      tenantId,
      user: { clerkUserId: requestingUserId },
      status: MembershipStatus.ACTIVE,
    },
    select: { role: true },
  });

  if (!membership) {
    throw new Error("Forbidden - Not an active member of this tenant");
  }

  if (membership.role === TenantRole.MEMBER) {
    throw new Error("Forbidden - Admin or Owner role required");
  }
}
