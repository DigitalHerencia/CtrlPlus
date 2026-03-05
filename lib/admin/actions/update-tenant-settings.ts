"use server";

/**
 * Admin Action – Update Tenant Settings
 *
 * Security pipeline: authenticate → authorize (OWNER/ADMIN) → validate → mutate → audit
 */

import { getSession } from "@/lib/auth/session";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { prisma } from "@/lib/prisma";
import {
  updateTenantSettingsSchema,
  type UpdateTenantSettingsInput,
  type TenantSettings,
} from "../types";

export async function updateTenantSettings(
  input: UpdateTenantSettingsInput
): Promise<TenantSettings> {
  // Step 1: AUTHENTICATE
  const { clerkUserId, tenantId } = await getSession();
  if (!clerkUserId || !tenantId) {
    throw new Error("Unauthorized: not authenticated");
  }

  // Step 2: AUTHORIZE – only OWNER or ADMIN may update settings
  await assertTenantMembership(tenantId, clerkUserId, ["OWNER", "ADMIN"]);

  // Step 3: VALIDATE
  const parsed = updateTenantSettingsSchema.parse(input);

  // Step 4: MUTATE (scoped by tenantId)
  const tenant = (await prisma.tenant.update({
    where: { id: tenantId },
    data: {
      name: parsed.name,
      logoUrl: parsed.logoUrl ?? null,
      contactEmail: parsed.contactEmail ?? null,
      contactPhone: parsed.contactPhone ?? null,
      address: parsed.address ?? null,
    },
  })) as {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    address: string | null;
    updatedAt: Date;
  };

  // Step 5: AUDIT
  await prisma.auditLog.create({
    data: {
      tenantId,
      userId: clerkUserId,
      action: "UPDATE_TENANT_SETTINGS",
      resourceId: tenantId,
      details: JSON.stringify(parsed),
      timestamp: new Date(),
    },
  });

  return {
    id: tenant.id,
    name: tenant.name,
    slug: tenant.slug,
    logoUrl: tenant.logoUrl,
    contactEmail: tenant.contactEmail,
    contactPhone: tenant.contactPhone,
    address: tenant.address,
    updatedAt: tenant.updatedAt,
  };
}
