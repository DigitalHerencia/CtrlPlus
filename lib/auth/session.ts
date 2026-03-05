/**
 * Session Management
 *
 * Resolves current user and tenant context from Clerk session.
 * Use this as the entry point for all auth checks in Server Components,
 * Server Actions, and API routes.
 */

import { resolveTenantFromRequest } from "@/lib/tenancy/resolve";
import { auth } from "@clerk/nextjs/server";

export interface SessionContext {
  /** Clerk user ID (null if not authenticated) */
  userId: string | null;
  /** Current tenant ID (null if not authenticated or no tenant) */
  tenantId: string | null;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Organization ID from Clerk (if using) */
  orgId: string | null;
}

/**
 * Get current session context with user and tenant information.
 *
 * @example
 * ```typescript
 * // In Server Component
 * export default async function DashboardPage() {
 *   const { userId, tenantId, isAuthenticated } = await getSession();
 *   if (!isAuthenticated) redirect('/sign-in');
 *   // ... use userId and tenantId
 * }
 *
 * // In Server Action
 * 'use server'
 * export async function createWrap(data: WrapInput) {
 *   const { userId, tenantId } = await getSession();
 *   if (!userId) throw new Error('Unauthorized');
 *   // ... proceed with mutation
 * }
 * ```
 */
export async function getSession(): Promise<SessionContext> {
  // Get Clerk auth state (MUST await in Server Components!)
  const { userId, orgId } = await auth();

  // Resolve tenant from request context
  const tenantId = userId ? await resolveTenantFromRequest() : null;

  return {
    userId,
    tenantId,
    isAuthenticated: !!userId,
    orgId: orgId ?? null,
  };
}

/**
 * Require authentication - throws if not authenticated.
 * Use this as a guard at the start of protected operations.
 *
 * @throws Error if user is not authenticated
 * @returns SessionContext with guaranteed non-null userId
 */
export async function requireAuth(): Promise<
  Required<Omit<SessionContext, "orgId">> & Pick<SessionContext, "orgId">
> {
  const session = await getSession();

  if (!session.isAuthenticated || !session.userId) {
    throw new Error("Unauthorized - Authentication required");
  }

  if (!session.tenantId) {
    throw new Error("Forbidden - No tenant context");
  }

  return {
    ...session,
    userId: session.userId,
    tenantId: session.tenantId,
    isAuthenticated: true,
  };
}
