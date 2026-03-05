/**
 * Tenant Resolution
 *
 * Resolves the current tenant from the request host/subdomain.
 * Tenant is ALWAYS resolved server-side — never accepted from client input.
 */

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

/**
 * Resolve the current tenant ID from the request Host header.
 *
 * For production: reads the subdomain from the Host header.
 * For local development: uses the DEV_TENANT_ID environment variable.
 *
 * @returns Resolved tenant ID, or null if not found
 */
export async function resolveTenantFromRequest(): Promise<string | null> {
  // In local development, use the DEV_TENANT_ID environment variable.
  // NOTE: This bypass is guarded by NODE_ENV === "development" only — it must
  // not be used in staging or production, where NODE_ENV is always "production".
  if (process.env.NODE_ENV === "development" && process.env.DEV_TENANT_ID) {
    const devTenantId = process.env.DEV_TENANT_ID;
    // Verify the tenant actually exists to catch typos in the env variable.
    const devTenant = await prisma.tenant.findUnique({
      where: { id: devTenantId },
      select: { id: true },
    });
    return devTenant?.id ?? null;
  }

  const headersList = await headers();
  const host = headersList.get("host") ?? "";

  // Extract subdomain from host (e.g., "acme.ctrlplus.com" → "acme").
  const subdomain = host.split(".")[0];
  if (!subdomain) return null;

  const tenant = await prisma.tenant.findUnique({
    where: { slug: subdomain },
    select: { id: true },
  });

  return tenant?.id ?? null;
}

/**
 * Get a tenant by its slug.
 * Use for admin operations or tenant creation flows.
 */
export async function getTenantBySlug(
  slug: string
): Promise<{ id: string; name: string; slug: string } | null> {
  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    select: { id: true, name: true, slug: true },
  });

  return tenant ?? null;
}
