import { PUBLISH_REQUIRED_WRAP_IMAGE_KINDS, WrapImageKind } from '@/lib/constants/statuses'
import type { PublishRequiredWrapImageKind } from '@/lib/constants/statuses'
import { getCatalogAssetDeliveryUrl, toCatalogAssetImage } from '@/lib/utils/catalog-assets'
import type {
    CatalogAssetImageDTO,
    CatalogAssetReadinessDTO,
    WrapImageDTO,
} from '@/types/catalog.types'

function sortImages(images: WrapImageDTO[]): WrapImageDTO[] {
    return [...images].sort((left, right) => left.displayOrder - right.displayOrder)
}

function getActiveImagesByKind(images: WrapImageDTO[], kind: WrapImageKind): WrapImageDTO[] {
    return sortImages(images).filter((image) => image.isActive && image.kind === kind)
}

export { getCatalogAssetDeliveryUrl, toCatalogAssetImage }

export function resolvePrimaryDisplayAsset(images: WrapImageDTO[]): CatalogAssetImageDTO | null {
    const orderedImages = sortImages(images)
    const displayCandidates = orderedImages.filter(
        (image) =>
            image.isActive &&
            (image.kind === WrapImageKind.HERO || image.kind === WrapImageKind.GALLERY)
    )

    const heroImage =
        displayCandidates.find((image) => image.kind === WrapImageKind.HERO) ??
        displayCandidates.find((image) => image.kind === WrapImageKind.GALLERY)

    return heroImage ? toCatalogAssetImage(heroImage) : null
}

export function resolveHeroAsset(images: WrapImageDTO[]): CatalogAssetImageDTO | null {
    const orderedImages = sortImages(images)
    const heroImage = orderedImages.find(
        (image) => image.isActive && image.kind === WrapImageKind.HERO
    )

    return heroImage ? toCatalogAssetImage(heroImage) : null
}

export function resolveCatalogGalleryImages(images: WrapImageDTO[]): CatalogAssetImageDTO[] {
    const orderedImages = sortImages(images)
    const activeDisplayImages = orderedImages.filter(
        (image) => image.isActive && image.kind === WrapImageKind.GALLERY
    )

    return activeDisplayImages.map(toCatalogAssetImage)
}

export function resolveDisplayImages(images: WrapImageDTO[]): CatalogAssetImageDTO[] {
    const heroImage = resolveHeroAsset(images)
    const galleryImages = resolveCatalogGalleryImages(images)

    return heroImage ? [heroImage, ...galleryImages] : galleryImages
}

export function getCatalogAssetReadiness(
    input:
        | WrapImageDTO[]
        | {
              name?: string | null
              price?: number | null
              images: WrapImageDTO[]
          }
): CatalogAssetReadinessDTO {
    const name = Array.isArray(input) ? undefined : input.name
    const price = Array.isArray(input) ? undefined : input.price
    const images = Array.isArray(input) ? input : input.images
    const activeImages = sortImages(images).filter((image) => image.isActive)
    const activeAssetKinds = Array.from(new Set(activeImages.map((image) => image.kind)))
    const missingRequiredAssetRoles = getMissingRequiredAssetRolesForPublish(activeImages)
    const activeHeroCount = getActiveImagesByKind(images, WrapImageKind.HERO).length
    const activeGalleryCount = getActiveImagesByKind(images, WrapImageKind.GALLERY).length
    const primaryDisplayAsset = resolvePrimaryDisplayAsset(images)
    const issues: CatalogAssetReadinessDTO['issues'] = []

    if (typeof name === 'string' && name.trim().length === 0) {
        issues.push({
            code: 'missing_name',
            message: 'Wrap name is required before publish.',
            blocking: true,
        })
    }

    if (typeof price === 'number' && (!Number.isFinite(price) || price <= 0)) {
        issues.push({
            code: 'invalid_price',
            message: 'Wrap price must be greater than zero before publish.',
            blocking: true,
        })
    }

    if (!primaryDisplayAsset) {
        issues.push({
            code: 'missing_display_asset',
            message: 'Add a hero or gallery asset so the wrap can render in the catalog.',
            blocking: true,
        })
    }

    if (missingRequiredAssetRoles.includes(WrapImageKind.HERO)) {
        issues.push({
            code: 'missing_hero',
            message: 'Add an active hero asset before publish.',
            blocking: true,
        })
    }

    if (activeHeroCount > 1) {
        issues.push({
            code: 'multiple_active_hero',
            message: 'Only one hero asset can stay active at a time.',
            blocking: true,
        })
    }

    const canPublish = issues.every((issue) => !issue.blocking)

    return {
        canPublish,
        isVisualizerReady: activeHeroCount === 1 && primaryDisplayAsset !== null,
        missingRequiredAssetRoles,
        requiredAssetRoles: [...PUBLISH_REQUIRED_WRAP_IMAGE_KINDS],
        activeAssetKinds,
        hasDisplayAsset: primaryDisplayAsset !== null,
        activeHeroCount,
        activeGalleryCount,
        issues,
    }
}

// Catalog-specific asset publish helpers
export function getMissingRequiredAssetRolesForPublish(
    images: { kind: WrapImageKind; isActive: boolean }[]
): PublishRequiredWrapImageKind[] {
    const activeRoles = new Set<WrapImageKind>(
        images.filter((image) => image.isActive).map((image) => image.kind as WrapImageKind)
    )

    return PUBLISH_REQUIRED_WRAP_IMAGE_KINDS.filter(
        (kind) => !activeRoles.has(kind)
    ) as PublishRequiredWrapImageKind[]
}

export function assertWrapCanBePublished(images: { kind: string; isActive: boolean }[]): void {
    const missingKinds = getMissingRequiredAssetRolesForPublish(
        images as { kind: WrapImageKind; isActive: boolean }[]
    )

    if (missingKinds.length === 0) {
        return
    }

    throw new Error(`Cannot publish wrap. Missing active asset roles: ${missingKinds.join(', ')}`)
}

export function assertWrapIsPublishReady(readiness: CatalogAssetReadinessDTO): void {
    if (readiness.canPublish) {
        return
    }

    const blockingMessages = readiness.issues
        .filter((issue) => issue.blocking)
        .map((issue) => issue.message)

    throw new Error(
        `Cannot publish wrap. ${blockingMessages.length > 0 ? blockingMessages.join(' ') : 'Wrap is not publish-ready.'}`
    )
}
