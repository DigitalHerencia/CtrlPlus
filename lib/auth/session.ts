import { auth, currentUser } from "@clerk/nextjs/server";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SessionUser {
  /** Clerk user ID, used as the canonical user identifier throughout the app */
  id: string;
  /** Clerk user ID (alias for `id`; retained so both fields are available to callers) */
  clerkUserId: string;
  /** Primary email address of the authenticated user */
  email: string;
}

export interface Session {
  /** Authenticated user, or `null` when no valid session is present */
  user: SessionUser | null;
  /**
   * Tenant ID resolved server-side from the request host.
   * This is NEVER sourced from client-provided input.
   * Empty string when the user is unauthenticated or tenant lookup fails.
   */
  tenantId: string;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Resolves the current authenticated user and tenant from the Clerk session.
 *
 * - User identity comes from Clerk; it is never accepted from the client.
 * - Tenant context is derived server-side from the request host (subdomain).
 * - Returns `{ user: null, tenantId: "" }` when the caller is unauthenticated
 *   rather than throwing, so callers can decide how to handle guest access.
 *
 * Throws when the host resolves to a non-existent tenant (so the action/
 * fetcher pipeline surfaces a clear 404/403 rather than silently using the
 * wrong tenant).
 *
 * @returns Session object with `user` and `tenantId`
 */
export async function getSession(): Promise<Session> {
  const { userId } = await auth();

  if (!userId) {
    return { user: null, tenantId: "" };
  }

  const clerkUser = await currentUser();

  if (!clerkUser) {
    // Clerk session exists but user record is unavailable – treat as signed-out
    return { user: null, tenantId: "" };
  }

  const tenantId = await resolveTenantId();

  return {
    user: {
      id: userId,
      clerkUserId: userId,
      email: resolvePrimaryEmail(clerkUser),
    },
    tenantId,
  };
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Resolves the primary email address from a Clerk user object.
 *
 * Prefers the address whose `id` matches `primaryEmailAddressId`.
 * Falls back to the first address in the list, then to an empty string.
 */
function resolvePrimaryEmail(clerkUser: {
  primaryEmailAddressId: string | null;
  emailAddresses: Array<{ id: string; emailAddress: string }>;
}): string {
  return (
    clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId
    )?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress ??
    ""
  );
}

/**
 * Derives the tenant ID from the current request's `Host` header.
 *
 * Subdomain-based multi-tenancy: `acme.ctrlplus.com` → slug `acme` → tenant ID.
 *
 * In local development (no subdomain / `localhost`) the `DEV_TENANT_ID`
 * environment variable is required so the dev environment is still scoped to a
 * specific tenant rather than bypassing tenant isolation entirely.
 *
 * @throws {Error} When the tenant slug cannot be resolved to a database record.
 * @throws {Error} In local development when `DEV_TENANT_ID` is not set.
 */
async function resolveTenantId(): Promise<string> {
  const { headers } = await import("next/headers");
  const headersList = await headers();
  const host = headersList.get("host") ?? "";

  const subdomain = extractSubdomain(host);

  if (!subdomain) {
    const devTenantId = process.env.DEV_TENANT_ID;
    if (!devTenantId) {
      throw new Error(
        "DEV_TENANT_ID environment variable is required for local development"
      );
    }
    return devTenantId;
  }

  const { prisma } = await import("@/lib/prisma");
  const tenant = await prisma.tenant.findUnique({
    where: { slug: subdomain },
    select: { id: true },
  });

  if (!tenant) {
    throw new Error(`Tenant not found for subdomain: ${subdomain}`);
  }

  return tenant.id;
}

/**
 * Extracts the subdomain from a `Host` header value.
 *
 * Returns `null` for local development hosts (no dot, `localhost`, or
 * plain IP addresses) so callers can fall back to `DEV_TENANT_ID`.
 *
 * @example
 * extractSubdomain("acme.ctrlplus.com") // "acme"
 * extractSubdomain("localhost:3000")    // null
 * extractSubdomain("127.0.0.1")         // null
 */
export function extractSubdomain(host: string): string | null {
  // Strip optional port
  const hostname = host.split(":")[0];

  // No dots → plain hostname or localhost
  if (!hostname.includes(".")) {
    return null;
  }

  const parts = hostname.split(".");

  const subdomain = parts[0];

  // Reject numeric-only first labels (IPv4 fragments like 127.0.0.1)
  if (/^\d+$/.test(subdomain)) {
    return null;
  }

  return subdomain;
}
