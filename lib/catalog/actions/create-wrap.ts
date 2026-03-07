"use server";

import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { createWrapSchema, type CreateWrapInput, type WrapDTO } from "../types";

/**
 * Creates a new wrap in the catalog for the current tenant.
 *
 * Security pipeline:
 * 1. Authenticate  — verify user is signed in
 * 2. Authorize     — verify user is an admin or owner of the tenant
 * 3. Validate      — parse and validate input with Zod
 * 4. Mutate        — create the record scoped to tenantId
 * 5. Audit         — write an immutable audit log entry
 */
export async function createWrap(input: CreateWrapInput): Promise<WrapDTO> {
  // 1. AUTHENTICATE
  const { userId, tenantId } = await requireAuth();

  // 2. AUTHORIZE
  await assertTenantMembership(tenantId, userId, "admin");

  // 3. VALIDATE
  const parsed = createWrapSchema.parse(input);

  // 4. MUTATE (always scoped by tenantId)
  const wrap = await prisma.wrap.create({
    data: {
      tenantId,
      name: parsed.name,
      description: parsed.description ?? null,
      price: parsed.price,
      installationMinutes: parsed.installationMinutes ?? null,
    },
  });

  // 5. AUDIT
  await prisma.auditLog.create({
    data: {
      tenantId,
      userId,
      action: "wrap.created",
      resourceType: "Wrap",
      resourceId: wrap.id,
      details: JSON.stringify({ name: wrap.name, price: wrap.price }),
      timestamp: new Date(),
    },
  });

  return {
    id: wrap.id,
    tenantId: wrap.tenantId,
    name: wrap.name,
    description: wrap.description,
    price: wrap.price,
    installationMinutes: wrap.installationMinutes,
    createdAt: wrap.createdAt,
    updatedAt: wrap.updatedAt,
  };
}
