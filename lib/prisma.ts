/**
 * Prisma Client wrapper for CtrlPlus - Optimized for Neon Serverless Postgres
 *
 * Provides a singleton instance of PrismaClient configured for use with Neon PostgreSQL
 * in serverless environments (Vercel Edge, Lambda, etc.).
 *
 * Key optimizations:
 * - Uses @neondatabase/serverless driver with @prisma/adapter-neon
 * - WebSocket support for transactions in serverless
 * - Connection pooling via pgBouncer (-pooler suffix)
 * - Optimized statement cache and connection timeouts
 * - Minimal cold start overhead
 *
 * Usage:
 *   import { prisma } from '@/lib/prisma'
 *   const wraps = await prisma.wrap.findMany()
 *
 * Connection URLs from environment:
 * - DATABASE_URL: Pooled connection for queries (ends with -pooler for pgBouncer)
 * - DATABASE_URL_UNPOOLED: Direct connection for migrations
 *
 * @see https://neon.tech/docs/guides/prisma
 * @see https://neon.tech/docs/serverless/serverless-driver
 */

import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

// Configure WebSocket for transactions (required in Node.js environments)
// In Edge runtime (Vercel Edge Functions), the global WebSocket is used
if (typeof WebSocket === "undefined") {
  neonConfig.webSocketConstructor = ws;
}

// Optional: Configure connection pooling and caching behavior
// Global type declaration for singleton pattern (prevents multiple instances in dev)
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaSignalHandlersAttached?: boolean;
};

function assertNeonPooledRuntimeUrl(connectionString: string): void {
  let hostname: string;

  try {
    hostname = new URL(connectionString).hostname.toLowerCase();
  } catch {
    throw new Error("DATABASE_URL must be a valid PostgreSQL connection string.");
  }

  const isNeonHost = hostname.includes("neon.tech");

  if (isNeonHost && !hostname.includes("-pooler")) {
    throw new Error(
      "DATABASE_URL must use Neon's pooled hostname (-pooler) for application traffic. " +
        "Use the direct connection only for Prisma CLI operations in prisma.config.ts.",
    );
  }
}

/**
 * Primary Prisma Client instance with Neon adapter
 *
 * Uses DATABASE_URL (pooled) from environment for all queries.
 * Migrations use DATABASE_URL_UNPOOLED from prisma.config.ts.
 */
export const prisma =
  globalForPrisma.prisma ||
  (() => {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error(
        "DATABASE_URL is not defined. Please set it in your .env.local file.\n" +
          "Get connection string from: https://console.neon.tech/\n" +
          "Use the POOLED connection (with -pooler suffix) for optimal performance.",
      );
    }

    assertNeonPooledRuntimeUrl(connectionString);

    const adapter = new PrismaNeon({ connectionString });

    return new PrismaClient({
      adapter,
      log:
        process.env.DEBUG_PRISMA_QUERIES === "true"
          ? ["query", "warn", "error"]
          : ["warn", "error"],
    });
  })();

// Prevent multiple client instances in development (singleton pattern)
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

function disconnectPrisma(): void {
  void prisma.$disconnect();
}

if (!globalForPrisma.prismaSignalHandlersAttached) {
  process.on("SIGTERM", disconnectPrisma);
  process.on("SIGINT", disconnectPrisma);
  globalForPrisma.prismaSignalHandlersAttached = true;
}
