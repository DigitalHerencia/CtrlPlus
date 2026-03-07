"use server";

import { prisma } from "@/lib/prisma";
import { generateTenantSlug } from "@/lib/tenancy/slug";
import { resolveTenantFromRequest } from "@/lib/tenancy/resolve";
import { generateTenantSlug } from "@/lib/tenancy/slug";
import { auth } from "@clerk/nextjs/server";

/**
 * Setup initial tenant for newly authenticated user.
 */
export async function setupUserTenant(): Promise<string> {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    throw new Error("Unauthorized: not authenticated");
  }

  const clerkUser = await currentUser();
  const email = getPrimaryEmailFromClerkUser(clerkUser, clerkUserId);

  let user = await prisma.user.findUnique({
    where: { clerkUserId },
    select: { id: true },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkUserId,
        email,
        firstName: clerkUser?.firstName ?? null,
        lastName: clerkUser?.lastName ?? null,
      },
      select: { id: true },
    });
  }

  let tenantId = await resolveTenantFromRequest();

  if (!tenantId) {
    // No subdomain provided - create a new tenant for this user
    // Use deterministic normalized slug generation for tenant safety.
    const tenant = await prisma.tenant.create({
      data: {
        name: `${clerkUserId}'s Workspace`,
        slug: generateTenantSlug(clerkUserId),
      },
      select: { id: true },
    });

    tenantId = tenant.id;

    await prisma.auditLog.create({
      data: {
        tenantId,
        userId: clerkUserId,
        action: "TENANT_CREATED",
        resourceType: "Tenant",
        resourceId: tenantId,
        details: JSON.stringify({ slug: uniqueSlug }),
      },
    });
  }

  if (!tenantId) {
    throw new Error("Unable to resolve or create tenant");
  }

  await prisma.tenantUserMembership.upsert({
    where: {
      tenantId_userId: {
        tenantId,
        userId: user.id,
      },
    },
    create: {
      tenantId,
      userId: user.id,
      role: "owner",
    },
    update: {
      deletedAt: null,
      role: "owner",
    },
  });

  await prisma.auditLog.create({
    data: {
      tenantId,
      userId: clerkUserId,
      action: "TENANT_MEMBERSHIP_UPSERTED",
      resourceType: "TenantUserMembership",
      resourceId: user.id,
      details: JSON.stringify({ role: "owner" }),
    },
  });

  return tenantId;
}

export async function getUserFirstTenant(): Promise<string | null> {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId },
    select: { id: true },
  });

  if (!user) {
    return null;
  }

  const membership = await prisma.tenantUserMembership.findFirst({
    where: {
      userId: user.id,
      deletedAt: null,
    },
    select: { tenantId: true },
    orderBy: { createdAt: "asc" },
  });

  return membership?.tenantId ?? null;
}
