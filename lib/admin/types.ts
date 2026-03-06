import { type TenantRole } from "@/lib/tenancy/types";

// ─── Tenant Stats ──────────────────────────────────────────────────────────────

/** Dashboard metrics for a tenant. Returned by getTenantStats. */
export interface TenantStatsDTO {
  /** Number of active (non-deleted) wraps */
  wrapCount: number;
  /** Number of active (non-deleted) team members */
  memberCount: number;
  /** Number of active (non-deleted) bookings */
  bookingCount: number;
  /** Sum of totalAmount for all paid invoices, in cents */
  totalRevenue: number;
}

// ─── Team Members ─────────────────────────────────────────────────────────────

/** A single team-member record returned by admin fetchers. */
export interface TeamMemberDTO {
  id: string;
  userId: string;
  tenantId: string;
  role: TenantRole;
  createdAt: Date;
}

/** Paginated list of team members. */
export interface TeamMemberListDTO {
  members: TeamMemberDTO[];
  total: number;
}

// ─── Tenant Settings ──────────────────────────────────────────────────────────

/** Tenant configuration returned by getTenantSettings. */
export interface TenantSettingsDTO {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}
