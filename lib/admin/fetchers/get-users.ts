import { prisma } from "@/lib/prisma";
import { type TenantRole, ROLE_HIERARCHY } from "@/lib/tenancy/types";
import { assertAdminOrOwner } from "../rbac";
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

/** Valid roles derived from the role hierarchy definition. */
const VALID_ROLES = Object.keys(ROLE_HIERARCHY) as TenantRole[];

/**
 * Validates and parses a raw DB role string into a TenantRole.
 * Throws if the value is not a recognized role.
 */
function parseRole(role: string): TenantRole {
  if (VALID_ROLES.includes(role as TenantRole)) {
    return role as TenantRole;
  }
  throw new Error(`Invalid role value in database: "${role}"`);
}

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
    role: parseRole(record.role),
    createdAt: record.createdAt,
  };
}

// ─── Fetchers ─────────────────────────────────────────────────────────────────

/**
 * Returns all active team members for a tenant.
 *
 * @param tenantId         - Tenant scope (server-side verified; never accept from client)
 * @param requestingUserId - Clerk user ID of the caller; must be admin or owner
 * @returns TeamMemberListDTO with members ordered by creation date ascending
 * @throws Error if caller is not an admin or owner of the tenant
 */
export async function getTeamMembers(
  tenantId: string,
  requestingUserId: string,
): Promise<TeamMemberListDTO> {
  await assertAdminOrOwner(tenantId, requestingUserId);

  const records = await prisma.tenantUserMembership.findMany({
    where: { tenantId, deletedAt: null },
    orderBy: { createdAt: "asc" },
    select: memberDTOFields,
  });

  const members = records.map(toTeamMemberDTO);
  return {
    members,
    total: members.length,
  } as TeamMemberListDTO;
}

/**
 * Returns a single active team member by membership ID, scoped to tenant.
 *
 * @param tenantId         - Tenant scope (server-side verified)
 * @param membershipId     - TenantUserMembership primary key
 * @param requestingUserId - Clerk user ID of the caller; must be admin or owner
 * @returns TeamMemberDTO or null if not found / wrong tenant
 * @throws Error if caller is not an admin or owner of the tenant
 */
export async function getTeamMemberById(
  tenantId: string,
  membershipId: string,
  requestingUserId: string,
): Promise<TeamMemberDTO | null> {
  await assertAdminOrOwner(tenantId, requestingUserId);

  const record = await prisma.tenantUserMembership.findFirst({
    where: { id: membershipId, tenantId, deletedAt: null },
    select: memberDTOFields,
  });

  return record ? toTeamMemberDTO(record) : null;
}
