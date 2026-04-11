/**
 * @introduction Utils — TODO: short one-line summary of catalog-assets.ts
 *
 * @description TODO: longer description for catalog-assets.ts. Keep it short — one or two sentences.
 * Domain: utils
 * Public: TODO (yes/no)
 */
import type { CatalogAssetImageDTO } from '@/types/catalog.types'

type CatalogDeliveryVariant = 'thumbnail' | 'card' | 'detail'

const CLOUDINARY_HOST = 'res.cloudinary.com'

const TRANSFORMATION_BY_VARIANT: Record<CatalogDeliveryVariant, string> = {
    thumbnail: 'f_auto,q_auto,c_fill,g_auto,w_320,h_240',
    card: 'f_auto,q_auto,c_fill,g_auto,w_960,h_720',
    detail: 'f_auto,q_auto,c_limit,w_1600,h_1200',
}
type CatalogAssetDeliverySource = {
    id: string
    url: string
    kind: CatalogAssetImageDTO['kind']
    isActive: boolean
    version: number
    contentHash: string
    displayOrder: number
    cloudinaryPublicId?: string | null
    cloudinaryVersion?: number | null
    cloudinaryResourceType?: string | null
    cloudinaryDeliveryType?: string | null
    thumbnailUrl?: string
    cardUrl?: string
    detailUrl?: string
}

function getCatalogAssetBaseUrl(url: string): string | null {
    try {
        const parsed = new URL(url)
        if (!parsed.hostname.includes(CLOUDINARY_HOST)) {
            return null
        }

        const [cloudName] = parsed.pathname.split('/').filter(Boolean)
        if (!cloudName) {
            return null
        }

        return `${parsed.origin}/${cloudName}`
    } catch {
        return null
    }
}

function buildCloudinaryCatalogDeliveryUrl(
    image: CatalogAssetDeliverySource,
    variant: CatalogDeliveryVariant
): string | null {
    if (!image.cloudinaryPublicId) {
        return null
    }

    const baseUrl = getCatalogAssetBaseUrl(image.url)
    if (!baseUrl) {
        return null
    }

    const resourceType = image.cloudinaryResourceType ?? 'image'
    const deliveryType = image.cloudinaryDeliveryType ?? 'upload'
    const versionSegment = image.cloudinaryVersion ? `/v${image.cloudinaryVersion}` : ''
    const publicIdPath = image.cloudinaryPublicId.split('/').map(encodeURIComponent).join('/')

    return `${baseUrl}/${resourceType}/${deliveryType}/${TRANSFORMATION_BY_VARIANT[variant]}${versionSegment}/${publicIdPath}`
}

/**
 * getCatalogAssetDeliveryUrl — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function getCatalogAssetDeliveryUrl(
    image: CatalogAssetDeliverySource,
    variant: CatalogDeliveryVariant
): string {
    const existing =
        variant === 'thumbnail'
            ? image.thumbnailUrl
            : variant === 'card'
              ? image.cardUrl
              : image.detailUrl

    if (existing?.trim()) {
        return existing
    }

    const transformedUrl = buildCloudinaryCatalogDeliveryUrl(image, variant)

    return transformedUrl ?? image.url
}

/**
 * toCatalogAssetImage — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function toCatalogAssetImage(image: CatalogAssetDeliverySource): CatalogAssetImageDTO {
    return {
        id: image.id,
        url: image.url,
        kind: image.kind,
        isActive: image.isActive,
        version: image.version,
        contentHash: image.contentHash,
        displayOrder: image.displayOrder,
        thumbnailUrl: getCatalogAssetDeliveryUrl(image, 'thumbnail'),
        cardUrl: getCatalogAssetDeliveryUrl(image, 'card'),
        detailUrl: getCatalogAssetDeliveryUrl(image, 'detail'),
    }
}
