/**
 * Admin Domain Types
 *
 * DTOs and Zod validation schemas for admin role management and tenant settings.
 */

import { z } from "zod";
import { type TenantRole } from "@/lib/tenancy/types";

// ─── Role Management ─────────────────────────────────────────────────────────

/** Roles that can be assigned to tenant members via the admin panel */
export const ASSIGNABLE_ROLES = [
  "OWNER",
  "ADMIN",
  "MEMBER",
] as const satisfies readonly TenantRole[];

export const updateUserRoleSchema = z.object({
  /**
   * The Clerk user ID of the member whose role should be updated.
   * This is the external Clerk identifier (e.g. "user_2abc..."), NOT the internal DB id.
   * Obtain it from the members list fetcher.
   */
  targetClerkUserId: z.string().min(1, "Target user Clerk ID is required"),
  /** The new role to assign */
  newRole: z.enum(["OWNER", "ADMIN", "MEMBER"]),
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;

/** DTO returned after a successful role update */
export interface UpdateUserRoleResult {
  membershipId: string;
  /** Clerk user ID of the member whose role was updated */
  targetClerkUserId: string;
  newRole: TenantRole;
  updatedAt: Date;
}

// ─── Tenant Settings ──────────────────────────────────────────────────────────

export const updateTenantSettingsSchema = z.object({
  /** Display name of the tenant / business */
  name: z.string().min(1, "Name is required").max(100).optional(),
  /** URL of the tenant logo image */
  logoUrl: z.string().url("Must be a valid URL").nullable().optional(),
  /** Hex or CSS colour string for the tenant brand */
  primaryColor: z
    .string()
    .regex(
      /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/,
      "Must be a valid hex colour (e.g. #FF0000)"
    )
    .nullable()
    .optional(),
  /** Business hours keyed by weekday */
  businessHours: z
    .record(
      z.string(),
      z.object({
        open: z.string().regex(/^\d{2}:\d{2}$/, "Must be HH:MM"),
        close: z.string().regex(/^\d{2}:\d{2}$/, "Must be HH:MM"),
        closed: z.boolean().optional(),
      })
    )
    .nullable()
    .optional(),
});

export type UpdateTenantSettingsInput = z.infer<
  typeof updateTenantSettingsSchema
>;

/** DTO returned after a successful settings update */
export interface UpdateTenantSettingsResult {
  tenantId: string;
  name: string;
  logoUrl: string | null;
  primaryColor: string | null;
  businessHours: Record<string, unknown> | null;
  updatedAt: Date;
}
