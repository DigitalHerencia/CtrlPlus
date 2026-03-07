import { prisma } from "@/lib/prisma"
import { resolveTenantFromRequest } from "@/lib/tenancy/resolve"
import { auth } from "@clerk/nextjs/server"

/**
 * The session context returned by getSession().
 * Provides all authentication and tenant information for the current request.
 */
export interface SessionContext {
  /** Clerk user ID, or null if not authenticated */
  userId: string | null
  /** Resolved tenant ID from the request host/subdomain */
  tenantId: string
  /** Whether the current user is authenticated */
  isAuthenticated: boolean
  /** Clerk organization ID, or null if not in an org context */
  orgId: string | null
}

/**
 * @deprecated Use SessionContext instead.
 * Kept for backward compatibility.
 */
export interface SessionUser {
  id: string
  clerkUserId: string
  email: string
}

/**
 * @deprecated Use SessionContext instead.
 * Kept for backward compatibility.
 */
export interface Session {
  user: SessionUser | null
  tenantId: string
  /** Convenience flag: true when user is authenticated */
  isAuthenticated: boolean
  /** Convenience accessor: Clerk user ID or empty string when unauthenticated */
  userId: string
}

/**
 * Resolves the current authenticated user and tenant from the Clerk session.
 * The tenantId is derived server-side from the request host, never from client input.
 *
 * Tenant resolution strategy:
 * 1. First, try to resolve from subdomain (multi-tenant scenario)
 * 2. If no subdomain, fall back to user's first tenant (single-user account)
 * 3. Otherwise return empty string
 *
 * @returns SessionContext with userId, tenantId, isAuthenticated, and orgId
 */
export async function getSession(): Promise<SessionContext> {
  const { userId, orgId } = await auth()

  // Resolve tenantId from request host (subdomain-based multi-tenancy).
  let tenantId = (await resolveTenantFromRequest()) ?? ""

  // Fallback: if no subdomain and user is authenticated, use their first tenant
  if (!tenantId && userId) {
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { id: true }
    })

    if (user) {
      const membership = await prisma.tenantUserMembership.findFirst({
        where: {
          userId: user.id,
          deletedAt: null
        },
        select: { tenantId: true },
        orderBy: { createdAt: "asc" }
      })

      if (membership) {
        tenantId = membership.tenantId
      }
    }
  }

  return {
    userId: userId ?? null,
    tenantId,
    isAuthenticated: !!userId,
    orgId: orgId ?? null
  }
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
  const session = await getSession()

  if (!session.isAuthenticated || !session.userId) {
    throw new Error("Unauthorized: not authenticated")
  }

  return session as SessionContext & { userId: string }
}
