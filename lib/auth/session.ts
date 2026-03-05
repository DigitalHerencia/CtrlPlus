/**
 * Session Management
 *
 * Resolves the current user and tenant context.
 * Entry point for all auth checks in Server Components, Server Actions, and API routes.
 */

export interface SessionContext {
  /** Clerk user ID, or null if unauthenticated */
  userId: string | null;
  /** Resolved tenant ID for the current subdomain, or null */
  tenantId: string | null;
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
}

/**
 * Get current session context.
 *
 * Resolves user identity from Clerk and tenant from the request host/subdomain.
 * Both values are server-side resolved — never accept them from client input.
 *
 * @returns SessionContext with userId, tenantId, and isAuthenticated
 *
 * @example
 * ```typescript
 * // In a Server Action
 * 'use server';
 * export async function myAction(input: MyInput) {
 *   const { userId, tenantId } = await getSession();
 *   if (!userId || !tenantId) throw new Error('Unauthorized');
 *   // ... proceed
 * }
 * ```
 */
export async function getSession(): Promise<SessionContext> {
  // NOTE: @clerk/nextjs/server is resolved at runtime in the Next.js edge/node environment.
  // The dynamic import is used here so this module remains importable in test environments
  // where Clerk is not installed; tests mock this module directly.
  //
  // To install Clerk: npm install @clerk/nextjs
  const clerkModule = (await import("@clerk/nextjs/server").catch(
    () => null
  )) as { auth: () => Promise<{ userId: string | null }> } | null;

  if (!clerkModule) {
    // Clerk is not available (e.g. test environment without the package installed).
    return { userId: null, tenantId: null, isAuthenticated: false };
  }

  const { userId } = await clerkModule.auth();

  if (!userId) {
    return { userId: null, tenantId: null, isAuthenticated: false };
  }

  // Resolve tenant from host/subdomain (server-side only — NEVER from client input).
  const { resolveTenantFromRequest } = await import("@/lib/tenancy/resolve");
  const tenantId = await resolveTenantFromRequest();

  return {
    userId,
    tenantId,
    isAuthenticated: true,
  };
}
