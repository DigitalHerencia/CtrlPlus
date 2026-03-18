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

export function getCatalogAssetReadiness(images: WrapImageDTO[]): CatalogAssetReadinessDTO {
    const activeImages = sortImages(images).filter((image) => image.isActive)
    const activeAssetKinds = Array.from(new Set(activeImages.map((image) => image.kind)))
    const missingRequiredAssetRoles = getMissingRequiredAssetRolesForPublish(activeImages)
    const primaryDisplayAsset = resolvePrimaryDisplayAsset(images)

    return {
        canPublish: missingRequiredAssetRoles.length === 0,
        missingRequiredAssetRoles,
        requiredAssetRoles: [...PUBLISH_REQUIRED_WRAP_IMAGE_KINDS],
        activeAssetKinds,
        hasDisplayAsset: primaryDisplayAsset !== null,
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
        (image) => image.isActive && (image.kind === WrapImageKind.HERO || image.kind === WrapImageKind.GALLERY)
    )

    const heroImage =
        displayCandidates.find((image) => image.kind === WrapImageKind.HERO) ??
        displayCandidates.find((image) => image.kind === WrapImageKind.GALLERY) ??
        orderedImages.find((image) => image.kind === WrapImageKind.HERO) ??
        orderedImages.find((image) => image.kind === WrapImageKind.GALLERY)

    return heroImage ? toCatalogAssetImage(heroImage) : null
}

export function resolveCatalogGalleryImages(images: WrapImageDTO[]): CatalogAssetImageDTO[] {
    const orderedImages = sortImages(images)
    const activeDisplayImages = orderedImages.filter(
        (image) => image.isActive && (image.kind === WrapImageKind.HERO || image.kind === WrapImageKind.GALLERY)
    )
    const fallbackDisplayImages = orderedImages.filter(
        (image) => image.kind === WrapImageKind.HERO || image.kind === WrapImageKind.GALLERY
    )

    return (activeDisplayImages.length > 0 ? activeDisplayImages : fallbackDisplayImages).map(
        toCatalogAssetImage
    )
}

export function resolveVisualizerTextureAsset(images: WrapImageDTO[]): CatalogAssetImageDTO | null {
    const orderedImages = sortImages(images)
    const textureImage =
        orderedImages.find(
            (image) => image.isActive && image.kind === WrapImageKind.VISUALIZER_TEXTURE
        ) ?? orderedImages.find((image) => image.kind === WrapImageKind.VISUALIZER_TEXTURE)

    return textureImage ? toCatalogAssetImage(textureImage) : null
}
