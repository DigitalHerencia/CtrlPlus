export interface SessionUser {
  id: string;
  email: string;
  name: string;
}

export interface Session {
  user: SessionUser | null;
  tenantId: string;
}

/**
 * Returns the current authenticated session.
 * TODO: Replace with Clerk-based implementation when auth is configured.
 *
 * @example
 * import { auth } from "@clerk/nextjs/server";
 * export async function getSession(): Promise<Session> {
 *   const { userId } = await auth();
 *   if (!userId) return { user: null, tenantId: "" };
 *   // resolve tenant from host and fetch user from DB
 * }
 */
export async function getSession(): Promise<Session> {
  return {
    user: { id: "dev-user-001", email: "dev@example.com", name: "Dev User" },
    tenantId: "dev-tenant-001",
  };
}
