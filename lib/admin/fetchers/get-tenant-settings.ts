/**
 * Admin Fetcher – Tenant Settings
 *
 * Returns the settings/profile for the given tenant.
 * Scoped by tenantId; never returns raw Prisma models.
 */

import { prisma } from "@/lib/prisma";
import type { TenantSettings } from "../types";

/**
 * Fetches the tenant settings DTO for the given tenant.
 * Returns a fallback stub when the database is not yet connected.
 *
 * @param tenantId - Server-side resolved tenant scope
 * @returns TenantSettings DTO
 */
export async function getTenantSettings(
  tenantId: string
): Promise<TenantSettings> {
  const tenant = (await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: {
      id: true,
      name: true,
      slug: true,
      logoUrl: true,
      contactEmail: true,
      contactPhone: true,
      address: true,
      updatedAt: true,
    },
  })) as {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    address: string | null;
    updatedAt: Date;
  } | null;

  // Fallback stub when DB is not yet connected
  if (!tenant) {
    return {
      id: tenantId,
      name: "My Business",
      slug: "my-business",
      logoUrl: null,
      contactEmail: null,
      contactPhone: null,
      address: null,
      updatedAt: new Date(),
    };
  }

  return {
    id: tenant.id,
    name: tenant.name,
    slug: tenant.slug,
    logoUrl: tenant.logoUrl,
    contactEmail: tenant.contactEmail,
    contactPhone: tenant.contactPhone,
    address: tenant.address,
    updatedAt: tenant.updatedAt,
  };
}
