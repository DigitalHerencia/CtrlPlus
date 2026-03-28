/**
 * Prisma Client wrapper for CtrlPlus - moved to lib/db/prisma.ts
 *
 * This file is the canonical Prisma client location for the repo.
 */

import { neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'
import ws from 'ws'

if (typeof WebSocket === 'undefined') {
    neonConfig.webSocketConstructor = ws
}

const globalForPrisma = globalThis as unknown as {
    prisma?: PrismaClient
    prismaSignalHandlersAttached?: boolean
}

function assertNeonPooledRuntimeUrl(connectionString: string): void {
    let hostname: string

    try {
        hostname = new URL(connectionString).hostname.toLowerCase()
    } catch {
        throw new Error('DATABASE_URL must be a valid PostgreSQL connection string.')
    }

    const isNeonHost = hostname.includes('neon.tech')

    if (isNeonHost && !hostname.includes('-pooler')) {
        throw new Error(
            "DATABASE_URL must use Neon's pooled hostname (-pooler) for application traffic. " +
                'Use the direct connection only for Prisma CLI operations in prisma.config.ts.'
        )
    }
}

export const prisma =
    globalForPrisma.prisma ||
    (() => {
        const connectionString = process.env.DATABASE_URL

        if (!connectionString) {
            throw new Error(
                'DATABASE_URL is not defined. Please set it in your .env.local file.\n' +
                    'Get connection string from: https://console.neon.tech/\n' +
                    'Use the POOLED connection (with -pooler suffix) for optimal performance.'
            )
        }

        assertNeonPooledRuntimeUrl(connectionString)

        const adapter = new PrismaNeon({ connectionString })

        return new PrismaClient({
            adapter,
            log:
                process.env.DEBUG_PRISMA_QUERIES === 'true'
                    ? ['query', 'warn', 'error']
                    : ['warn', 'error'],
        })
    })()

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}

function disconnectPrisma(): void {
    void prisma.$disconnect()
}

if (!globalForPrisma.prismaSignalHandlersAttached) {
    process.on('SIGTERM', disconnectPrisma)
    process.on('SIGINT', disconnectPrisma)
    globalForPrisma.prismaSignalHandlersAttached = true
}
