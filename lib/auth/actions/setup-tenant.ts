"use server";

import { prisma } from "@/lib/prisma";
import { generateTenantSlug } from "@/lib/tenancy/slug";
import { resolveTenantFromRequest } from "@/lib/tenancy/resolve";
import { auth, currentUser } from "@clerk/nextjs/server";

const TENANT_FALLBACK_PREFIX = "tenant";

function getPrimaryEmailFromClerkUser(user: Awaited<ReturnType<typeof currentUser>>, clerkUserId: string): string {
  if (!user) {
    return `no-email+${clerkUserId.toLowerCase()}@local.invalid`;
  }

  const primaryEmail =
    user.emailAddresses.find((entry) => entry.id === user.primaryEmailAddressId)?.emailAddress ??
    user.emailAddresses[0]?.emailAddress ??
    null;

  return primaryEmail ? primaryEmail.trim().toLowerCase() : `no-email+${clerkUserId.toLowerCase()}@local.invalid`;
}

function getWorkspaceNameFromClerkUser(
  user: Awaited<ReturnType<typeof currentUser>>,
  fallbackEmail: string,
): string {
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();

  if (fullName.length > 0) {
    return `${fullName}'s Workspace`;
  }

  if (user?.username && user.username.trim().length > 0) {
    return `${user.username.trim()}'s Workspace`;
  }

  if (fallbackEmail) {
    const localPart = fallbackEmail.split("@")[0]?.trim();
    if (localPart) {
      return `${localPart}'s Workspace`;
    }
  }

  return "My Workspace";
}

async function reserveUniqueTenantSlug(baseSlug: string): Promise<string> {
  const collisionCandidates = await prisma.tenant.findMany({
    where: {
      slug: {
        startsWith: baseSlug,
      },
    },
    select: { slug: true },
  });

  const existingSlugs = new Set(collisionCandidates.map((candidate: { slug: string }) => candidate.slug));

  if (!existingSlugs.has(baseSlug)) {
    return baseSlug;
  }

  for (let suffix = 2; suffix < 5000; suffix += 1) {
    const suffixString = `-${suffix}`;
    const prefixLength = 63 - suffixString.length;
    const prefix = baseSlug.slice(0, prefixLength).replace(/-+$/g, "");
    const candidate = `${prefix}${suffixString}`;

    if (!existingSlugs.has(candidate)) {
      return candidate;
    }
  }

  throw new Error("Unable to reserve a unique tenant slug");
}

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
    const workspaceName = getWorkspaceNameFromClerkUser(clerkUser, email);
    const baseSlug = generateTenantSlug({
      workspaceName,
      email,
      fallbackPrefix: TENANT_FALLBACK_PREFIX,
    });
    const uniqueSlug = await reserveUniqueTenantSlug(baseSlug);

    const tenant = await prisma.tenant.create({
      data: {
        name: workspaceName,
        slug: uniqueSlug,
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
