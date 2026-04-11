/**
 * Provider-specific Cloudinary integration.
 *
 * This file contains direct Cloudinary SDK initialization and utility helpers.
 * It is considered provider-specific and should not be imported directly by
 * higher-level upload/storage code. Use `lib/integrations/blob.ts` as the
 * canonical, provider-agnostic adapter surface instead.
 *
 * NOTE: This module intentionally keeps a tiny surface of helpers that the
 * `blob` adapter re-exports. Keep behavior unchanged when editing.
 */
import { createHash } from 'crypto'
import type { DeliveryType, ResourceType } from 'cloudinary'

export interface CloudinaryCredentials {
    cloudName: string
    apiKey: string
    apiSecret: string
}

export interface CloudinaryStoredAsset {
    secureUrl: string | null
    assetId: string | null
    publicId: string | null
    version: number | null
    resourceType: ResourceType | 'image'
    deliveryType: DeliveryType | 'upload' | 'authenticated'
    assetFolder: string | null
    format: string | null
    bytes: number | null
    width: number | null
    height: number | null
    mimeType: string | null
    originalFileName: string | null
}

export type CloudinaryAssetVariant = 'thumbnail' | 'detail' | 'download'
export type CloudinaryDeliveryVariant = 'thumbnail' | 'card' | 'detail'
type CloudinaryRuntime = (typeof import('cloudinary'))['v2']

let cloudinaryRuntimePromise: Promise<CloudinaryRuntime> | null = null

function parseCloudinaryUrl(value: string): {
    cloudName: string
    apiKey: string
    apiSecret: string
} | null {
    try {
        const parsed = new URL(value)
        if (parsed.protocol !== 'cloudinary:') {
            return null
        }

        const apiKey = parsed.username?.trim() ?? ''
        const apiSecret = parsed.password?.trim() ?? ''
        const cloudNameFromHost = parsed.hostname?.trim() ?? ''

        return {
            cloudName: cloudNameFromHost,
            apiKey,
            apiSecret,
        }
    } catch {
        const match = value.match(/^cloudinary:\/\/([^:\s]+):([^@\s]+)(?:@([^/\s?#]+))?$/)
        if (!match) {
            return null
        }

        return {
            cloudName: (match[3] ?? '').trim(),
            apiKey: match[1].trim(),
            apiSecret: match[2].trim(),
        }
    }
}

export function getCloudinaryCredentials(): CloudinaryCredentials | null {
    const parsedCloudinaryUrl = parseCloudinaryUrl(process.env.CLOUDINARY_URL?.trim() ?? '')

    const cloudName =
        process.env.CLOUDINARY_CLOUD_NAME?.trim() ??
        process.env.CLOUD_NAME?.trim() ??
        parsedCloudinaryUrl?.cloudName ??
        ''
    const apiKey = process.env.CLOUDINARY_API_KEY?.trim() ?? parsedCloudinaryUrl?.apiKey ?? ''
    const apiSecret =
        process.env.CLOUDINARY_API_SECRET?.trim() ?? parsedCloudinaryUrl?.apiSecret ?? ''

    if (!cloudName || !apiKey || !apiSecret) {
        return null
    }

    return {
        cloudName,
        apiKey,
        apiSecret,
    }
}

export async function getConfiguredCloudinary() {
    const credentials = getCloudinaryCredentials()
    if (!credentials) {
        return null
    }

    const configuredUrl = `cloudinary://${credentials.apiKey}:${credentials.apiSecret}@${credentials.cloudName}`
    const currentCloudinaryUrl = process.env.CLOUDINARY_URL?.trim() ?? ''
    if (!parseCloudinaryUrl(currentCloudinaryUrl)) {
        process.env.CLOUDINARY_URL = configuredUrl
    }

    if (!cloudinaryRuntimePromise) {
        cloudinaryRuntimePromise = import('cloudinary').then((runtime) => runtime.v2)
    }

    const cloudinaryRuntime = await cloudinaryRuntimePromise
    cloudinaryRuntime.config({
        secure: true,
        cloud_name: credentials.cloudName,
        api_key: credentials.apiKey,
        api_secret: credentials.apiSecret,
    })

    return cloudinaryRuntime
}

export function buildCloudinarySignature(
    payload: Record<string, string>,
    apiSecret: string
): string {
    const signingString = Object.keys(payload)
        .sort()
        .map((key) => `${key}=${payload[key]}`)
        .join('&')

    return createHash('sha1').update(`${signingString}${apiSecret}`).digest('hex')
}

export function normalizeCloudinaryUploadResponse(payload: {
    secure_url?: string
    asset_id?: string
    public_id?: string
    version?: number
    resource_type?: string
    type?: string
    asset_folder?: string
    format?: string
    bytes?: number
    width?: number
    height?: number
    original_filename?: string
}): CloudinaryStoredAsset {
    return {
        secureUrl: payload.secure_url ?? null,
        assetId: payload.asset_id ?? null,
        publicId: payload.public_id ?? null,
        version: typeof payload.version === 'number' ? payload.version : null,
        resourceType: (payload.resource_type as ResourceType | undefined) ?? 'image',
        deliveryType: (payload.type as DeliveryType | undefined) ?? 'upload',
        assetFolder: payload.asset_folder ?? null,
        format: payload.format ?? null,
        bytes: typeof payload.bytes === 'number' ? payload.bytes : null,
        width: typeof payload.width === 'number' ? payload.width : null,
        height: typeof payload.height === 'number' ? payload.height : null,
        mimeType: payload.format ? `image/${payload.format}` : null,
        originalFileName: payload.original_filename ?? null,
    }
}

function getTransformationForVariant(variant: CloudinaryAssetVariant) {
    if (variant === 'thumbnail') {
        return [{ fetch_format: 'auto', quality: 'auto', crop: 'fill', gravity: 'auto', width: 480, height: 320 }]
    }

    if (variant === 'detail') {
        return [{ fetch_format: 'auto', quality: 'auto', crop: 'limit', width: 1600, height: 1200 }]
    }

    return undefined
}

const PUBLIC_TRANSFORMATION_BY_VARIANT: Record<CloudinaryDeliveryVariant, string> = {
    thumbnail: 'f_auto,q_auto,c_fill,g_auto,w_320,h_240',
    card: 'f_auto,q_auto,c_fill,g_auto,w_960,h_720',
    detail: 'f_auto,q_auto,c_limit,w_1600,h_1200',
}

export function getCloudinaryPublicTransformation(
    variant: CloudinaryDeliveryVariant
): string {
    return PUBLIC_TRANSFORMATION_BY_VARIANT[variant]
}

export function buildCloudinaryPublicDeliveryUrl(
    asset: Pick<
        CloudinaryStoredAsset,
        'publicId' | 'version' | 'resourceType' | 'deliveryType'
    >,
    transformation: string
): string | null {
    const credentials = getCloudinaryCredentials()
    if (!credentials || !asset.publicId) {
        return null
    }

    const resourceType = asset.resourceType ?? 'image'
    const deliveryType = asset.deliveryType ?? 'upload'
    const versionSegment = asset.version ? `/v${asset.version}` : ''
    const publicIdPath = asset.publicId.split('/').map(encodeURIComponent).join('/')

    return `https://res.cloudinary.com/${credentials.cloudName}/${resourceType}/${deliveryType}/${transformation}${versionSegment}/${publicIdPath}`
}

export async function buildCloudinaryDeliveryUrl(
    asset: Pick<CloudinaryStoredAsset, 'publicId' | 'version' | 'resourceType' | 'deliveryType' | 'format'>,
    variant: CloudinaryAssetVariant = 'detail'
): Promise<string | null> {
    if (!asset.publicId) {
        return null
    }

    const configured = await getConfiguredCloudinary()
    if (!configured) {
        return null
    }

    return configured.url(asset.publicId, {
        secure: true,
        sign_url: true,
        resource_type: asset.resourceType ?? 'image',
        type: asset.deliveryType ?? 'authenticated',
        version: asset.version ?? undefined,
        format: asset.format ?? undefined,
        transformation: getTransformationForVariant(variant),
    })
}

export function extractCloudinaryPublicId(url: string): string | null {
    try {
        const parsed = new URL(url)
        if (!parsed.hostname.includes('res.cloudinary.com')) {
            return null
        }

        const segments = parsed.pathname.split('/').filter(Boolean)
        const deliveryIndex = segments.findIndex((segment) =>
            ['upload', 'authenticated', 'private'].includes(segment)
        )
        if (deliveryIndex < 0 || deliveryIndex + 1 >= segments.length) {
            return null
        }

        const publicIdSegments = segments.slice(deliveryIndex + 1)

        while (
            publicIdSegments.length > 0 &&
            (publicIdSegments[0] ?? '').includes(',') &&
            !/^v\d+$/.test(publicIdSegments[0] ?? '')
        ) {
            publicIdSegments.shift()
        }

        if (publicIdSegments[0] && /^v\d+$/.test(publicIdSegments[0])) {
            publicIdSegments.shift()
        }

        if (publicIdSegments.length === 0) {
            return null
        }

        const lastSegment = publicIdSegments[publicIdSegments.length - 1] ?? ''
        publicIdSegments[publicIdSegments.length - 1] = lastSegment.replace(/\.[a-zA-Z0-9]+$/, '')

        return publicIdSegments.join('/')
    } catch {
        return null
    }
}

export async function destroyCloudinaryAsset(params: {
    publicId: string
    resourceType?: string | null
    deliveryType?: string | null
}): Promise<void> {
    const credentials = getCloudinaryCredentials()
    if (!credentials || !params.publicId) {
        return
    }

    const timestamp = Math.floor(Date.now() / 1000).toString()
    const resourceType = params.resourceType?.trim() || 'image'
    const deliveryType = params.deliveryType?.trim() || 'upload'
    const payload = {
        public_id: params.publicId,
        resource_type: resourceType,
        timestamp,
        type: deliveryType,
    }
    const signature = buildCloudinarySignature(payload, credentials.apiSecret)

    await fetch(`https://api.cloudinary.com/v1_1/${credentials.cloudName}/image/destroy`, {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            ...payload,
            api_key: credentials.apiKey,
            signature,
        }),
    })
}
