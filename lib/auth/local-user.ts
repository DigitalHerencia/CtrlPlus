import { prisma } from "@/lib/prisma";
import { cache } from "react";

export interface ActiveLocalUser {
  id: string;
}

export interface ActiveTenantMembership {
  tenantId: string;
  role: string;
}

export const getActiveLocalUserByClerkId = cache(
  async (clerkUserId: string): Promise<ActiveLocalUser | null> => {
    return prisma.user.findFirst({
      where: {
        clerkUserId,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });
  },
);

export const getActiveTenantMembershipsByUserId = cache(
  async (userId: string): Promise<ActiveTenantMembership[]> => {
    return prisma.tenantUserMembership.findMany({
      where: {
        userId,
        deletedAt: null,
        tenant: {
          deletedAt: null,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        tenantId: true,
        role: true,
      },
    });
  },
);

export const getActiveTenantMembershipByUserId = cache(
  async (tenantId: string, userId: string): Promise<ActiveTenantMembership | null> => {
    return prisma.tenantUserMembership.findFirst({
      where: {
        tenantId,
        userId,
        deletedAt: null,
        tenant: {
          deletedAt: null,
        },
      },
      select: {
        tenantId: true,
        role: true,
      },
    });
  },
);

export const getActiveTenantMembershipByClerkUserId = cache(
  async (tenantId: string, clerkUserId: string): Promise<ActiveTenantMembership | null> => {
    const user = await getActiveLocalUserByClerkId(clerkUserId);

    if (!user) {
      return null;
    }

    return getActiveTenantMembershipByUserId(tenantId, user.id);
  },
);
