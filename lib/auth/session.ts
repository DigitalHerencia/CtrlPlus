/**
 * Auth session helpers backed by Clerk.
 * This stub resolves the current user and tenant from the Clerk session.
 * Replace with the real Clerk integration when @clerk/nextjs is installed.
 */

export interface SessionUser {
  id: string;
  email: string;
}

export interface Session {
  user: SessionUser | null;
  tenantId: string;
}

/**
 * Returns the current authenticated user and the tenant resolved from the
 * request host. Throws if the session cannot be determined.
 */
export async function getSession(): Promise<Session> {
  // TODO: Replace with real Clerk auth once @clerk/nextjs is installed.
  // import { auth } from "@clerk/nextjs/server";
  // const { userId } = await auth();
  return {
    user: null,
    tenantId: "",
  };
}
