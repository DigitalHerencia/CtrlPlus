import { createHash, randomUUID } from 'crypto'

import {
    type BlobStoredAsset,
    buildBlobSignature,
    destroyBlobAsset,
    extractBlobPublicId,
    getBlobCredentials,
    normalizeBlobUploadResponse,
} from '@/lib/integrations/blob'
import { validateWrapImageFile } from '@/lib/uploads/file-validation'

const IMAGE_EXT_BY_TYPE: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
}

export interface PersistedWrapImage extends BlobStoredAsset {
    url: string
    contentHash: string
}

export interface PersistedVisualizerAsset extends BlobStoredAsset {
    contentHash: string
    legacyUrl: string | null
}

function computeContentHash(buffer: Buffer): string {
    return createHash('sha256').update(buffer).digest('hex')
}

function serializeMetadataContext(metadata: Record<string, string | number | null | undefined>) {
    const pairs = Object.entries(metadata).filter(
        ([, value]) => value !== null && value !== undefined && `${value}`.trim().length > 0
    )

    if (pairs.length === 0) {
        return null
    }

    return pairs
        .map(([key, value]) => `${key}=${String(value).replaceAll('|', '/').replaceAll('=', ':')}`)
        .join('|')
}

async function uploadImageToCloudinary(params: {
    publicId: string
    fileName: string
    buffer: Buffer
    contentType: string
    uploadPreset?: string | null
    assetFolder?: string | null
    deliveryType?: 'upload' | 'authenticated'
    metadata?: Record<string, string | number | null | undefined>
}): Promise<BlobStoredAsset> {
    const credentials = getBlobCredentials()
    if (!credentials) {
        throw new Error(
            'Cloudinary is required. Configure CLOUDINARY_CLOUD_NAME (or CLOUD_NAME), CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.'
        )
    }

    const endpoint = `https://api.cloudinary.com/v1_1/${credentials.cloudName}/image/upload`
    const formData = new FormData()
    const timestamp = Math.floor(Date.now() / 1000).toString()
    const deliveryType = params.deliveryType ?? 'upload'
    const context = serializeMetadataContext(params.metadata ?? {})
    const signedPayload: Record<string, string> = {
        public_id: params.publicId,
        timestamp,
    }

    formData.set(
        'file',
        new Blob([new Uint8Array(params.buffer)], { type: params.contentType }),
        params.fileName
    )
    formData.set('public_id', params.publicId)

    if (deliveryType !== 'upload') {
        formData.set('type', deliveryType)
        signedPayload.type = deliveryType
    }

    if (params.assetFolder?.trim()) {
        formData.set('asset_folder', params.assetFolder)
        signedPayload.asset_folder = params.assetFolder
    }

    if (context) {
        formData.set('context', context)
        signedPayload.context = context
    }

    if (params.uploadPreset?.trim()) {
        formData.set('upload_preset', params.uploadPreset)
    } else {
        const signature = buildBlobSignature(signedPayload, credentials.apiSecret)

        formData.set('timestamp', timestamp)
        formData.set('api_key', credentials.apiKey)
        formData.set('signature', signature)
    }

    const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
    })

    if (!response.ok) {
        throw new Error('Cloudinary upload failed')
    }

    return normalizeBlobUploadResponse(
        (await response.json()) as Parameters<typeof normalizeBlobUploadResponse>[0]
    )
}

async function uploadWrapImageToCloudinary(params: {
    wrapId: string
    file: File
    buffer: Buffer
    contentHash: string
}): Promise<PersistedWrapImage> {
    const uploadPreset = process.env.CLOUDINARY_WRAP_UPLOAD_PRESET?.trim() ?? null
    const folder = process.env.CLOUDINARY_WRAP_FOLDER?.trim() || 'ctrlplus/wraps'
    const publicId = `${folder}/${params.wrapId}-${randomUUID()}`
    const ext = IMAGE_EXT_BY_TYPE[params.file.type] ?? 'png'
    const payload = await uploadImageToCloudinary({
        publicId,
        fileName: `${publicId}.${ext}`,
        buffer: params.buffer,
        contentType: params.file.type,
        uploadPreset,
        assetFolder: folder,
        metadata: {
            wrapId: params.wrapId,
            assetRole: 'catalog_wrap_image',
            contentHash: params.contentHash,
        },
    })

    if (!payload.secureUrl) {
        throw new Error('Cloudinary upload did not return a secure URL')
    }

    return {
        url: payload.secureUrl,
        contentHash: params.contentHash,
        secureUrl: payload.secureUrl,
        assetId: payload.assetId,
        publicId: payload.publicId,
        version: payload.version,
        resourceType: payload.resourceType,
        deliveryType: payload.deliveryType,
        assetFolder: payload.assetFolder,
        format: payload.format,
        bytes: payload.bytes,
        width: payload.width,
        height: payload.height,
        mimeType: payload.mimeType,
        originalFileName: payload.originalFileName,
    }
}

export async function persistWrapImage(params: {
    wrapId: string
    file: File
}): Promise<PersistedWrapImage> {
    validateWrapImageFile(params.file)

    const buffer = Buffer.from(await params.file.arrayBuffer())
    const contentHash = computeContentHash(buffer)

    return uploadWrapImageToCloudinary({
        wrapId: params.wrapId,
        file: params.file,
        buffer,
        contentHash,
    })
}

export async function persistWrapImageFromBuffer(params: {
    wrapId: string
    buffer: Buffer
    contentType: string
}): Promise<PersistedWrapImage> {
    const contentHash = computeContentHash(params.buffer)

    const uploadPreset = process.env.CLOUDINARY_WRAP_UPLOAD_PRESET?.trim() ?? null
    const folder = process.env.CLOUDINARY_WRAP_FOLDER?.trim() || 'ctrlplus/wraps'
    const publicId = `${folder}/${params.wrapId}-${randomUUID()}`
    const ext = IMAGE_EXT_BY_TYPE[params.contentType] ?? 'png'
    const payload = await uploadImageToCloudinary({
        publicId,
        fileName: `${publicId}.${ext}`,
        buffer: params.buffer,
        contentType: params.contentType,
        uploadPreset,
        assetFolder: folder,
        metadata: {
            wrapId: params.wrapId,
            assetRole: 'catalog_wrap_image',
            contentHash,
        },
    })

    if (!payload.secureUrl) {
        throw new Error('Cloudinary upload did not return a secure URL')
    }

    return {
        url: payload.secureUrl,
        contentHash,
        secureUrl: payload.secureUrl,
        assetId: payload.assetId,
        publicId: payload.publicId,
        version: payload.version,
        resourceType: payload.resourceType,
        deliveryType: payload.deliveryType,
        assetFolder: payload.assetFolder,
        format: payload.format,
        bytes: payload.bytes,
        width: payload.width,
        height: payload.height,
        mimeType: payload.mimeType,
        originalFileName: payload.originalFileName,
    }
}

export async function deletePersistedWrapImage(params: {
    url: string | null
    cloudinaryPublicId?: string | null
    cloudinaryResourceType?: string | null
    cloudinaryDeliveryType?: string | null
}): Promise<void> {
    const publicId =
        params.cloudinaryPublicId ?? (params.url ? extractBlobPublicId(params.url) : null)

    if (publicId) {
        try {
            await destroyBlobAsset({
                publicId,
                resourceType: params.cloudinaryResourceType,
                deliveryType: params.cloudinaryDeliveryType,
            })
            return
        } catch {
            // DB soft-delete remains authoritative.
        }
    }
}

export function storePreviewImage(params: {
    previewId: string
    buffer: Buffer
    contentType?: string
    folder?: string
    metadata?: Record<string, string | number | null | undefined>
}): Promise<string> {
    return persistVisualizerPreviewAsset({
        previewId: params.previewId,
        buffer: params.buffer,
        contentType: params.contentType,
        folder: params.folder,
        metadata: params.metadata,
    }).then((asset) => asset.secureUrl ?? asset.legacyUrl ?? '')
}

export async function persistVisualizerUploadAsset(params: {
    uploadId: string
    ownerClerkUserId: string
    buffer: Buffer
    contentType?: string
    fileName?: string | null
    folder?: string
    metadata?: Record<string, string | number | null | undefined>
}): Promise<PersistedVisualizerAsset> {
    const contentType = params.contentType ?? 'image/png'
    const contentHash = computeContentHash(params.buffer)
    const uploadPreset = process.env.CLOUDINARY_VISUALIZER_UPLOAD_PRESET?.trim() ?? null
    const folder =
        params.folder?.trim() ||
        process.env.CLOUDINARY_VISUALIZER_UPLOAD_FOLDER?.trim() ||
        process.env.CLOUDINARY_VISUALIZER_FOLDER?.trim() ||
        `ctrlplus/visualizer/uploads/${params.ownerClerkUserId}`
    const publicId = `${folder}/${params.uploadId}-${randomUUID()}`
    const ext = IMAGE_EXT_BY_TYPE[contentType] ?? 'png'
    const asset = await uploadImageToCloudinary({
        publicId,
        fileName: `${publicId}.${ext}`,
        buffer: params.buffer,
        contentType,
        uploadPreset,
        assetFolder: folder,
        deliveryType: 'authenticated',
        metadata: {
            ownerClerkUserId: params.ownerClerkUserId,
            visualizerUploadId: params.uploadId,
            assetRole: 'visualizer_upload',
            ...params.metadata,
        },
    })

    return {
        ...asset,
        contentHash,
        legacyUrl: null,
        originalFileName: params.fileName ?? asset.originalFileName,
        mimeType: contentType,
    }
}

export async function persistVisualizerPreviewAsset(params: {
    previewId: string
    buffer: Buffer
    contentType?: string
    folder?: string
    metadata?: Record<string, string | number | null | undefined>
}): Promise<PersistedVisualizerAsset> {
    const contentType = params.contentType ?? 'image/png'
    const contentHash = computeContentHash(params.buffer)
    const uploadPreset = process.env.CLOUDINARY_VISUALIZER_UPLOAD_PRESET?.trim() ?? null
    const folder =
        params.folder?.trim() ||
        process.env.CLOUDINARY_VISUALIZER_OUTPUTS_FOLDER?.trim() ||
        process.env.CLOUDINARY_VISUALIZER_FOLDER?.trim() ||
        'ctrlplus/visualizer/outputs'
    const publicId = `${folder}/${params.previewId}-${randomUUID()}`
    const asset = await uploadImageToCloudinary({
        publicId,
        fileName: `${publicId}.png`,
        buffer: params.buffer,
        contentType,
        uploadPreset,
        assetFolder: folder,
        deliveryType: 'authenticated',
        metadata: {
            visualizerPreviewId: params.previewId,
            assetRole: 'visualizer_preview',
            ...params.metadata,
        },
    })

    return {
        ...asset,
        contentHash,
        legacyUrl: null,
        mimeType: contentType,
    }
}

export async function persistVisualizerPreviewMaskAsset(params: {
    previewId: string
    ownerClerkUserId: string
    buffer: Buffer
    contentType?: string
    folder?: string
    metadata?: Record<string, string | number | null | undefined>
}): Promise<PersistedVisualizerAsset> {
    const contentType = params.contentType ?? 'image/png'
    const contentHash = computeContentHash(params.buffer)
    const uploadPreset = process.env.CLOUDINARY_VISUALIZER_UPLOAD_PRESET?.trim() ?? null
    const folder =
        params.folder?.trim() ||
        `${
            process.env.CLOUDINARY_VISUALIZER_OUTPUTS_FOLDER?.trim() ||
            process.env.CLOUDINARY_VISUALIZER_FOLDER?.trim() ||
            'ctrlplus/visualizer/outputs'
        }/${params.ownerClerkUserId}/masks`
    const publicId = `${folder}/${params.previewId}-mask-${randomUUID()}`
    const asset = await uploadImageToCloudinary({
        publicId,
        fileName: `${publicId}.png`,
        buffer: params.buffer,
        contentType,
        uploadPreset,
        assetFolder: folder,
        deliveryType: 'authenticated',
        metadata: {
            ownerClerkUserId: params.ownerClerkUserId,
            visualizerPreviewId: params.previewId,
            assetRole: 'visualizer_preview_mask',
            ...params.metadata,
        },
    })

    return {
        ...asset,
        contentHash,
        legacyUrl: null,
        mimeType: contentType,
    }
}
