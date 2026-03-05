/**
 * Prisma Client Singleton
 *
 * Exports a shared PrismaClient instance for use in fetchers and actions.
 *
 * NOTE: This is a stub. Wire up the real Neon adapter once the DATABASE_URL
 * environment variable and @neondatabase/serverless are available:
 *
 *   import { neon } from "@neondatabase/serverless";
 *   import { PrismaNeon } from "@prisma/adapter-neon";
 *   import { PrismaClient } from "@prisma/client";
 *
 *   const sql = neon(process.env.DATABASE_URL!);
 *   const adapter = new PrismaNeon(sql);
 *   export const prisma = new PrismaClient({ adapter });
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PrismaStub = Record<string, any>;

function createPrismaStub(): PrismaStub {
  const handler: ProxyHandler<PrismaStub> = {
    get(_target, prop) {
      if (prop === "$transaction") {
        return async (fn: (tx: PrismaStub) => Promise<unknown>) =>
          fn(createPrismaStub());
      }
      // Return a model proxy for any table name access (e.g. prisma.tenant)
      return new Proxy(
        {},
        {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          get(_t, _method) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            return async (..._args: unknown[]) => {
              // Stub: in tests, mock this module with vi.mock("@/lib/prisma")
              return null;
            };
          },
        }
      );
    },
  };
  return new Proxy({}, handler);
}

declare global {
  // Prevent multiple instances in hot-reload during development
  var __prisma: PrismaStub | undefined;
}

export const prisma: PrismaStub =
  globalThis.__prisma ?? (globalThis.__prisma = createPrismaStub());
