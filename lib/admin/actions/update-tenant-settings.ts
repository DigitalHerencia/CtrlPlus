"use server";

/**
 * Update Tenant Settings Action
 *
 * Mutates top-level settings for the current tenant (name, logo, colour, business hours).
 * Requires OWNER role — only owners may change tenant-wide configuration.
 *
 * Security pipeline: authenticate → authorize (OWNER) → validate → mutate → audit
 */

import { getSession } from "@/lib/auth/session";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { prisma } from "@/lib/prisma";
import {
  updateTenantSettingsSchema,
  type UpdateTenantSettingsInput,
  type UpdateTenantSettingsResult,
} from "../types";

export async function updateTenantSettings(
  input: UpdateTenantSettingsInput
): Promise<UpdateTenantSettingsResult> {
  // ── Step 1: AUTHENTICATE ──────────────────────────────────────────────────
  const { userId, tenantId } = await getSession();
  if (!userId || !tenantId) {
    throw new Error("Unauthorized: not authenticated");
  }

  // ── Step 2: AUTHORIZE ─────────────────────────────────────────────────────
  // Only OWNER can change tenant-wide settings.
  await assertTenantMembership(tenantId, userId, "OWNER");

  // ── Step 3: VALIDATE ──────────────────────────────────────────────────────
  const parsed = updateTenantSettingsSchema.parse(input);

  // Guard: at least one field must be present.
  const hasUpdates = Object.values(parsed).some((v) => v !== undefined);
  if (!hasUpdates) {
    throw new Error("Validation error: no settings fields provided");
  }

  // ── Step 4: MUTATE ────────────────────────────────────────────────────────
  // Build the update payload — only include fields that were explicitly provided.
  // Using Object.entries ensures we don't need to manually list each field as new
  // fields are added to the schema.
  const updateData = Object.fromEntries(
    Object.entries(parsed).filter(([, value]) => value !== undefined)
  ) as Record<string, unknown>;

  const tenant = await prisma.tenant.update({
    where: { id: tenantId },
    data: updateData,
    select: {
      id: true,
      name: true,
      logoUrl: true,
      primaryColor: true,
      businessHours: true,
      updatedAt: true,
    },
  });

  // ── Step 5: AUDIT ─────────────────────────────────────────────────────────
  await prisma.auditEvent.create({
    data: {
      tenantId,
      userId,
      action: "admin.settings.updated",
      resource: `tenant:${tenantId}`,
      metadata: { changes: updateData } as object,
    },
  });

  return {
    tenantId: tenant.id,
    name: tenant.name,
    logoUrl: tenant.logoUrl,
    primaryColor: tenant.primaryColor,
    businessHours: tenant.businessHours as Record<string, unknown> | null,
    updatedAt: tenant.updatedAt,
  };
}

// Re-export the Zod schema for use in form validation on the client side.
export { updateTenantSettingsSchema };
export type { UpdateTenantSettingsInput };
