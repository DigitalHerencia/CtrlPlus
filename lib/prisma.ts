/**
 * Minimal Prisma client type definitions and stub export.
 *
 * Replace this file with a real @prisma/client + Neon adapter setup
 * once the database is configured (see prisma/schema.prisma and prisma.config.ts).
 *
 * Tests mock this module via `vi.mock('@/lib/prisma')`.
 */

import type { TenantRole, MembershipStatus } from "@/lib/auth/rbac";

/** Shape of a TenantUserMembership row (mirrors prisma/schema.prisma) */
export interface TenantUserMembership {
  id: string;
  tenantId: string;
  userId: string;
  role: TenantRole;
  status: MembershipStatus;
  createdAt: Date;
  updatedAt: Date;
}

/** Minimal subset of the Prisma client used by lib/ modules */
export interface PrismaClientLike {
  tenantUserMembership: {
    findFirst(args: {
      where: Partial<TenantUserMembership>;
    }): Promise<TenantUserMembership | null>;
  };
}

function buildStub(): PrismaClientLike {
  return {
    tenantUserMembership: {
      findFirst: async () => {
        throw new Error(
          "Prisma client is not configured. " +
            "Install @prisma/client and set up the Neon adapter in lib/prisma.ts."
        );
      },
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g = globalThis as any;

// Singleton pattern — reuse across hot-reloads in development
export const prisma: PrismaClientLike = g.__prisma ?? buildStub();

if (process.env.NODE_ENV !== "production") {
  g.__prisma = prisma;
}
