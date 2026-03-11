import { resolveGlobalRoleForClerkUserId } from "@/lib/auth/identity";
import { type AuthzContext } from "@/lib/authz/types";
import { auth } from "@clerk/nextjs/server";
import { cache } from "react";

/**
 * The session context returned by getSession().
 * Provides authentication and role context for the current request.
 */
export interface SessionContext {
  /** Clerk user ID, or null if not authenticated */
  userId: string | null;
  /** Whether the current user is authenticated */
  isAuthenticated: boolean;
  /** Unified authorization context */
  authz: AuthzContext;
  role: AuthzContext["role"];
  isOwner: boolean;
  isPlatformAdmin: boolean;
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
  /** Convenience flag: true when user is authenticated */
  isAuthenticated: boolean;
  /** Convenience accessor: Clerk user ID or empty string when unauthenticated */
  userId: string;
}

/**
 * Resolves the current authenticated user and authorization role from Clerk.
 */
export const getSession = cache(async (): Promise<SessionContext> => {
  const { userId: clerkUserId } = await auth();
  const isAuthenticated = Boolean(clerkUserId);
  const resolvedClerkUserId = clerkUserId ?? null;
  const role =
    resolvedClerkUserId && isAuthenticated
      ? resolveGlobalRoleForClerkUserId(resolvedClerkUserId)
      : "customer";

  const authz: AuthzContext = {
    userId: resolvedClerkUserId,
    role,
    isAuthenticated,
    isOwner: role === "owner",
    isPlatformAdmin: role === "admin",
  };

  return {
    userId: resolvedClerkUserId,
    isAuthenticated,
    authz,
    role: authz.role,
    isOwner: authz.isOwner,
    isPlatformAdmin: authz.isPlatformAdmin,
  };
});

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
 *   const { userId } = await requireAuth();
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
