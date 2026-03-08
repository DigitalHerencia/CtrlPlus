import { prisma } from "@/lib/prisma";
import { normalizeTenantRole } from "@/lib/tenancy/types";
// All roles have access; no RBAC check needed
import { assertAdminOrOwner } from "../rbac";
import { type TeamMemberDTO, type TeamMemberListDTO } from "../types";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 50;

const memberDTOFields = {
  id: true,
  userId: true,
  tenantId: true,
  user: {
    select: { clerkUserId: true },
  },
  role: true,
  createdAt: true,
} as const;

function toTeamMemberDTO(record: {
  id: string;
  userId: string;
  tenantId: string;
  role: string;
  createdAt: Date;
  user: {
    clerkUserId: string;
  };
}): TeamMemberDTO {
  return {
    id: record.id,
    userId: record.userId,
    tenantId: record.tenantId,
    clerkUserId: record.user.clerkUserId,
    role: normalizeTenantRole(record.role),
    createdAt: record.createdAt.toISOString(),
  };
}

export async function getTeamMembers(tenantId: string): Promise<TeamMemberListDTO> {
  await assertAdminOrOwner();

  const records = await prisma.tenantUserMembership.findMany({
    where: {
      tenantId,
      deletedAt: null,
      user: {
        deletedAt: null,
      },
    },
    orderBy: { createdAt: "asc" },
    select: memberDTOFields,
  });

  const members = records.map(toTeamMemberDTO);
  return {
    members,
    total: members.length,
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(members.length / DEFAULT_PAGE_SIZE)),
  };
}

export async function getTeamMemberById(
  tenantId: string,
  membershipId: string,
): Promise<TeamMemberDTO | null> {
  await assertAdminOrOwner();

  const record = await prisma.tenantUserMembership.findFirst({
    where: {
      id: membershipId,
      tenantId,
      deletedAt: null,
      user: {
        deletedAt: null,
      },
    },
    select: memberDTOFields,
  });

  return record ? toTeamMemberDTO(record) : null;
}
