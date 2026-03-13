import { type GlobalRole } from "@/lib/authz/types";
import { prisma } from "@/lib/prisma";

function readOptionalEnv(name: "STORE_OWNER_CLERK_USER_ID" | "PLATFORM_DEV_CLERK_USER_ID") {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : null;
}

export function getStoreOwnerClerkUserId(): string | null {
  return readOptionalEnv("STORE_OWNER_CLERK_USER_ID");
}

export function getPlatformDevClerkUserId(): string | null {
  return readOptionalEnv("PLATFORM_DEV_CLERK_USER_ID");
}

function isGlobalRole(value: string | null | undefined): value is GlobalRole {
  return value === "customer" || value === "owner" || value === "admin";
}

export function resolveGlobalRoleOverrideForClerkUserId(clerkUserId: string): GlobalRole | null {
  const platformDevClerkUserId = getPlatformDevClerkUserId();
  if (platformDevClerkUserId && clerkUserId === platformDevClerkUserId) {
    return "admin";
  }

  const ownerClerkUserId = getStoreOwnerClerkUserId();
  if (ownerClerkUserId && clerkUserId === ownerClerkUserId) {
    return "owner";
  }

  return null;
}

/**
 * Hybrid role resolution:
 * 1) explicit env overrides (for bootstrap/dev safety),
 * 2) persisted DB role fallback,
 * 3) default customer.
 */
export async function resolveGlobalRoleForClerkUserId(clerkUserId: string): Promise<GlobalRole> {
  const overrideRole = resolveGlobalRoleOverrideForClerkUserId(clerkUserId);
  if (overrideRole) {
    return overrideRole;
  }

  const user = await prisma.user.findFirst({
    where: {
      clerkUserId,
      deletedAt: null,
    },
    select: {
      globalRole: true,
    },
  });

  if (isGlobalRole(user?.globalRole)) {
    return user.globalRole;
  }

  return "customer";
}
