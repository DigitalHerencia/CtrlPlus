import { type GlobalRole } from "@/lib/authz/types";

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

export function resolveGlobalRoleForClerkUserId(clerkUserId: string): GlobalRole {
  const platformDevClerkUserId = getPlatformDevClerkUserId();
  if (platformDevClerkUserId && clerkUserId === platformDevClerkUserId) {
    return "admin";
  }

  const ownerClerkUserId = getStoreOwnerClerkUserId();
  if (ownerClerkUserId && clerkUserId === ownerClerkUserId) {
    return "owner";
  }

  return "customer";
}
