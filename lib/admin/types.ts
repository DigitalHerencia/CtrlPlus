import { z } from "zod";
import { MembershipStatus, TenantRole } from "@prisma/client";

// ─── Team Member DTOs ─────────────────────────────────────────────────────────

/** Clerk user info embedded in team member responses. */
export interface TeamMemberClerkUserDTO {
  clerkUserId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
}

/** Read model returned by team-member fetchers. Never exposes raw Prisma model. */
export interface TeamMemberDTO {
  id: string;
  tenantId: string;
  userId: string;
  role: TenantRole;
  status: MembershipStatus;
  createdAt: Date;
  updatedAt: Date;
  user: TeamMemberClerkUserDTO;
}

export interface TeamMemberListResult {
  members: TeamMemberDTO[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const teamMemberListParamsSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  role: z.nativeEnum(TenantRole).optional(),
  status: z.nativeEnum(MembershipStatus).optional(),
});

export type TeamMemberListParams = z.infer<typeof teamMemberListParamsSchema>;

// ─── Tenant Metrics ───────────────────────────────────────────────────────────

/** Aggregate metrics for the tenant admin dashboard. */
export interface TenantMetricsDTO {
  totalWraps: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  /** Sum of all PAID invoice amounts converted to a JavaScript number. Preserves the decimal precision from the database (e.g. 1234.56 means $1234.56). */
  totalRevenue: number;
  totalActiveMembers: number;
}
