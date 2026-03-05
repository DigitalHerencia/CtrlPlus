/**
 * Session helper — resolves the authenticated user and tenant for
 * server-side operations (Server Components, Server Actions, Route Handlers).
 *
 * Backed by Clerk. Install @clerk/nextjs and configure middleware for
 * the full implementation; this stub allows the rest of lib/ to compile
 * and be tested independently.
 */

export interface SessionUser {
  /** Clerk user ID */
  id: string;
  /** Primary email address */
  email: string;
}

export interface Session {
  /** Authenticated user, or null when unauthenticated */
  user: SessionUser | null;
  /** Tenant resolved from request subdomain */
  tenantId: string;
}

/**
 * Returns the current session for the incoming request.
 *
 * @throws {Error} In production when Clerk is not configured.
 *
 * NOTE: Replace the body of this function with the real Clerk implementation:
 * ```ts
 * import { auth } from "@clerk/nextjs/server";
 * import { headers } from "next/headers";
 *
 * export async function getSession(): Promise<Session> {
 *   const { userId } = await auth();
 *   const host = (await headers()).get("host") ?? "";
 *   const tenantId = host.split(".")[0] ?? "";
 *   if (!userId) return { user: null, tenantId };
 *   return { user: { id: userId, email: "" }, tenantId };
 * }
 * ```
 */
export async function getSession(): Promise<Session> {
  throw new Error(
    "getSession() is not implemented. " +
      "Install @clerk/nextjs and replace this stub with the real Clerk implementation."
  );
}
