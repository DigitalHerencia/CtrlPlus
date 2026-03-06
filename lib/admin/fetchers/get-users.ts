import { prisma } from "@/lib/prisma";
import { type TenantRole } from "@/lib/tenancy/types";
import { type TeamMemberDTO, type TeamMemberListDTO } from "../types";

// ─── Select helpers ───────────────────────────────────────────────────────────

const memberDTOFields = {
  id: true,
  userId: true,
  tenantId: true,
  role: true,
  createdAt: true,
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toTeamMemberDTO(record: {
  id: string;
  userId: string;
  tenantId: string;
  role: string;
  createdAt: Date;
}): TeamMemberDTO {
  return {
    id: record.id,
    userId: record.userId,
    tenantId: record.tenantId,
    role: record.role as TenantRole,
    createdAt: record.createdAt,
  };
}

// ─── Fetchers ─────────────────────────────────────────────────────────────────

/**
 * Returns all active team members for a tenant.
 *
 * @param tenantId - Tenant scope (server-side verified; never accept from client)
 * @returns TeamMemberListDTO with members ordered by creation date ascending
 */
export async function getTeamMembers(tenantId: string): Promise<TeamMemberListDTO> {
  const records = await prisma.tenantUserMembership.findMany({
    where: { tenantId, deletedAt: null },
    orderBy: { createdAt: "asc" },
    select: memberDTOFields,
  });

  const members = records.map(toTeamMemberDTO);

  return { members, total: members.length };
}

/**
 * Returns a single active team member by membership ID, scoped to tenant.
 *
 * @param tenantId    - Tenant scope (server-side verified)
 * @param membershipId - TenantUserMembership primary key
 * @returns TeamMemberDTO or null if not found / wrong tenant
 */
export async function getTeamMemberById(
  tenantId: string,
  membershipId: string,
): Promise<TeamMemberDTO | null> {
  const record = await prisma.tenantUserMembership.findFirst({
    where: { id: membershipId, tenantId, deletedAt: null },
    select: memberDTOFields,
  });

  return record ? toTeamMemberDTO(record) : null;
}
