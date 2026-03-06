import { prisma } from "@/lib/prisma";
import { type TenantRole } from "@/lib/tenancy/types";
import { type TeamMemberDTO } from "../types";

// ─── Select helper ────────────────────────────────────────────────────────────

const teamMemberSelectFields = {
  id: true,
  userId: true,
  role: true,
  createdAt: true,
} as const;

// ─── Fetchers ─────────────────────────────────────────────────────────────────

/**
 * Returns all active team members for a tenant.
 *
 * @param tenantId - Tenant scope (server-side verified; never accept from client)
 * @returns Array of TeamMemberDTOs ordered by creation date ascending
 */
export async function getUsersForTenant(tenantId: string): Promise<TeamMemberDTO[]> {
  const members = await prisma.tenantUserMembership.findMany({
    where: {
      tenantId,
      deletedAt: null,
    },
    select: teamMemberSelectFields,
    orderBy: { createdAt: "asc" },
  });

  return members.map((m: { id: string; userId: string; role: string; createdAt: Date }) => ({
    id: m.id,
    userId: m.userId,
    role: m.role as TenantRole,
    createdAt: m.createdAt,
  }));
}
