import { createHash, randomUUID } from 'crypto'
import { mkdir, unlink, writeFile } from 'fs/promises'
import path from 'path'

import {
    buildBlobSignature,
    cloudinary,
    extractBlobPublicId,
    getBlobCredentials,
} from '@/lib/integrations/blob'
import { validateWrapImageFile } from '@/lib/uploads/file-validation'

const IMAGE_EXT_BY_TYPE: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
}

interface PersistedWrapImage {
    url: string
    contentHash: string
}

function computeContentHash(buffer: Buffer): string {
    return createHash('sha256').update(buffer).digest('hex')
}

async function persistWrapImageLocally(params: {
    wrapId: string
    file: File
    buffer: Buffer
    contentHash: string
}): Promise<PersistedWrapImage> {
    const ext = IMAGE_EXT_BY_TYPE[params.file.type]
    const fileName = `${params.wrapId}-${randomUUID()}.${ext}`
    const relativeDir = path.join('uploads', 'wraps')
    const relativePath = path.join(relativeDir, fileName)
    const absoluteDir = path.join(process.cwd(), 'public', relativeDir)
    const absolutePath = path.join(process.cwd(), 'public', relativePath)

    await mkdir(absoluteDir, { recursive: true })
    await writeFile(absolutePath, params.buffer)

    return {
        url: `/${relativePath.replaceAll(path.sep, '/')}`,
        contentHash: params.contentHash,
    }
}

async function uploadWrapImageToCloudinary(params: {
    wrapId: string
    file: File
    buffer: Buffer
    contentHash: string
}): Promise<PersistedWrapImage> {
    const credentials = getBlobCredentials()
    if (!credentials) {
        return persistWrapImageLocally(params)
    }

    const uploadPreset = process.env.CLOUDINARY_WRAP_UPLOAD_PRESET?.trim() ?? null
    const folder = process.env.CLOUDINARY_WRAP_FOLDER?.trim() || 'ctrlplus/wraps'
    const publicId = `${folder}/${params.wrapId}-${randomUUID()}`
    const ext = IMAGE_EXT_BY_TYPE[params.file.type] ?? 'png'
    const endpoint = `https://api.cloudinary.com/v1_1/${credentials.cloudName}/image/upload`
    const formData = new FormData()

    formData.set(
        'file',
        new Blob([new Uint8Array(params.buffer)], { type: params.file.type }),
        `${publicId}.${ext}`
    )

    if (uploadPreset) {
        formData.set('upload_preset', uploadPreset)
        formData.set('public_id', publicId)
    } else {
        const timestamp = Math.floor(Date.now() / 1000).toString()
        const signature = buildBlobSignature(
            { public_id: publicId, timestamp },
            credentials.apiSecret
        )

        formData.set('public_id', publicId)
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

    const payload = (await response.json()) as { secure_url?: string }
    if (!payload.secure_url) {
        throw new Error('Cloudinary upload did not return a secure URL')
    }

    return {
        url: payload.secure_url,
        contentHash: params.contentHash,
    }
}

export async function persistWrapImage(params: {
    wrapId: string
    file: File
}): Promise<PersistedWrapImage> {
    validateWrapImageFile(params.file)

    const buffer = Buffer.from(await params.file.arrayBuffer())
    const contentHash = computeContentHash(buffer)

    if (getBlobCredentials()) {
        return uploadWrapImageToCloudinary({
            wrapId: params.wrapId,
            file: params.file,
            buffer,
            contentHash,
        })
    }

    return persistWrapImageLocally({
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

    if (getBlobCredentials()) {
        // upload buffer to cloud provider via blob adapter
        const credentials = getBlobCredentials()!
        const uploadPreset = process.env.CLOUDINARY_WRAP_UPLOAD_PRESET?.trim() ?? null
        const folder = process.env.CLOUDINARY_WRAP_FOLDER?.trim() || 'ctrlplus/wraps'
        const publicId = `${folder}/${params.wrapId}-${randomUUID()}`
        const ext = IMAGE_EXT_BY_TYPE[params.contentType] ?? 'png'
        const endpoint = `https://api.cloudinary.com/v1_1/${credentials.cloudName}/image/upload`
        const formData = new FormData()

        formData.set(
            'file',
            new Blob([new Uint8Array(params.buffer)], { type: params.contentType }),
            `${publicId}.${ext}`
        )

        if (uploadPreset) {
            formData.set('upload_preset', uploadPreset)
            formData.set('public_id', publicId)
        } else {
            const timestamp = Math.floor(Date.now() / 1000).toString()
            const signature = buildBlobSignature(
                { public_id: publicId, timestamp },
                credentials.apiSecret
            )

            formData.set('public_id', publicId)
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

        const payload = (await response.json()) as { secure_url?: string }
        if (!payload.secure_url) {
            throw new Error('Cloudinary upload did not return a secure URL')
        }

        return {
            url: payload.secure_url,
            contentHash,
        }
    }

    // fallback to local persistence
    const ext = IMAGE_EXT_BY_TYPE[params.contentType] ?? 'png'
    const fileName = `${params.wrapId}-${randomUUID()}.${ext}`
    const relativeDir = path.join('uploads', 'wraps')
    const relativePath = path.join(relativeDir, fileName)
    const absoluteDir = path.join(process.cwd(), 'public', relativeDir)
    const absolutePath = path.join(process.cwd(), 'public', relativePath)

    await mkdir(absoluteDir, { recursive: true })
    await writeFile(absolutePath, params.buffer)

    return {
        url: `/${relativePath.replaceAll(path.sep, '/')}`,
        contentHash,
    }
}

export async function deletePersistedWrapImage(url: string): Promise<void> {
    const credentials = getBlobCredentials()
    const publicId = extractBlobPublicId(url)

    if (credentials && publicId) {
        try {
            const timestamp = Math.floor(Date.now() / 1000).toString()
            const signature = buildBlobSignature(
                { public_id: publicId, timestamp },
                credentials.apiSecret
            )

            await fetch(`https://api.cloudinary.com/v1_1/${credentials.cloudName}/image/destroy`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    public_id: publicId,
                    timestamp,
                    api_key: credentials.apiKey,
                    signature,
                }),
            })
            return
        } catch {
            // Fall through to the local cleanup path.
        }
    }

    if (!url.startsWith('/uploads/wraps/')) {
        return
    }

    const absolutePath = path.join(process.cwd(), 'public', ...url.split('/').filter(Boolean))

    try {
        await unlink(absolutePath)
    } catch {
        // DB soft-delete remains authoritative.
    }
}

export function storePreviewImage(params: {
    previewId: string
    buffer: Buffer
    contentType?: string
}): Promise<string> {
    void params.contentType

    return new Promise((resolve, reject) => {
        const publicId = `visualizer/previews/${params.previewId}-${randomUUID()}`
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                public_id: publicId,
                folder: 'visualizer/previews',
                resource_type: 'image',
                overwrite: true,
                format: 'png',
            },
            (error, result) => {
                if (error || !result?.secure_url) {
                    reject(error ?? new Error('Preview image storage failed.'))
                    return
                }

                resolve(result.secure_url)
            }
        )

        uploadStream.end(params.buffer)
    })
}
