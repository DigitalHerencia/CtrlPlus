"use server";

import { getSession } from "@/lib/auth/session";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { prisma } from "@/lib/prisma";
import {
  updateUserRoleSchema,
  type UpdateUserRoleInput,
  type UserRoleDTO,
} from "../types";

/**
 * Updates the role of an existing tenant member.
 *
 * Security pipeline:
 * 1. Authenticate  — verify user is signed in
 * 2. Authorize     — verify caller is an owner of the tenant
 * 3. Validate      — parse and validate input with Zod
 * 4. Mutate        — update the membership record scoped to tenantId
 * 5. Audit         — write an immutable audit entry
 */
export async function updateUserRole(input: UpdateUserRoleInput): Promise<UserRoleDTO> {
  // 1. AUTHENTICATE
  const { user, tenantId } = await getSession();
  if (!user) throw new Error("Unauthorized: not authenticated");

  // 2. AUTHORIZE — only owners may change member roles
  await assertTenantMembership(tenantId, user.id, "owner");

  // 3. VALIDATE
  const parsed = updateUserRoleSchema.parse(input);

  // 4. MUTATE — look up the target membership, scoped by tenantId
  const membership = await prisma.tenantUserMembership.findFirst({
    where: {
      tenantId,
      userId: parsed.targetClerkUserId,
      deletedAt: null,
    },
  });

  if (!membership) {
    throw new Error("Forbidden: target user is not a member of this tenant");
  }

  const updated = await prisma.tenantUserMembership.update({
    where: {
      tenantId_userId: {
        tenantId,
        userId: parsed.targetClerkUserId,
      },
    },
    data: { role: parsed.role },
  });

  // 5. AUDIT
  await prisma.auditLog.create({
    data: {
      tenantId,
      userId: user.id,
      action: "user.role_updated",
      resourceType: "TenantUserMembership",
      resourceId: updated.id,
      details: JSON.stringify({
        targetUserId: parsed.targetClerkUserId,
        newRole: parsed.role,
      }),
    },
  });

  return {
    tenantId: updated.tenantId,
    userId: updated.userId,
    role: updated.role,
    updatedAt: updated.updatedAt,
  };
}
