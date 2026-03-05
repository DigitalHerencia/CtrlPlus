import { MembershipStatus, TenantRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { assertAdminOrOwner } from "../rbac";
import {
  type TeamMemberDTO,
  type TeamMemberListParams,
  type TeamMemberListResult,
} from "../types";

// ─── Internal Types ───────────────────────────────────────────────────────────

type MembershipWithUser = {
  id: string;
  tenantId: string;
  userId: string;
  role: TenantRole;
  status: MembershipStatus;
  createdAt: Date;
  updatedAt: Date;
  user: {
    clerkUserId: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    imageUrl: string | null;
  };
};

// ─── Select Helpers ───────────────────────────────────────────────────────────

const memberSelectFields = {
  id: true,
  tenantId: true,
  userId: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      clerkUserId: true,
      email: true,
      firstName: true,
      lastName: true,
      imageUrl: true,
    },
  },
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toTeamMemberDTO(record: MembershipWithUser): TeamMemberDTO {
  return {
    id: record.id,
    tenantId: record.tenantId,
    userId: record.userId,
    role: record.role,
    status: record.status,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    user: {
      clerkUserId: record.user.clerkUserId,
      email: record.user.email,
      firstName: record.user.firstName,
      lastName: record.user.lastName,
      imageUrl: record.user.imageUrl,
    },
  };
}

// ─── Fetchers ─────────────────────────────────────────────────────────────────

/**
 * Returns a paginated list of team members for a tenant, including Clerk user info.
 *
 * Only accessible to ADMIN and OWNER roles.
 *
 * @param tenantId         - Tenant scope (server-side verified; never accept from client)
 * @param requestingUserId - Clerk user ID of the requesting user (RBAC check)
 * @param params           - Optional filter / pagination options
 * @returns Paginated TeamMemberListResult
 */
export async function getTeamMembersForTenant(
  tenantId: string,
  requestingUserId: string,
  params: TeamMemberListParams = { page: 1, pageSize: 20 }
): Promise<TeamMemberListResult> {
  await assertAdminOrOwner(tenantId, requestingUserId);

  const { page, pageSize, role, status } = params;
  const skip = (page - 1) * pageSize;

  const where = {
    tenantId,
    ...(role !== undefined && { role }),
    ...(status !== undefined && { status }),
  };

  const [records, total] = await Promise.all([
    prisma.tenantUserMembership.findMany({
      where,
      select: memberSelectFields,
      orderBy: { createdAt: "asc" },
      skip,
      take: pageSize,
    }),
    prisma.tenantUserMembership.count({ where }),
  ]);

  return {
    members: records.map(toTeamMemberDTO),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

/**
 * Returns a single team member by membership ID, scoped to the tenant.
 *
 * Returns null when not found or when it belongs to a different tenant.
 * Only accessible to ADMIN and OWNER roles.
 *
 * @param tenantId         - Tenant scope (server-side verified)
 * @param requestingUserId - Clerk user ID of the requesting user (RBAC check)
 * @param membershipId     - Membership record ID to look up
 * @returns TeamMemberDTO or null
 */
export async function getTeamMemberById(
  tenantId: string,
  requestingUserId: string,
  membershipId: string
): Promise<TeamMemberDTO | null> {
  await assertAdminOrOwner(tenantId, requestingUserId);

  const record = await prisma.tenantUserMembership.findFirst({
    where: {
      id: membershipId,
      tenantId,
    },
    select: memberSelectFields,
  });

  return record ? toTeamMemberDTO(record) : null;
}
