/**
 * Tenant Resolution
 *
 * Extract tenant context from request (subdomain, host).
 * SECURITY CRITICAL: Never accept tenantId from client payloads.
 * Always resolve server-side from request context.
 */

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

const NGROK_FREE_APP_SUFFIX = ".ngrok-free.app";

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
  const subdomain = extractTenantSlugFromHost(host);

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
export function extractTenantSlugFromHost(
  host: string,
  tenantDomainSuffix: string = process.env.NEXT_PUBLIC_TENANT_DOMAIN_SUFFIX ?? "",
): string | null {
  const hostname = host.split(":")[0]?.trim().toLowerCase();
  if (!hostname) {
    return null;
  }

  // Tunnel domains are allowed for webhook delivery only. Never derive tenant
  // context from them because the suffix is public and not controlled by us.
  if (hostname === "ngrok-free.app" || hostname.endsWith(NGROK_FREE_APP_SUFFIX)) {
    return null;
  }

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return null;
  }

  if (hostname.endsWith(".localhost")) {
    const subdomain = hostname.slice(0, -".localhost".length);
    return isSingleTenantLabel(subdomain) ? subdomain : null;
  }

  const normalizedSuffix = normalizeTenantDomainSuffix(tenantDomainSuffix);
  if (!normalizedSuffix) {
    return null;
  }

  if (!hostname.endsWith(normalizedSuffix)) {
    return null;
  }

  const subdomain = hostname.slice(0, -normalizedSuffix.length);
  return isSingleTenantLabel(subdomain) ? subdomain : null;
}

function normalizeTenantDomainSuffix(suffix: string): string | null {
  const normalized = suffix.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  return normalized.startsWith(".") ? normalized : `.${normalized}`;
}

function isSingleTenantLabel(value: string): boolean {
  return value.length > 0 && !value.includes(".") && value !== "www";
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
