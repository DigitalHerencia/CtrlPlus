import {
    PUBLISH_REQUIRED_WRAP_IMAGE_KINDS,
    WrapImageKind,
    type CatalogAssetImageDTO,
    type CatalogAssetReadinessDTO,
    type WrapImageDTO,
} from './types'
import { getMissingRequiredAssetRolesForPublish } from './validators/publish-wrap'

const CLOUDINARY_HOST = 'res.cloudinary.com'

type CatalogDeliveryVariant = 'thumbnail' | 'card' | 'detail'

const TRANSFORMATION_BY_VARIANT: Record<CatalogDeliveryVariant, string> = {
    thumbnail: 'f_auto,q_auto,c_fill,g_auto,w_320,h_240',
    card: 'f_auto,q_auto,c_fill,g_auto,w_960,h_720',
    detail: 'f_auto,q_auto,c_limit,w_1600,h_1200',
}

function sortImages(images: WrapImageDTO[]): WrapImageDTO[] {
    return [...images].sort((left, right) => left.displayOrder - right.displayOrder)
}

function getActiveImagesByKind(images: WrapImageDTO[], kind: WrapImageKind): WrapImageDTO[] {
    return sortImages(images).filter((image) => image.isActive && image.kind === kind)
}

function isCloudinaryUrl(url: string): boolean {
    try {
        const parsed = new URL(url)
        return parsed.hostname.includes(CLOUDINARY_HOST)
    } catch {
        return false
    }
}

function insertCloudinaryTransformation(url: string, transformation: string): string {
    if (!isCloudinaryUrl(url)) {
        return url
    }

    const marker = '/upload/'
    const index = url.indexOf(marker)
    if (index === -1) {
        return url
    }

    return `${url.slice(0, index + marker.length)}${transformation}/${url.slice(index + marker.length)}`
}

export function getCatalogAssetDeliveryUrl(url: string, variant: CatalogDeliveryVariant): string {
    return insertCloudinaryTransformation(url, TRANSFORMATION_BY_VARIANT[variant])
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
    const activeVisualizerTextureCount = getActiveImagesByKind(
        images,
        WrapImageKind.VISUALIZER_TEXTURE
    ).length
    const activeVisualizerMaskHintCount = getActiveImagesByKind(
        images,
        WrapImageKind.VISUALIZER_MASK_HINT
    ).length
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

    if (missingRequiredAssetRoles.includes(WrapImageKind.VISUALIZER_TEXTURE)) {
        issues.push({
            code: 'missing_visualizer_texture',
            message: 'Add an active visualizer texture before publish.',
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

    if (activeVisualizerTextureCount > 1) {
        issues.push({
            code: 'multiple_active_visualizer_texture',
            message: 'Only one visualizer texture can stay active at a time.',
            blocking: true,
        })
    }

    const canPublish = issues.every((issue) => !issue.blocking)

    return {
        canPublish,
        isVisualizerReady:
            activeHeroCount === 1 &&
            activeVisualizerTextureCount === 1 &&
            primaryDisplayAsset !== null,
        missingRequiredAssetRoles,
        requiredAssetRoles: [...PUBLISH_REQUIRED_WRAP_IMAGE_KINDS],
        activeAssetKinds,
        hasDisplayAsset: primaryDisplayAsset !== null,
        activeHeroCount,
        activeGalleryCount,
        activeVisualizerTextureCount,
        activeVisualizerMaskHintCount,
        issues,
    }
}

export function toCatalogAssetImage(image: WrapImageDTO): CatalogAssetImageDTO {
    return {
        ...image,
        thumbnailUrl: getCatalogAssetDeliveryUrl(image.url, 'thumbnail'),
        cardUrl: getCatalogAssetDeliveryUrl(image.url, 'card'),
        detailUrl: getCatalogAssetDeliveryUrl(image.url, 'detail'),
    }
}

export function resolvePrimaryDisplayAsset(images: WrapImageDTO[]): CatalogAssetImageDTO | null {
    const orderedImages = sortImages(images)
    const displayCandidates = orderedImages.filter(
        (image) =>
            image.isActive &&
            (image.kind === WrapImageKind.HERO || image.kind === WrapImageKind.GALLERY)
    )

    const heroImage =
        displayCandidates.find((image) => image.kind === WrapImageKind.HERO) ??
        displayCandidates.find((image) => image.kind === WrapImageKind.GALLERY) ??
        orderedImages.find((image) => image.kind === WrapImageKind.HERO) ??
        orderedImages.find((image) => image.kind === WrapImageKind.GALLERY)

    return heroImage ? toCatalogAssetImage(heroImage) : null
}

export function resolveHeroAsset(images: WrapImageDTO[]): CatalogAssetImageDTO | null {
    const orderedImages = sortImages(images)
    const heroImage =
        orderedImages.find((image) => image.isActive && image.kind === WrapImageKind.HERO) ??
        orderedImages.find((image) => image.kind === WrapImageKind.HERO)

    return heroImage ? toCatalogAssetImage(heroImage) : null
}

export function resolveCatalogGalleryImages(images: WrapImageDTO[]): CatalogAssetImageDTO[] {
    const orderedImages = sortImages(images)
    const activeDisplayImages = orderedImages.filter(
        (image) => image.isActive && image.kind === WrapImageKind.GALLERY
    )
    const fallbackDisplayImages = orderedImages.filter(
        (image) => image.kind === WrapImageKind.GALLERY
    )

    return (activeDisplayImages.length > 0 ? activeDisplayImages : fallbackDisplayImages).map(
        toCatalogAssetImage
    )
}

export function resolveDisplayImages(images: WrapImageDTO[]): CatalogAssetImageDTO[] {
    const heroImage = resolveHeroAsset(images)
    const galleryImages = resolveCatalogGalleryImages(images)

    return heroImage ? [heroImage, ...galleryImages] : galleryImages
}

export function resolveVisualizerTextureAsset(images: WrapImageDTO[]): CatalogAssetImageDTO | null {
    const orderedImages = sortImages(images)
    const textureImage =
        orderedImages.find(
            (image) => image.isActive && image.kind === WrapImageKind.VISUALIZER_TEXTURE
        ) ?? orderedImages.find((image) => image.kind === WrapImageKind.VISUALIZER_TEXTURE)

    return textureImage ? toCatalogAssetImage(textureImage) : null
}

export function resolveVisualizerMaskHintAsset(
    images: WrapImageDTO[]
): CatalogAssetImageDTO | null {
    const orderedImages = sortImages(images)
    const maskHintImage =
        orderedImages.find(
            (image) => image.isActive && image.kind === WrapImageKind.VISUALIZER_MASK_HINT
        ) ?? orderedImages.find((image) => image.kind === WrapImageKind.VISUALIZER_MASK_HINT)

    return maskHintImage ? toCatalogAssetImage(maskHintImage) : null
}
