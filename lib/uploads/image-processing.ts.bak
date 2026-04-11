import crypto from 'crypto'
import sharp from 'sharp'

import { isAllowedRemotePhotoHost, visualizerConfig } from '@/lib/integrations/huggingface'

const MIN_DIMENSION = 512
const MAX_DIMENSION = 4096
const NORMALIZED_MAX_DIMENSION = 1536

export interface NormalizedVehicleUpload {
    buffer: Buffer
    contentType: 'image/png'
    width: number
    height: number
    hash: string
}

function parseDataUrl(customerPhotoUrl: string): { buffer: Buffer; contentType: string } {
    const match = customerPhotoUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/)
    if (!match) {
        throw new Error('Invalid data URL')
    }

    const contentType = match[1].toLowerCase()
    if (!visualizerConfig.supportedMimeTypes.includes(contentType)) {
        throw new Error('Unsupported image type')
    }

    const buffer = Buffer.from(match[2], 'base64')
    if (buffer.length > visualizerConfig.maxUploadSizeBytes) {
        throw new Error('Uploaded image exceeds max size')
    }

    return { buffer, contentType }
}

export function assertApprovedRemoteHost(url: URL): void {
    const host = url.hostname.toLowerCase()
    if (!isAllowedRemotePhotoHost(host)) {
        throw new Error('Image host is not allowed')
    }
}

async function readRemoteImage(url: URL): Promise<{ buffer: Buffer; contentType: string }> {
    if (url.protocol !== 'https:') {
        throw new Error('Only HTTPS image URLs are allowed')
    }

    assertApprovedRemoteHost(url)

    const response = await fetch(url.toString())
    if (!response.ok) {
        throw new Error('Unable to fetch image')
    }

    const contentType = response.headers.get('content-type')?.split(';')[0].toLowerCase() ?? ''
    if (!visualizerConfig.supportedMimeTypes.includes(contentType)) {
        throw new Error('Unsupported image type')
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    if (buffer.length > visualizerConfig.maxUploadSizeBytes) {
        throw new Error('Uploaded image exceeds max size')
    }

    return { buffer, contentType }
}

export async function readPhotoBuffer(
    customerPhotoUrl: string
): Promise<{ buffer: Buffer; contentType: string }> {
    if (customerPhotoUrl.startsWith('data:')) {
        return parseDataUrl(customerPhotoUrl)
    }

    let parsed: URL
    try {
        parsed = new URL(customerPhotoUrl)
    } catch {
        throw new Error('Only data URLs or approved HTTPS image URLs are allowed')
    }

    return readRemoteImage(parsed)
}

export async function readImageBufferFromUrl(url: string): Promise<Buffer> {
    if (url.startsWith('data:')) {
        return parseDataUrl(url).buffer
    }

    if (url.startsWith('/')) {
        throw new Error(
            'Legacy local catalog asset paths are no longer supported. Re-upload the wrap image to Cloudinary.'
        )
    }

    return readRemoteImage(new URL(url)).then((result) => result.buffer)
}

export async function normalizeVehicleUpload(file: File): Promise<NormalizedVehicleUpload> {
    const mimeType = file.type.toLowerCase()
    if (!visualizerConfig.supportedMimeTypes.includes(mimeType)) {
        throw new Error('Unsupported image type')
    }

    if (file.size > visualizerConfig.maxUploadSizeBytes) {
        throw new Error('Uploaded image exceeds max size')
    }

    const inputBuffer = Buffer.from(await file.arrayBuffer())
    const normalizedBuffer = await sharp(inputBuffer)
        .rotate()
        .resize(NORMALIZED_MAX_DIMENSION, NORMALIZED_MAX_DIMENSION, {
            fit: 'inside',
            withoutEnlargement: true,
        })
        .png()
        .toBuffer()

    const metadata = await sharp(normalizedBuffer).metadata()
    if (!metadata.width || !metadata.height) {
        throw new Error('Invalid photo dimensions')
    }

    if (metadata.width < MIN_DIMENSION || metadata.height < MIN_DIMENSION) {
        throw new Error('Image too small (min 512x512)')
    }

    if (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
        throw new Error('Image too large (max 4096x4096)')
    }

    return {
        buffer: normalizedBuffer,
        contentType: 'image/png',
        width: metadata.width,
        height: metadata.height,
        hash: crypto.createHash('sha256').update(normalizedBuffer).digest('hex'),
    }
}

export async function normalizeVehicleBuffer(
    inputBuffer: Buffer,
    contentType: string
): Promise<NormalizedVehicleUpload> {
    const mimeType = contentType.toLowerCase()
    if (!visualizerConfig.supportedMimeTypes.includes(mimeType)) {
        throw new Error('Unsupported image type')
    }

    if (inputBuffer.length > visualizerConfig.maxUploadSizeBytes) {
        throw new Error('Uploaded image exceeds max size')
    }

    const normalizedBuffer = await sharp(inputBuffer)
        .rotate()
        .resize(NORMALIZED_MAX_DIMENSION, NORMALIZED_MAX_DIMENSION, {
            fit: 'inside',
            withoutEnlargement: true,
        })
        .png()
        .toBuffer()

    const metadata = await sharp(normalizedBuffer).metadata()
    if (!metadata.width || !metadata.height) {
        throw new Error('Invalid photo dimensions')
    }

    if (metadata.width < MIN_DIMENSION || metadata.height < MIN_DIMENSION) {
        throw new Error('Image too small (min 512x512)')
    }

    if (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
        throw new Error('Image too large (max 4096x4096)')
    }

    return {
        buffer: normalizedBuffer,
        contentType: 'image/png',
        width: metadata.width,
        height: metadata.height,
        hash: crypto.createHash('sha256').update(normalizedBuffer).digest('hex'),
    }
}
