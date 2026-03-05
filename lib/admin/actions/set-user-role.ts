"use server";

/**
 * Admin Action – Set User Role
 *
 * Security pipeline: authenticate → authorize (OWNER only) → validate → mutate → audit
 * Only OWNERs can change roles to prevent privilege escalation.
 */

import { getSession } from "@/lib/auth/session";
import {
  assertTenantMembership,
  assertTenantScope,
} from "@/lib/tenancy/assert";
import { prisma } from "@/lib/prisma";
import {
  setUserRoleSchema,
  type SetUserRoleInput,
  type TeamMember,
} from "../types";

/** Shape of a membership row with included user, as returned by Prisma stub */
interface MembershipWithTenant {
  id: string;
  tenantId: string;
  role: string;
  status: string;
  createdAt: Date;
  user: {
    id: string;
    clerkUserId: string;
    name: string | null;
    email: string;
  };
}

export async function setUserRole(
  input: SetUserRoleInput
): Promise<TeamMember> {
  // Step 1: AUTHENTICATE
  const { clerkUserId, tenantId } = await getSession();
  if (!clerkUserId || !tenantId) {
    throw new Error("Unauthorized: not authenticated");
  }

  // Step 2: AUTHORIZE – only OWNERs may change roles
  await assertTenantMembership(tenantId, clerkUserId, "OWNER");

  // Step 3: VALIDATE
  const parsed = setUserRoleSchema.parse(input);

  // Step 4a: Fetch target membership and verify tenant scope
  const existing = (await prisma.tenantUserMembership.findFirst({
    where: { id: parsed.membershipId, status: "ACTIVE" },
    include: { user: true },
  })) as MembershipWithTenant | null;

  if (!existing) {
    throw new Error("Not found: membership does not exist");
  }

  assertTenantScope(existing.tenantId, tenantId);

  // Step 4b: MUTATE
  const updated = (await prisma.tenantUserMembership.update({
    where: { id: parsed.membershipId },
    data: { role: parsed.role },
    include: { user: true },
  })) as MembershipWithTenant;

  // Step 5: AUDIT
  await prisma.auditLog.create({
    data: {
      tenantId,
      userId: clerkUserId,
      action: "SET_USER_ROLE",
      resourceId: parsed.membershipId,
      details: JSON.stringify({
        previousRole: existing.role,
        newRole: parsed.role,
      }),
      timestamp: new Date(),
    },
  });

  return {
    id: updated.id,
    clerkUserId: updated.user.clerkUserId,
    name: updated.user.name ?? updated.user.email,
    email: updated.user.email,
    role: updated.role as TeamMember["role"],
    status: updated.status as TeamMember["status"],
    joinedAt: updated.createdAt,
  };
}
