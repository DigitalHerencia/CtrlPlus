"use server";

import { prisma } from "@/lib/prisma";
import {
  getActiveLocalUserByClerkId,
  getActiveTenantMembershipsByUserId,
} from "@/lib/auth/local-user";
import { generateTenantSlug } from "@/lib/tenancy/slug";
import { resolveTenantFromRequest } from "@/lib/tenancy/resolve";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";

function getPrimaryEmailFromClerkUser(
  clerkUser: Awaited<ReturnType<typeof currentUser>>,
  clerkUserId: string,
): string {
  const primaryEmail =
    clerkUser?.emailAddresses.find((email) => email.id === clerkUser.primaryEmailAddressId) ??
    clerkUser?.emailAddresses[0];

  return primaryEmail?.emailAddress.toLowerCase() ?? `no-email+${clerkUserId}@local.invalid`;
}

function buildWorkspaceName(
  clerkUser: Awaited<ReturnType<typeof currentUser>>,
  clerkUserId: string,
  email: string,
): string {
  const fullName = [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ").trim();
  const emailLocalPart = email.split("@")[0]?.trim();
  return fullName || emailLocalPart || `${clerkUserId}'s Workspace`;
}

function isPrismaUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "P2002"
  );
}

async function createTenantWithUniqueSlug(
  name: string,
  slug: string,
): Promise<{ id: string; slug: string }> {
  let candidateSlug = slug;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      return await prisma.tenant.create({
        data: {
          name,
          slug: candidateSlug,
        },
        select: {
          id: true,
          slug: true,
        },
      });
    } catch (error) {
      if (!isPrismaUniqueConstraintError(error)) {
        throw error;
      }

      candidateSlug = generateTenantSlug({
        workspaceName: `${name}-${attempt + 1}`,
        email: `${slug}-${attempt + 1}@local.invalid`,
      });
    }
  }

  throw new Error("Unable to create a unique tenant slug");
}

async function syncDefaultTenantMetadata(clerkUserId: string, tenantId: string) {
  try {
    const client = await clerkClient();

    await client.users.updateUserMetadata(clerkUserId, {
      privateMetadata: {
        defaultTenantId: tenantId,
      },
    });
  } catch (error) {
    console.warn("[Auth] Failed to sync Clerk tenant metadata", error);
  }
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
  const user = await prisma.user.upsert({
    where: { clerkUserId },
    create: {
      clerkUserId,
      email,
      firstName: clerkUser?.firstName ?? null,
      lastName: clerkUser?.lastName ?? null,
    },
    update: {
      email,
      firstName: clerkUser?.firstName ?? null,
      lastName: clerkUser?.lastName ?? null,
      deletedAt: null,
    },
    select: { id: true },
  });

  let tenantId = await resolveTenantFromRequest();
  const memberships = await getActiveTenantMembershipsByUserId(user.id);

  if (!tenantId) {
    tenantId = memberships[0]?.tenantId ?? null;
  } else {
    const membership = memberships.find((item) => item.tenantId === tenantId);

    if (!membership) {
      throw new Error("Forbidden: this workspace requires an invitation");
    }
  }

  let createdTenant = false;

  if (!tenantId) {
    const workspaceName = buildWorkspaceName(clerkUser, clerkUserId, email);
    const slug = generateTenantSlug({
      workspaceName,
      email,
    });
    const tenant = await createTenantWithUniqueSlug(workspaceName, slug);

    tenantId = tenant.id;
    createdTenant = true;

    await prisma.auditLog.create({
      data: {
        tenantId,
        userId: clerkUserId,
        action: "TENANT_CREATED",
        resourceType: "Tenant",
        resourceId: tenantId,
        details: JSON.stringify({ slug }),
      },
    });
  }

  if (!tenantId) {
    throw new Error("Unable to resolve or create tenant");
  }

  if (createdTenant) {
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
  }

  await syncDefaultTenantMetadata(clerkUserId, tenantId);

  return tenantId;
}

export async function getUserFirstTenant(): Promise<string | null> {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return null;
  }

  const user = await getActiveLocalUserByClerkId(clerkUserId);

  if (!user) {
    return null;
  }

  const memberships = await getActiveTenantMembershipsByUserId(user.id);

  return memberships[0]?.tenantId ?? null;
}
