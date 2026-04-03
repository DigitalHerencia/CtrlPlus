import type { CatalogAssetImageDTO, WrapImageDTO } from '@/types/catalog.types'

const CLOUDINARY_HOST = 'res.cloudinary.com'

type CatalogDeliveryVariant = 'thumbnail' | 'card' | 'detail'

const TRANSFORMATION_BY_VARIANT: Record<CatalogDeliveryVariant, string> = {
    thumbnail: 'f_auto,q_auto,c_fill,g_auto,w_320,h_240',
    card: 'f_auto,q_auto,c_fill,g_auto,w_960,h_720',
    detail: 'f_auto,q_auto,c_limit,w_1600,h_1200',
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

export function toCatalogAssetImage(image: WrapImageDTO): CatalogAssetImageDTO {
    return {
        ...image,
        thumbnailUrl: getCatalogAssetDeliveryUrl(image.url, 'thumbnail'),
        cardUrl: getCatalogAssetDeliveryUrl(image.url, 'card'),
        detailUrl: getCatalogAssetDeliveryUrl(image.url, 'detail'),
    }
}
