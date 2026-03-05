/**
 * Admin Fetcher – Team Members
 *
 * Returns the list of users in a tenant, scoped by tenantId.
 * Filters soft-deleted / inactive members as needed.
 */

import { prisma } from "@/lib/prisma";
import type { TeamMember } from "../types";

/** Shape of a membership row with included user, as returned by Prisma stub */
interface MembershipRow {
  id: string;
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

function mapMembershipToDTO(m: MembershipRow): TeamMember {
  return {
    id: m.id,
    clerkUserId: m.user.clerkUserId,
    name: m.user.name ?? m.user.email,
    email: m.user.email,
    role: m.role as TeamMember["role"],
    status: m.status as TeamMember["status"],
    joinedAt: m.createdAt,
  };
}

/**
 * Returns all active team members for the given tenant.
 *
 * @param tenantId - Server-side resolved tenant scope
 * @returns Array of TeamMember DTOs
 */
export async function getUsersForTenant(
  tenantId: string
): Promise<TeamMember[]> {
  const memberships = await prisma.tenantUserMembership.findMany({
    where: { tenantId, status: "ACTIVE" },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });

  return ((memberships as MembershipRow[]) ?? []).map(mapMembershipToDTO);
}

/**
 * Returns a single team member by membership ID, scoped to the tenant.
 *
 * @param tenantId - Server-side resolved tenant scope
 * @param membershipId - Membership record ID
 * @returns TeamMember DTO or null
 */
export async function getTeamMemberById(
  tenantId: string,
  membershipId: string
): Promise<TeamMember | null> {
  const m = (await prisma.tenantUserMembership.findFirst({
    where: { id: membershipId, tenantId, status: "ACTIVE" },
    include: { user: true },
  })) as MembershipRow | null;

  if (!m) return null;

  return mapMembershipToDTO(m);
}
