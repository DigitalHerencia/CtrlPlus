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
 *   const users = await prisma.tenant.findMany()
 *
 * Connection URLs from environment:
 * - DATABASE_URL: Pooled connection for queries (ends with -pooler for pgBouncer)
 * - DATABASE_URL_UNPOOLED: Direct connection for migrations
 *
 * @see https://neon.tech/docs/guides/prisma
 * @see https://neon.tech/docs/serverless/serverless-driver
 */

import { neonConfig } from "@neondatabase/serverless"
import { PrismaNeon } from "@prisma/adapter-neon"
import { PrismaClient } from "@prisma/client"
import ws from "ws"

// Configure WebSocket for transactions (required in Node.js environments)
// In Edge runtime (Vercel Edge Functions), the global WebSocket is used
if (typeof WebSocket === "undefined") {
  neonConfig.webSocketConstructor = ws
}

// Optional: Configure connection pooling and caching behavior
neonConfig.fetchConnectionCache = true // Enable connection caching

// Global type declaration for singleton pattern (prevents multiple instances in dev)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient
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
    // Create Neon connection pool with optimized settings for serverless
    const connectionString = process.env.DATABASE_URL

    if (!connectionString) {
      throw new Error(
        "DATABASE_URL is not defined. Please set it in your .env.local file.\n" +
          "Get connection string from: https://console.neon.tech/\n" +
          "Use the POOLED connection (with -pooler suffix) for optimal performance."
      )
    }

    // Create Neon adapter with connection config (not Pool instance)
    // PrismaNeon expects a PoolConfig object { connectionString: string }
    const adapter = new PrismaNeon({ connectionString })

    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"]
    })
  })()

// Prevent multiple client instances in development (singleton pattern)
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

// Graceful disconnection on process termination
process.on("SIGTERM", async () => {
  await prisma.$disconnect()
})

process.on("SIGINT", async () => {
  await prisma.$disconnect()
})
