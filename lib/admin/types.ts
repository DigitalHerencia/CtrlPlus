/**
 * Admin Domain – Type Definitions
 *
 * DTOs returned from admin fetchers and accepted by admin actions.
 * Never expose raw Prisma models – always use these explicit types.
 */

import { z } from "zod";
import type { TenantRole } from "@/lib/auth/rbac";

// ---------------------------------------------------------------------------
// DTOs
// ---------------------------------------------------------------------------

export interface TenantStats {
  totalWraps: number;
  totalBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  totalMembers: number;
}

export interface TeamMember {
  id: string;
  clerkUserId: string;
  name: string;
  email: string;
  role: TenantRole;
  status: "ACTIVE" | "INACTIVE";
  joinedAt: Date;
}

export interface TenantSettings {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Input Validation Schemas
// ---------------------------------------------------------------------------

export const updateTenantSettingsSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  logoUrl: z.string().url("Must be a valid URL").nullable().optional(),
  contactEmail: z.string().email("Must be a valid email").nullable().optional(),
  contactPhone: z.string().max(30).nullable().optional(),
  address: z.string().max(255).nullable().optional(),
});

export type UpdateTenantSettingsInput = z.infer<
  typeof updateTenantSettingsSchema
>;

export const setUserRoleSchema = z.object({
  membershipId: z.string().min(1, "Membership ID is required"),
  role: z.enum(["OWNER", "ADMIN", "MEMBER"] as const),
});

export type SetUserRoleInput = z.infer<typeof setUserRoleSchema>;
