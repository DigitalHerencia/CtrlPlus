import { auth } from "@clerk/nextjs/server";
import { resolveTenantFromRequest } from "@/lib/tenancy/resolve";

/**
 * The session context returned by getSession().
 * Provides all authentication and tenant information for the current request.
 */
export interface SessionContext {
  /** Clerk user ID, or null if not authenticated */
  userId: string | null;
  /** Resolved tenant ID from the request host/subdomain */
  tenantId: string;
  /** Whether the current user is authenticated */
  isAuthenticated: boolean;
  /** Clerk organization ID, or null if not in an org context */
  orgId: string | null;
}

/**
 * @deprecated Use SessionContext instead.
 * Kept for backward compatibility.
 */
export interface SessionUser {
  id: string;
  clerkUserId: string;
  email: string;
}

/**
 * @deprecated Use SessionContext instead.
 * Kept for backward compatibility.
 */
export interface Session {
  user: SessionUser | null;
  tenantId: string;
  /** Convenience flag: true when user is authenticated */
  isAuthenticated: boolean;
  /** Convenience accessor: Clerk user ID or empty string when unauthenticated */
  userId: string;
}

/**
 * Resolves the current authenticated user and tenant from the Clerk session.
 * The tenantId is derived server-side from the request host, never from client input.
 *
 * @returns SessionContext with userId, tenantId, isAuthenticated, and orgId
 */
export async function getSession(): Promise<SessionContext> {
  const { userId, orgId } = await auth();

  // Resolve tenantId from request host (subdomain-based multi-tenancy).
  // Returns null if no subdomain is found (e.g., root domain or localhost without
  // a subdomain). We default to "" so callers can check `if (!tenantId)` easily,
  // and `assertTenantMembership` will reject any operation on an empty tenantId.
  const tenantId = (await resolveTenantFromRequest()) ?? "";

  return {
    userId: userId ?? null,
    tenantId,
    isAuthenticated: !!userId,
    orgId: orgId ?? null,
  };
}

/**
 * Requires the current user to be authenticated.
 * Throws an error if not authenticated.
 *
 * Use this in server actions and protected API routes to enforce authentication.
 *
 * @returns SessionContext guaranteed to have a non-null userId
 * @throws Error if not authenticated
 *
 * @example
 * ```typescript
 * export async function createWrap(input: CreateWrapInput) {
 *   const { userId, tenantId } = await requireAuth();
 *   await assertTenantMembership(tenantId, userId, 'ADMIN');
 *   // ...
 * }
 * ```
 */
export async function requireAuth(): Promise<SessionContext & { userId: string }> {
  const session = await getSession();

  if (!session.isAuthenticated || !session.userId) {
    throw new Error("Unauthorized: not authenticated");
  }

  return session as SessionContext & { userId: string };
}
