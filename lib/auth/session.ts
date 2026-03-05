/**
 * Session helpers.
 *
 * In production this integrates with Clerk via `@clerk/nextjs/server`.
 * The stub below returns a deterministic dev session so the rest of the
 * codebase can be developed and tested without a live Clerk instance.
 */

export interface Session {
  user: {
    id: string;
    clerkUserId: string;
    email: string;
  } | null;
  tenantId: string;
}

/**
 * Resolves the current authenticated session from request context.
 *
 * Throws if called outside of a Next.js server context.
 */
export async function getSession(): Promise<Session> {
  // TODO: replace with real Clerk auth once @clerk/nextjs is installed.
  // import { auth } from '@clerk/nextjs/server';
  // const { userId } = await auth();
  // ...

  return {
    user: {
      id: "dev-user-id",
      clerkUserId: "dev-clerk-user-id",
      email: "dev@example.com",
    },
    tenantId: "dev-tenant-id",
  };
}
