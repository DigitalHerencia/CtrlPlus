import { z } from "zod";

import { type TenantRole } from "@/lib/tenancy/types";

// ─── DTOs ─────────────────────────────────────────────────────────────────────

/** Aggregated metrics for the admin dashboard */
export interface TenantStatsDTO {
  /** Total active team members */
  totalMembers: number;
  /** Total non-deleted bookings */
  totalBookings: number;
  /** Total revenue from paid invoices, in cents */
  totalRevenue: number;
}

/** A team member with their role inside the tenant */
export interface TeamMemberDTO {
  id: string;
  /** Clerk user ID */
  userId: string;
  role: TenantRole;
  createdAt: Date;
}

/** Tenant-level settings exposed to admin */
export interface TenantSettingsDTO {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

export const updateTenantSettingsSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
});

export type UpdateTenantSettingsInput = z.infer<typeof updateTenantSettingsSchema>;

export const setUserRoleSchema = z.object({
  /** Clerk user ID of the target user */
  targetUserId: z.string().min(1, "Target user ID is required"),
  role: z.enum(["owner", "admin", "member"]),
});

export type SetUserRoleInput = z.infer<typeof setUserRoleSchema>;
