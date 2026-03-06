/**
 * Admin Domain Type Definitions
 *
 * DTOs and Zod schemas for admin operations.
 * Never expose raw Prisma models — always use these explicit types.
 */

import { z } from "zod";

// ── Role management ───────────────────────────────────────────────────────────

/**
 * Roles that can be assigned to tenant members.
 * "owner" is excluded to prevent privilege escalation via this action.
 */
export const assignableRoles = ["admin", "member"] as const;
export type AssignableRole = (typeof assignableRoles)[number];

export const updateUserRoleSchema = z.object({
  targetClerkUserId: z.string().min(1, "Target user ID is required"),
  role: z.enum(assignableRoles),
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;

export interface UserRoleDTO {
  tenantId: string;
  userId: string;
  role: AssignableRole;
  updatedAt: Date;
}

// ── Tenant settings ───────────────────────────────────────────────────────────

export const updateTenantSettingsSchema = z
  .object({
    name: z.string().min(1, "Name cannot be empty").max(100).optional(),
    slug: z
      .string()
      .min(1, "Slug cannot be empty")
      .max(63)
      .regex(
        /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
        "Slug must be lowercase alphanumeric, may contain hyphens, and cannot start or end with a hyphen",
      )
      .optional(),
  })
  .refine((data) => data.name !== undefined || data.slug !== undefined, {
    message: "At least one setting field must be provided",
  });

export type UpdateTenantSettingsInput = z.infer<typeof updateTenantSettingsSchema>;

import { type TenantRole } from "@/lib/tenancy/types";
import { type JSX } from "react/jsx-runtime";
import { type ReactNode } from "react";

// ─── Tenant Stats ──────────────────────────────────────────────────────────────

/** Dashboard metrics for a tenant. Returned by getTenantStats. */
export interface TenantStatsDTO {
  totalMembers: string | number;
  totalBookings: string | number;
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

/** Full list of team members for a tenant. */
export interface TeamMemberListDTO {
  length: number;
  map(arg0: (member: TeamMemberDTO) => JSX.Element): ReactNode;
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
