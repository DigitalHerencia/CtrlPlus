'use server'

import { getSession } from '@/lib/auth/session'
import { requireCapability } from '@/lib/authz/policy'
import { prisma } from '@/lib/prisma'
import { visualizerConfig } from '@/lib/visualizer/config'
import { generateCompositePreview } from '@/lib/visualizer/preview-pipeline'
import {
    generatePreviewSchema,
    type GeneratePreviewInput,
    type PreviewStatus,
    type VisualizerPreviewDTO,
} from '../types'

function toDTO(record: {
    id: string
    wrapId: string
    customerPhotoUrl: string
    processedImageUrl: string | null
    status: string
    cacheKey: string
    expiresAt: Date
    createdAt: Date
    updatedAt: Date
}): VisualizerPreviewDTO {
    return {
        id: record.id,
        wrapId: record.wrapId,
        customerPhotoUrl: record.customerPhotoUrl,
        processedImageUrl: record.processedImageUrl,
        status: record.status as PreviewStatus,
        cacheKey: record.cacheKey,
        expiresAt: record.expiresAt,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
    }
}

export async function generatePreview(input: GeneratePreviewInput): Promise<VisualizerPreviewDTO> {
    const session = await getSession()
    const userId = session.userId
    if (!session.isAuthenticated || !userId) throw new Error('Unauthorized: not authenticated')
    requireCapability(session.authz, 'visualizer.use')

    // Ownership hardening: Only owner or platform admin can generate preview for hidden wraps
    const preview = await prisma.visualizerPreview.findFirst({
        where: { id: input.previewId, deletedAt: null },
        select: { id: true, ownerClerkUserId: true, wrapId: true },
    })
    if (!preview) throw new Error('Preview not found')
    const wrap = await prisma.wrap.findFirst({
        where: { id: preview.wrapId, deletedAt: null },
        select: { id: true, isHidden: true },
    })
    if (wrap?.isHidden && !session.isOwner && !session.isPlatformAdmin) {
        throw new Error(
            'Forbidden: only owner or platform admin can generate preview for hidden wraps'
        )
    }

    const parsed = generatePreviewSchema.parse(input)

    const existing = await prisma.visualizerPreview.findFirst({
        where: {
            id: parsed.previewId,
            ownerClerkUserId: userId,
            deletedAt: null,
        },
    })

    if (!existing) {
        throw new Error('Preview not found')
    }

    if (
        existing.status === 'complete' &&
        existing.expiresAt > new Date() &&
        existing.processedImageUrl
    ) {
        return toDTO(existing)
    }

    await prisma.visualizerPreview.update({
        where: { id: existing.id },
        data: { status: 'processing' },
    })

    try {
        // Generate and store preview image in Cloudinary, get URL
        const processedImageUrl = await generateCompositePreview({
            wrapId: existing.wrapId,
            previewId: existing.id,
            customerPhotoUrl: existing.customerPhotoUrl,
            sourceWrapImageId: existing.sourceWrapImageId,
        })

        const completed = await prisma.visualizerPreview.update({
            where: { id: existing.id },
            data: {
                status: 'complete',
                processedImageUrl,
                expiresAt: new Date(Date.now() + visualizerConfig.previewTtlMs),
            },
        })

        await prisma.auditLog.create({
            data: {
                userId,
                action: 'GENERATE_PREVIEW',
                resourceType: 'VisualizerPreview',
                resourceId: completed.id,
                details: JSON.stringify({
                    wrapId: completed.wrapId,
                    sourceWrapImageId: existing.sourceWrapImageId,
                    sourceWrapImageVersion: existing.sourceWrapImageVersion,
                }),
                timestamp: new Date(),
            },
        })

        return toDTO(completed)
    } catch (error) {
        await prisma.visualizerPreview.update({
            where: { id: existing.id },
            data: { status: 'failed' },
        })

        const message = error instanceof Error ? error.message : 'Preview generation failed'

        await prisma.auditLog.create({
            data: {
                userId,
                action: 'GENERATE_PREVIEW_FAILED',
                resourceType: 'VisualizerPreview',
                resourceId: existing.id,
                details: JSON.stringify({
                    wrapId: existing.wrapId,
                    sourceWrapImageId: existing.sourceWrapImageId,
                    sourceWrapImageVersion: existing.sourceWrapImageVersion,
                    error: message,
                }),
                timestamp: new Date(),
            },
        })

        throw new Error(message)
    }
}
