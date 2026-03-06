"use server";

import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import {
  updateTenantSettingsSchema,
  type TenantSettingsDTO,
  type UpdateTenantSettingsInput,
} from "../types";

/**
 * Updates tenant configuration (name, slug).
 *
 * Security pipeline:
 * 1. Authenticate  — verify user is signed in
 * 2. Authorize     — verify caller is an owner of the tenant
 * 3. Validate      — parse and validate input with Zod
 * 4. Mutate        — apply settings updates scoped to tenantId
 * 5. Audit         — write an immutable audit entry
 */
export async function updateTenantSettings(
  input: UpdateTenantSettingsInput,
): Promise<TenantSettingsDTO> {
  // 1. AUTHENTICATE
  const { tenantId } = await getSession();
  if (!tenantId) throw new Error("Unauthorized: not authenticated");

  // 2. AUTHORIZE — only owners may change tenant settings
  await assertTenantMembership(tenantId, "owner");

  // 3. VALIDATE
  const parsed = updateTenantSettingsSchema.parse(input);

  // Build a partial update payload containing only provided fields
  const updateData: { name?: string; slug?: string } = {};
  if (parsed.name !== undefined) updateData.name = parsed.name;
  if (parsed.slug !== undefined) updateData.slug = parsed.slug;

  // 4. MUTATE (always scoped by tenantId via where: { id: tenantId })
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

  // 5. AUDIT
  await prisma.auditLog.create({
    data: {
      tenantId,
      userId: "owner",
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
    createdAt: tenant.createdAt,
    updatedAt: tenant.updatedAt,
  };
}
