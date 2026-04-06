'use server'

import { requireOwnerOrPlatformAdmin } from '@/lib/authz/guards'
import { prisma } from '@/lib/db/prisma'
import { createWrapSchema, updateWrapSchema } from '@/schemas/catalog.schemas'
import { createWrapCategorySchema, setWrapCategoryMappingsSchema } from '@/schemas/catalog.schemas'
import { assertWrapIsPublishReady } from '@/lib/fetchers/catalog.mappers'
import { updateWrapImageMetadataSchema, wrapImageUploadSchema } from '@/schemas/catalog.schemas'
import {
    revalidateCatalogAndVisualizerPaths,
    revalidateCatalogPaths,
} from '@/lib/cache/revalidate-tags'
import { deletePersistedWrapImage, persistWrapImageFromBuffer } from '@/lib/uploads/storage'
import { MAX_WRAP_IMAGE_BYTES, ALLOWED_WRAP_IMAGE_MIME_TYPES } from '@/lib/uploads/file-validation'
import { readPhotoBuffer } from '@/lib/uploads/image-processing'
import { getCatalogWrapById, getWrapById } from '@/lib/fetchers/catalog.fetchers'
import { toCatalogAssetImage } from '@/lib/utils/catalog-assets'
import {
    type CreateWrapCategoryInput,
    type CreateWrapInput,
    type SetWrapCategoryMappingsInput,
    type UpdateWrapImageMetadataInput,
    type UpdateWrapInput,
    type WrapImageUploadInput,
} from '@/types/catalog.types'
import { WrapImageKind, type WrapImageKind as WrapImageKindType } from '@/lib/constants/statuses'
import type { WrapCategoryDTO, WrapDTO, WrapImageDTO } from '@/types/catalog.types'

type WrapImageRecord = {
    id: string
    url: string
    kind: string
    isActive: boolean
    version: number
    contentHash: string
    cloudinaryPublicId: string | null
    cloudinaryVersion: number | null
    cloudinaryResourceType: string | null
    cloudinaryDeliveryType: string | null
    displayOrder: number
}

function toWrapImageDTO(image: WrapImageRecord): WrapImageDTO {
    return toCatalogAssetImage({
        id: image.id,
        url: image.url,
        kind: image.kind as WrapImageKindType,
        isActive: image.isActive,
        version: image.version,
        contentHash: image.contentHash,
        cloudinaryPublicId: image.cloudinaryPublicId,
        cloudinaryVersion: image.cloudinaryVersion,
        cloudinaryResourceType: image.cloudinaryResourceType,
        cloudinaryDeliveryType: image.cloudinaryDeliveryType,
        displayOrder: image.displayOrder,
    })
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
    if (params.kind !== WrapImageKind.HERO) {
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

export async function deleteWrap(wrapId: string): Promise<WrapDTO> {
    const session = await requireOwnerOrPlatformAdmin()

    const existing = await prisma.wrap.findFirst({
        where: { id: wrapId, deletedAt: null },
        include: {
            images: {
                where: { deletedAt: null },
                select: {
                    id: true,
                    url: true,
                    kind: true,
                    isActive: true,
                    version: true,
                    contentHash: true,
                    cloudinaryPublicId: true,
                    cloudinaryVersion: true,
                    cloudinaryResourceType: true,
                    cloudinaryDeliveryType: true,
                    displayOrder: true,
                },
                orderBy: { displayOrder: 'asc' },
            },
            categoryMappings: {
                select: {
                    category: {
                        select: { id: true, name: true, slug: true, deletedAt: true },
                    },
                },
            },
        },
    })

    if (!existing) {
        throw new Error('Forbidden: resource not found')
    }

    await prisma.wrap.update({
        where: { id: wrapId },
        data: { deletedAt: new Date() },
    })

    await prisma.auditLog.create({
        data: {
            userId: session.userId ?? 'system',
            action: 'wrap.deleted',
            resourceType: 'Wrap',
            resourceId: wrapId,
            details: JSON.stringify({ name: existing.name }),
            timestamp: new Date(),
        },
    })

    revalidateCatalogPaths(wrapId)

    return {
        id: existing.id,
        name: existing.name,
        description: existing.description,
        price: Number.isInteger(existing.price) ? existing.price : Math.round(existing.price),
        isHidden: existing.isHidden,
        installationMinutes: existing.installationMinutes,
        aiPromptTemplate: existing.aiPromptTemplate,
        aiNegativePrompt: existing.aiNegativePrompt,
        images: existing.images.map((image) => ({
            ...toCatalogAssetImage({
                ...image,
                kind: image.kind as WrapImageDTO['kind'],
            }),
        })),
        categories: existing.categoryMappings
            .map((mapping) => mapping.category)
            .filter((category) => category.deletedAt === null)
            .map(({ ...category }) => category),
        createdAt: existing.createdAt.toISOString(),
        updatedAt: existing.updatedAt.toISOString(),
    }
}

export async function createWrapCategory(input: CreateWrapCategoryInput): Promise<WrapCategoryDTO> {
    const session = await requireOwnerOrPlatformAdmin()
    const parsed = createWrapCategorySchema.parse(input)

    const category = await prisma.wrapCategory.create({
        data: {
            name: parsed.name,
            slug: parsed.slug,
        },
        select: { id: true, name: true, slug: true },
    })

    await prisma.auditLog.create({
        data: {
            userId: session.userId ?? 'system',
            action: 'wrapCategory.created',
            resourceType: 'WrapCategory',
            resourceId: category.id,
            details: JSON.stringify({ slug: category.slug }),
            timestamp: new Date(),
        },
    })

    revalidateCatalogPaths()

    return category
}

export async function deleteWrapCategory(categoryId: string): Promise<void> {
    const session = await requireOwnerOrPlatformAdmin()

    const result = await prisma.wrapCategory.updateMany({
        where: {
            id: categoryId,
            deletedAt: null,
        },
        data: {
            deletedAt: new Date(),
        },
    })

    if (result.count === 0) {
        throw new Error('Forbidden: category not found')
    }

    await prisma.wrapCategoryMapping.deleteMany({
        where: {
            categoryId,
        },
    })

    await prisma.auditLog.create({
        data: {
            userId: session.userId ?? 'system',
            action: 'wrapCategory.deleted',
            resourceType: 'WrapCategory',
            resourceId: categoryId,
            timestamp: new Date(),
        },
    })

    revalidateCatalogPaths()
}

export async function setWrapCategoryMappings(input: SetWrapCategoryMappingsInput): Promise<void> {
    const session = await requireOwnerOrPlatformAdmin()
    const parsed = setWrapCategoryMappingsSchema.parse(input)

    const wrap = await prisma.wrap.findFirst({
        where: {
            id: parsed.wrapId,
            deletedAt: null,
        },
        select: { id: true },
    })

    if (!wrap) {
        throw new Error('Forbidden: wrap not found')
    }

    if (parsed.categoryIds.length > 0) {
        const categories = await prisma.wrapCategory.findMany({
            where: {
                id: { in: parsed.categoryIds },
                deletedAt: null,
            },
            select: { id: true },
        })

        if (categories.length !== parsed.categoryIds.length) {
            throw new Error('Forbidden: one or more categories not found')
        }
    }

    await prisma.wrapCategoryMapping.deleteMany({
        where: {
            wrapId: parsed.wrapId,
        },
    })

    if (parsed.categoryIds.length > 0) {
        await prisma.wrapCategoryMapping.createMany({
            data: parsed.categoryIds.map((categoryId) => ({
                wrapId: parsed.wrapId,
                categoryId,
            })),
        })
    }

    await prisma.auditLog.create({
        data: {
            userId: session.userId ?? 'system',
            action: 'wrapCategory.mappingsSet',
            resourceType: 'Wrap',
            resourceId: parsed.wrapId,
            details: JSON.stringify({ categoryIds: parsed.categoryIds }),
            timestamp: new Date(),
        },
    })

    revalidateCatalogPaths(parsed.wrapId)
}

export async function addWrapImage(input: WrapImageUploadInput): Promise<WrapImageDTO> {
    const session = await requireOwnerOrPlatformAdmin()
    const parsed = wrapImageUploadSchema.parse(input)
    await assertWrapExists(parsed.wrapId)

    // parsed.fileKey is a server-side upload reference (data URL or approved remote URL)
    const photo = await readPhotoBuffer(parsed.fileKey)

    // basic validation
    if (!ALLOWED_WRAP_IMAGE_MIME_TYPES.has(photo.contentType)) {
        throw new Error('Unsupported image format. Allowed: JPEG, PNG, WEBP.')
    }

    if (photo.buffer.length <= 0 || photo.buffer.length > MAX_WRAP_IMAGE_BYTES) {
        throw new Error('Image exceeds size limit of 5MB.')
    }

    const stored = await persistWrapImageFromBuffer({
        wrapId: parsed.wrapId,
        buffer: photo.buffer,
        contentType: photo.contentType,
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
            cloudinaryAssetId: stored.assetId,
            cloudinaryPublicId: stored.publicId,
            cloudinaryVersion: stored.version,
            cloudinaryResourceType: stored.resourceType,
            cloudinaryDeliveryType: stored.deliveryType,
            cloudinaryAssetFolder: stored.assetFolder,
            mimeType: stored.mimeType,
            format: stored.format,
            bytes: stored.bytes,
            width: stored.width,
            height: stored.height,
            originalFileName: stored.originalFileName,
            displayOrder: (maxDisplayOrder._max.displayOrder ?? -1) + 1,
        },
        select: {
            id: true,
            url: true,
            kind: true,
            isActive: true,
            version: true,
            contentHash: true,
            cloudinaryPublicId: true,
            cloudinaryVersion: true,
            cloudinaryResourceType: true,
            cloudinaryDeliveryType: true,
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
                cloudinaryPublicId: stored.publicId,
                kind: parsed.kind,
            }),
            timestamp: new Date(),
        },
    })

    revalidateCatalogAndVisualizerPaths(parsed.wrapId)

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
            cloudinaryPublicId: true,
            cloudinaryVersion: true,
            cloudinaryResourceType: true,
            cloudinaryDeliveryType: true,
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

    revalidateCatalogAndVisualizerPaths(parsed.wrapId)

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
        select: {
            id: true,
            url: true,
            cloudinaryPublicId: true,
            cloudinaryResourceType: true,
            cloudinaryDeliveryType: true,
        },
    })

    if (!image) {
        throw new Error('Image not found')
    }

    await prisma.wrapImage.update({
        where: { id: imageId },
        data: { deletedAt: new Date() },
    })

    await deletePersistedWrapImage({
        url: image.url,
        cloudinaryPublicId: image.cloudinaryPublicId,
        cloudinaryResourceType: image.cloudinaryResourceType,
        cloudinaryDeliveryType: image.cloudinaryDeliveryType,
    })

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

    revalidateCatalogAndVisualizerPaths(wrapId)
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

    revalidateCatalogAndVisualizerPaths(wrapId)
}

export async function publishWrap(wrapId: string): Promise<WrapDTO> {
    const session = await requireOwnerOrPlatformAdmin()
    const wrap = await getCatalogWrapById(wrapId, { includeHidden: true })

    if (!wrap) {
        throw new Error('Forbidden: resource not found')
    }

    assertWrapIsPublishReady(wrap.readiness)

    await prisma.wrap.updateMany({
        where: {
            id: wrapId,
            deletedAt: null,
        },
        data: {
            isHidden: false,
        },
    })

    await prisma.auditLog.create({
        data: {
            userId: session.userId ?? 'system',
            action: 'wrap.published',
            resourceType: 'Wrap',
            resourceId: wrapId,
            details: JSON.stringify({
                readiness: wrap.readiness,
            }),
            timestamp: new Date(),
        },
    })

    const publishedWrap = await getWrapById(wrapId, { includeHidden: true })
    if (!publishedWrap) {
        throw new Error('Forbidden: resource not found')
    }

    revalidateCatalogAndVisualizerPaths(wrapId)

    return publishedWrap
}

export async function unpublishWrap(wrapId: string): Promise<WrapDTO> {
    const session = await requireOwnerOrPlatformAdmin()

    const result = await prisma.wrap.updateMany({
        where: {
            id: wrapId,
            deletedAt: null,
        },
        data: {
            isHidden: true,
        },
    })

    if (result.count === 0) {
        throw new Error('Forbidden: resource not found')
    }

    await prisma.auditLog.create({
        data: {
            userId: session.userId ?? 'system',
            action: 'wrap.unpublished',
            resourceType: 'Wrap',
            resourceId: wrapId,
            details: JSON.stringify({
                isHidden: true,
            }),
            timestamp: new Date(),
        },
    })

    const wrap = await getWrapById(wrapId, { includeHidden: true })
    if (!wrap) {
        throw new Error('Forbidden: resource not found')
    }

    revalidateCatalogAndVisualizerPaths(wrapId)

    return wrap
}

export async function updateWrap(wrapId: string, input: UpdateWrapInput): Promise<WrapDTO> {
    const session = await requireOwnerOrPlatformAdmin()
    const parsed = updateWrapSchema.parse(input)

    const existing = await prisma.wrap.findFirst({
        where: {
            id: wrapId,
            deletedAt: null,
        },
        select: {
            id: true,
            isHidden: true,
        },
    })

    if (!existing) {
        throw new Error('Forbidden: resource not found')
    }

    const data = Object.fromEntries(
        Object.entries(parsed).filter(([, value]) => value !== undefined)
    ) as Record<string, unknown>

    const result = await prisma.wrap.updateMany({
        where: {
            id: wrapId,
            deletedAt: null,
        },
        data,
    })

    if (result.count === 0) {
        throw new Error('Forbidden: resource not found')
    }

    await prisma.auditLog.create({
        data: {
            userId: session.userId ?? 'system',
            action: 'wrap.updated',
            resourceType: 'Wrap',
            resourceId: wrapId,
            details: JSON.stringify({ changes: parsed }),
            timestamp: new Date(),
        },
    })

    const wrap = await getWrapById(wrapId, { includeHidden: true })
    if (!wrap) {
        throw new Error('Forbidden: resource not found')
    }

    revalidateCatalogPaths(wrapId)

    return wrap
}
