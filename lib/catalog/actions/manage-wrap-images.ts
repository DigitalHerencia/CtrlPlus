'use server'

import { requireOwnerOrPlatformAdmin } from '@/lib/authz/guards'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { deletePersistedWrapImage, persistWrapImage, validateWrapImageFile } from '../image-storage'
import {
    updateWrapImageMetadataSchema,
    wrapImageUploadSchema,
    WrapImageKind,
    type UpdateWrapImageMetadataInput,
    type WrapImageDTO,
    type WrapImageKind as WrapImageKindType,
    type WrapImageUploadInput,
} from '../types'

type WrapImageRecord = {
    id: string
    url: string
    kind: string
    isActive: boolean
    version: number
    contentHash: string
    displayOrder: number
}

function toWrapImageDTO(image: WrapImageRecord): WrapImageDTO {
    return {
        id: image.id,
        url: image.url,
        kind: image.kind as WrapImageKindType,
        isActive: image.isActive,
        version: image.version,
        contentHash: image.contentHash,
        displayOrder: image.displayOrder,
    }
}

function revalidateWrapPaths(wrapId: string): void {
    revalidatePath('/catalog')
    revalidatePath('/catalog/manage')
    revalidatePath(`/catalog/${wrapId}`)
    revalidatePath('/visualizer')
}

async function assertWrapExists(wrapId: string): Promise<void> {
    const wrap = await prisma.wrap.findFirst({
        where: { id: wrapId, deletedAt: null },
        select: { id: true },
    })

    if (!wrap) {
        throw new Error('Forbidden: wrap not found')
    }
}

async function normalizeExclusiveActiveKinds(params: {
    wrapId: string
    kind: WrapImageKindType
    nextImageId?: string
}): Promise<void> {
    if (params.kind !== WrapImageKind.HERO && params.kind !== WrapImageKind.VISUALIZER_TEXTURE) {
        return
    }

    await prisma.wrapImage.updateMany({
        where: {
            wrapId: params.wrapId,
            deletedAt: null,
            kind: params.kind,
            ...(params.nextImageId ? { NOT: { id: params.nextImageId } } : {}),
        },
        data: { isActive: false },
    })
}

export async function addWrapImage(input: WrapImageUploadInput): Promise<WrapImageDTO> {
    const session = await requireOwnerOrPlatformAdmin()
    const parsed = wrapImageUploadSchema.parse(input)
    await assertWrapExists(parsed.wrapId)
    validateWrapImageFile(parsed.file)

    const stored = await persistWrapImage({
        wrapId: parsed.wrapId,
        file: parsed.file,
    })

    const maxDisplayOrder = await prisma.wrapImage.aggregate({
        where: { wrapId: parsed.wrapId, deletedAt: null },
        _max: { displayOrder: true },
    })

    const image = await prisma.wrapImage.create({
        data: {
            wrapId: parsed.wrapId,
            url: stored.url,
            kind: parsed.kind,
            isActive: parsed.isActive,
            version: 1,
            contentHash: stored.contentHash,
            displayOrder: (maxDisplayOrder._max.displayOrder ?? -1) + 1,
        },
        select: {
            id: true,
            url: true,
            kind: true,
            isActive: true,
            version: true,
            contentHash: true,
            displayOrder: true,
        },
    })

    if (parsed.isActive) {
        await normalizeExclusiveActiveKinds({
            wrapId: parsed.wrapId,
            kind: parsed.kind,
            nextImageId: image.id,
        })
    }

    await prisma.auditLog.create({
        data: {
            userId: session.userId ?? 'system',
            action: 'wrapImage.added',
            resourceType: 'Wrap',
            resourceId: parsed.wrapId,
            details: JSON.stringify({
                wrapImageId: image.id,
                imageUrl: stored.url,
                kind: parsed.kind,
            }),
            timestamp: new Date(),
        },
    })

    revalidateWrapPaths(parsed.wrapId)

    return toWrapImageDTO(image)
}

export async function updateWrapImageMetadata(
    input: UpdateWrapImageMetadataInput
): Promise<WrapImageDTO> {
    const session = await requireOwnerOrPlatformAdmin()
    const parsed = updateWrapImageMetadataSchema.parse(input)
    await assertWrapExists(parsed.wrapId)

    const existing = await prisma.wrapImage.findFirst({
        where: {
            id: parsed.imageId,
            wrapId: parsed.wrapId,
            deletedAt: null,
        },
        select: {
            id: true,
            kind: true,
            isActive: true,
            version: true,
        },
    })

    if (!existing) {
        throw new Error('Image not found')
    }

    const nextKind = (parsed.kind ?? existing.kind) as WrapImageKindType
    const nextIsActive = parsed.isActive ?? existing.isActive
    const shouldBumpVersion = parsed.kind !== undefined || parsed.isActive !== undefined

    const updated = await prisma.wrapImage.update({
        where: { id: parsed.imageId },
        data: {
            ...(parsed.kind !== undefined ? { kind: parsed.kind } : {}),
            ...(parsed.isActive !== undefined ? { isActive: parsed.isActive } : {}),
            ...(shouldBumpVersion ? { version: existing.version + 1 } : {}),
        },
        select: {
            id: true,
            url: true,
            kind: true,
            isActive: true,
            version: true,
            contentHash: true,
            displayOrder: true,
        },
    })

    if (nextIsActive) {
        await normalizeExclusiveActiveKinds({
            wrapId: parsed.wrapId,
            kind: nextKind,
            nextImageId: updated.id,
        })
    }

    await prisma.auditLog.create({
        data: {
            userId: session.userId ?? 'system',
            action: 'wrapImage.metadataUpdated',
            resourceType: 'Wrap',
            resourceId: parsed.wrapId,
            details: JSON.stringify({
                imageId: parsed.imageId,
                changes: { kind: parsed.kind, isActive: parsed.isActive },
            }),
            timestamp: new Date(),
        },
    })

    revalidateWrapPaths(parsed.wrapId)

    return toWrapImageDTO(updated)
}

export async function removeWrapImage(wrapId: string, imageId: string): Promise<void> {
    const session = await requireOwnerOrPlatformAdmin()
    await assertWrapExists(wrapId)

    const image = await prisma.wrapImage.findFirst({
        where: {
            id: imageId,
            wrapId,
            deletedAt: null,
        },
        select: { id: true, url: true },
    })

    if (!image) {
        throw new Error('Image not found')
    }

    await prisma.wrapImage.update({
        where: { id: imageId },
        data: { deletedAt: new Date() },
    })

    await deletePersistedWrapImage(image.url)

    await prisma.auditLog.create({
        data: {
            userId: session.userId ?? 'system',
            action: 'wrapImage.removed',
            resourceType: 'Wrap',
            resourceId: wrapId,
            details: JSON.stringify({ wrapImageId: imageId }),
            timestamp: new Date(),
        },
    })

    revalidateWrapPaths(wrapId)
}

export async function reorderWrapImages(wrapId: string, imageIdsInOrder: string[]): Promise<void> {
    const session = await requireOwnerOrPlatformAdmin()
    await assertWrapExists(wrapId)

    const existing = await prisma.wrapImage.findMany({
        where: {
            wrapId,
            deletedAt: null,
        },
        select: { id: true },
    })

    if (existing.length !== imageIdsInOrder.length) {
        throw new Error('Image reorder payload does not match wrap image set.')
    }

    const existingIds = new Set(existing.map((image) => image.id))
    for (const imageId of imageIdsInOrder) {
        if (!existingIds.has(imageId)) {
            throw new Error('Image reorder payload contains invalid image IDs.')
        }
    }

    await prisma.$transaction(
        imageIdsInOrder.map((imageId, index) =>
            prisma.wrapImage.update({
                where: { id: imageId },
                data: { displayOrder: index },
            })
        )
    )

    await prisma.auditLog.create({
        data: {
            userId: session.userId ?? 'system',
            action: 'wrapImage.reordered',
            resourceType: 'Wrap',
            resourceId: wrapId,
            details: JSON.stringify({ imageIdsInOrder }),
            timestamp: new Date(),
        },
    })

    revalidateWrapPaths(wrapId)
}
