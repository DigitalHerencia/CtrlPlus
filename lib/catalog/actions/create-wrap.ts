"use server";

import { getSession } from "@/lib/auth/session";
import { assertTenantMembership } from "@/lib/tenancy/assert";
import { prisma } from "@/lib/prisma";
import { createWrapSchema, type CreateWrapInput, type WrapDTO } from "../types";

/**
 * Creates a new wrap in the catalog for the current tenant.
 *
 * Security pipeline:
 * 1. Authenticate  — verify user is signed in
 * 2. Authorize     — verify user is an admin or owner of the tenant
 * 3. Validate      — parse and validate input with Zod
 * 4. Mutate        — create the record scoped to tenantId
 * 5. Audit         — write an immutable audit event
 */
export async function createWrap(input: CreateWrapInput): Promise<WrapDTO> {
  // 1. AUTHENTICATE
  const { user, tenantId } = await getSession();
  if (!user) throw new Error("Unauthorized: not authenticated");

  // 2. AUTHORIZE
  await assertTenantMembership(tenantId, user.id, ["OWNER", "ADMIN"]);

  // 3. VALIDATE
  const parsed = createWrapSchema.parse(input);

  // 4. MUTATE (always scoped by tenantId)
  const wrap = await prisma.wrap.create({
    data: {
      tenantId,
      name: parsed.name,
      description: parsed.description ?? null,
      price: parsed.price,
      estimatedHours: parsed.estimatedHours,
      imageUrls: parsed.imageUrls,
      category: parsed.category,
      status: parsed.status,
    },
  });

  // 5. AUDIT
  await prisma.auditEvent.create({
    data: {
      tenantId,
      userId: user.id,
      action: "wrap.created",
      resource: `wrap:${wrap.id}`,
      metadata: {
        name: wrap.name,
        category: wrap.category,
        price: wrap.price.toString(),
      },
    },
  });

  return {
    id: wrap.id,
    tenantId: wrap.tenantId,
    name: wrap.name,
    description: wrap.description,
    price: wrap.price.toString(),
    estimatedHours: wrap.estimatedHours,
    status: wrap.status as WrapDTO["status"],
    imageUrls: wrap.imageUrls,
    category: wrap.category as WrapDTO["category"],
    createdAt: wrap.createdAt,
    updatedAt: wrap.updatedAt,
  };
}
