"use server";

import { getSession } from "@/lib/auth/session";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { prisma } from "@/lib/prisma";
import { setUserRoleSchema, type SetUserRoleInput, type TeamMemberDTO } from "../types";
import { type TenantRole } from "@/lib/tenancy/types";

/**
 * Updates the role of a team member within the current tenant.
 *
 * Security pipeline:
 * 1. Authenticate  — verify user is signed in
 * 2. Authorize     — verify caller is the tenant owner
 * 3. Validate      — parse and validate input with Zod
 * 4. Mutate        — update the membership record (scoped by tenantId)
 * 5. Audit         — write an immutable audit event
 */
export async function setUserRole(input: SetUserRoleInput): Promise<TeamMemberDTO> {
  // 1. AUTHENTICATE
  const { user, tenantId } = await getSession();
  if (!user) throw new Error("Unauthorized: not authenticated");

  // 2. AUTHORIZE — only owners may change roles
  await assertTenantMembership(tenantId, user.id, "owner");

  // 3. VALIDATE
  const parsed = setUserRoleSchema.parse(input);

  // 4. MUTATE — the compound unique where clause acts as tenant+user scope check.
  //    If the membership doesn't exist or is soft-deleted, handle gracefully.
  let membership;
  try {
    membership = await prisma.tenantUserMembership.update({
      where: {
        tenantId_userId: {
          tenantId,
          userId: parsed.targetUserId,
        },
        deletedAt: null,
      },
      data: { role: parsed.role },
      select: {
        id: true,
        userId: true,
        role: true,
        createdAt: true,
      },
    });
  } catch (err) {
    if (err instanceof Error && "code" in err && (err as { code: string }).code === "P2025") {
      throw new Error("Forbidden: target user is not an active member of this tenant");
    }
    throw err;
  }

  // 5. AUDIT
  await prisma.auditLog.create({
    data: {
      tenantId,
      userId: user.id,
      action: "SET_USER_ROLE",
      resourceType: "TenantUserMembership",
      resourceId: membership.id,
      details: JSON.stringify({
        targetUserId: parsed.targetUserId,
        newRole: parsed.role,
      }),
      timestamp: new Date(),
    },
  });

  return {
    id: membership.id,
    userId: membership.userId,
    role: membership.role as TenantRole,
    createdAt: membership.createdAt,
  };
}
