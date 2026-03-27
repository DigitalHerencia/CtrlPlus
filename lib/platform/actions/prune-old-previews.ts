'use server'

import { getSession } from '@/lib/auth/session'
import { requireCapability } from '@/lib/authz/policy'
import { prisma } from '@/lib/prisma'

export async function pruneOldPreviews(): Promise<void> {
    const session = await getSession()
    const userId = session.userId
    if (!session.isAuthenticated || !userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    // owner or platform admin or capability required
    // require owner-level dashboard capability (owners and admins have this)
    requireCapability(session.authz, 'dashboard.owner')

    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 30)

    const result = await prisma.visualizerPreview.updateMany({
        where: {
            deletedAt: null,
            createdAt: { lt: cutoff },
        },
        data: { deletedAt: new Date() },
    })

    await prisma.auditLog.create({
        data: {
            userId,
            action: 'admin.pruneOldPreviews',
            resourceType: 'VisualizerPreview',
            resourceId: '',
            details: JSON.stringify({ prunedCount: result.count }),
            timestamp: new Date(),
        },
    })

    // no return value needed for form action
}
