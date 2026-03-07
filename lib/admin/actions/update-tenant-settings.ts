"use server";

import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { normalizeTenantSlug } from "@/lib/tenancy/slug";
import {
  updateTenantSettingsSchema,
  type TenantSettingsDTO,
  type UpdateTenantSettingsInput,
} from "../types";

/**
 * Updates tenant configuration (name, slug).
 */
export async function updateTenantSettings(
  input: UpdateTenantSettingsInput,
): Promise<TenantSettingsDTO> {
  const { tenantId, userId } = await getSession();
  if (!tenantId || !userId) throw new Error("Unauthorized: not authenticated");

  await assertTenantMembership(tenantId, userId, "owner");

  const parsed = updateTenantSettingsSchema.parse(input);

  const updateData: { name?: string; slug?: string } = {};
  if (parsed.name !== undefined) updateData.name = parsed.name;
  if (parsed.slug !== undefined) {
    const normalizedSlug = normalizeTenantSlug(parsed.slug);
    if (!normalizedSlug) {
      throw new Error("ValidationError: invalid tenant slug");
    }
    updateData.slug = normalizedSlug;
  }

  let tenant;
  try {
    tenant = await prisma.tenant.update({
      where: { id: tenantId },
      data: updateData,
    });
  } catch (err: unknown) {
    const code = (err as { code?: string }).code;
    if (code === "P2002") {
      throw new Error("Conflict: slug is already in use by another tenant");
    }
    if (code === "P2025") {
      throw new Error("Forbidden: tenant not found");
    }
    throw err;
  }

  await prisma.auditLog.create({
    data: {
      tenantId,
      userId,
      action: "tenant.settings_updated",
      resourceType: "Tenant",
      resourceId: tenantId,
      details: JSON.stringify(updateData),
    },
  });

  return {
    id: tenant.id,
    name: tenant.name,
    slug: tenant.slug,
    createdAt: tenant.createdAt.toISOString(),
    updatedAt: tenant.updatedAt.toISOString(),
  };
}
