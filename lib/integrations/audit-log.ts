import 'server-only'

import { prisma } from '@/lib/db/prisma'

interface OperationalAuditLogInput {
    userId: string
    action: string
    resourceType: string
    resourceId: string
    details?: Record<string, unknown>
}

export async function writeOperationalAuditLog(input: OperationalAuditLogInput): Promise<void> {
    await prisma.auditLog.create({
        data: {
            userId: input.userId,
            action: input.action,
            resourceType: input.resourceType,
            resourceId: input.resourceId,
            details: input.details ? JSON.stringify(input.details) : null,
        },
    })
}
