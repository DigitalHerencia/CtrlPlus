/**
 * Tenancy Type Definitions
 *
 * DTOs for tenant and membership data.
 * Never expose raw Prisma models – always return these explicit types.
 */

import type { TenantRole } from "@/lib/auth/rbac";

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantUserMembership {
  id: string;
  tenantId: string;
  userId: string;
  clerkUserId: string;
  role: TenantRole;
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
  updatedAt: Date;
}
