/**
 * Tenant Resolution
 *
 * Extract tenant context from request (subdomain, host).
 * SECURITY CRITICAL: Never accept tenantId from client payloads.
 * Always resolve server-side from request context.
 */

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

/**
 * Resolve tenant from current request context (subdomain).
 *
 * @example
 * ```typescript
 * // tenant1.localhost:3000 → "tenant1"
 * // tenant1.ctrlplus.com → "tenant1"
 * // localhost:3000 → null (no subdomain)
 * ```
 *
 * @returns Tenant ID if found, null otherwise
 */
export async function resolveTenantFromRequest(): Promise<string | null> {
  const headersList = await headers();
  const host = headersList.get("host");

  if (!host) {
    return null;
  }

  // Extract subdomain
  const subdomain = extractSubdomain(host);

  if (!subdomain) {
    return null;
  }

  // Look up tenant by slug (subdomain).
  // findFirst (not findUnique) is required here because Prisma's findUnique
  // only accepts unique fields in the where clause — adding deletedAt: null
  // alongside a @unique slug would cause a type error.
  const tenant = await prisma.tenant.findFirst({
    where: {
      slug: subdomain,
      deletedAt: null, // Only active tenants
    },
    select: { id: true },
  });

  return tenant?.id ?? null;
}

/**
 * Extract subdomain from host header.
 *
 * @example
 * ```
 * tenant1.localhost:3000 → "tenant1"
 * tenant1.ctrlplus.com → "tenant1"
 * localhost:3000 → null
 * ctrlplus.com → null
 * ```
 */
function extractSubdomain(host: string): string | null {
  // Remove port if present
  const hostname = host.split(":")[0];

  // Split by dots
  const parts = hostname.split(".");

  // Need at least 2 parts for subdomain (subdomain.domain)
  // For localhost development: tenant1.localhost
  // For production: tenant1.ctrlplus.com
  if (parts.length < 2) {
    return null;
  }

  // If localhost, first part is subdomain
  if (hostname.includes("localhost")) {
    return parts[0];
  }

  // For production domains (ctrlplus.com), first part is subdomain
  // But skip if it's the root domain (ctrlplus.com) or www
  if (parts.length === 2 || parts[0] === "www") {
    return null;
  }

  return parts[0];
}

/**
 * Get tenant by slug (subdomain).
 * Use this for admin operations or tenant creation flows.
 */
export async function getTenantBySlug(
  slug: string,
): Promise<{ id: string; name: string; slug: string } | null> {
  // findFirst is used (not findUnique) because deletedAt is not a unique field.
  const tenant = await prisma.tenant.findFirst({
    where: {
      slug,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  return tenant;
}
