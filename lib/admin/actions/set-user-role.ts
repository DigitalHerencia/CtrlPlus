"use server";

import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { type TenantRole } from "@/lib/tenancy/types";
import { type TeamMemberDTO, type UpdateUserRoleInput, updateUserRoleSchema } from "../types";

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
export async function setUserRole(input: UpdateUserRoleInput): Promise<TeamMemberDTO> {
  // 1. AUTHENTICATE
  const { tenantId } = await getSession();
  if (!tenantId) throw new Error("Unauthorized: not authenticated");

  // 2. AUTHORIZE — only owners may change roles
  await assertTenantMembership(tenantId, "owner");

  // 3. VALIDATE
  const parsed = updateUserRoleSchema.parse(input);

  // 4. MUTATE — the compound unique where clause acts as tenant+user scope check.
  //    If the membership doesn't exist or is soft-deleted, handle gracefully.
  // Look up the active membership first, ensuring we don't touch soft-deleted records.
  const existingMembership = await prisma.tenantUserMembership.findFirst({
    where: {
      tenantId,
      userId: parsed.targetClerkUserId,
      deletedAt: null,
    },
    select: {
      id: true,
      userId: true,
      role: true,
      createdAt: true,
    },
  });

  // Prevent owners from changing their own role away from "owner".
  if (existingMembership?.role === "owner") {
    throw new Error("Forbidden: owners cannot change their own role");
  }

  if (!existingMembership) {
    throw new Error("Forbidden: target user is not an active member of this tenant");
  }

  const membership = await prisma.tenantUserMembership.update({
    where: {
      id: existingMembership.id,
    },
    data: { role: parsed.role },
    select: {
      id: true,
      userId: true,
      role: true,
      tenantId: true,
      createdAt: true,
    },
  });
  // 5. AUDIT
  await prisma.auditLog.create({
    data: {
      tenantId,
      userId: "owner",
      action: "SET_USER_ROLE",
      resourceType: "TenantUserMembership",
      resourceId: membership.id,
      details: JSON.stringify({
        targetUserId: parsed.targetClerkUserId,
        newRole: parsed.role,
      }),
      timestamp: new Date(),
    },
  });

  return {
    id: membership.id,
    userId: membership.userId,
    role: membership.role as TenantRole,
    tenantId: membership.tenantId,
    createdAt: membership.createdAt,
  };
}
