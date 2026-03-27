'use server'

import { requireOwnerOrPlatformAdmin } from '@/lib/authz/guards'
import { prisma } from '@/lib/prisma'
import { createWrapSchema } from '@/schema/catalog'
import { revalidateCatalogPaths } from '../revalidation'
import { type CreateWrapInput, type WrapDTO } from '../types'
import { getWrapById } from '../fetchers/get-wraps'

export async function createWrap(input: CreateWrapInput): Promise<WrapDTO> {
    const session = await requireOwnerOrPlatformAdmin()
    const parsed = createWrapSchema.parse(input)

    const created = await prisma.wrap.create({
        data: {
            name: parsed.name,
            description: parsed.description ?? null,
            price: parsed.price,
            installationMinutes: parsed.installationMinutes ?? null,
            aiPromptTemplate: parsed.aiPromptTemplate ?? null,
            aiNegativePrompt: parsed.aiNegativePrompt ?? null,
            isHidden: true,
        },
        select: { id: true },
    })

    await prisma.auditLog.create({
        data: {
            userId: session.userId ?? 'system',
            action: 'wrap.created',
            resourceType: 'Wrap',
            resourceId: created.id,
            details: JSON.stringify({
                name: parsed.name,
                priceInCents: parsed.price,
                aiPromptTemplate: parsed.aiPromptTemplate ?? null,
                aiNegativePrompt: parsed.aiNegativePrompt ?? null,
                isHidden: true,
            }),
            timestamp: new Date(),
        },
    })

    const wrap = await getWrapById(created.id, { includeHidden: true })
    if (!wrap) {
        throw new Error('Failed to load created wrap')
    }

    revalidateCatalogPaths(created.id)

    return wrap
}
