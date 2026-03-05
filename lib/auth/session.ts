/**
 * Session Utilities
 *
 * Resolves the current authenticated user and their tenant context.
 * Stub implementation – replace with real Clerk integration once configured.
 */

import type { TenantRole } from "./rbac";

export interface Session {
  userId: string | null;
  clerkUserId: string | null;
  tenantId: string | null;
  tenantSlug: string | null;
  role: TenantRole | null;
  isAuthenticated: boolean;
}

/**
 * Resolves the current session from Clerk auth + Host header subdomain.
 *
 * In development, reads DEV_TENANT_ID / DEV_USER_ID environment variables
 * so routes work on localhost without a real subdomain.
 *
 * NOTE: This is a stub. In production replace with:
 *   import { auth, currentUser } from "@clerk/nextjs/server";
 */
export async function getSession(): Promise<Session> {
  // Stub: return a mock session for development
  const userId = process.env.DEV_USER_ID ?? "dev-user-1";
  const tenantId = process.env.DEV_TENANT_ID ?? "dev-tenant-1";
  const role = (process.env.DEV_USER_ROLE as TenantRole | undefined) ?? "OWNER";

  return {
    userId,
    clerkUserId: userId,
    tenantId,
    tenantSlug: "dev",
    role,
    isAuthenticated: true,
  };
}
