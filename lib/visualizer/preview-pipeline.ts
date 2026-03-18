import { prisma } from '@/lib/prisma'
import { compositeVehicleWrap } from '@/lib/visualizer/compositor'
import { isAllowedRemotePhotoHost, visualizerConfig } from '@/lib/visualizer/config'
import { createVehicleMask, fallbackCenterMask } from '@/lib/visualizer/huggingface'
import { storePreviewImage } from '@/lib/visualizer/storage'
import { readFile } from 'fs/promises'
import path from 'path'
import sharp from 'sharp'

const TEXTURE_LIBRARY = [
    'carbon-stripe',
    'neon-grid',
    'sunset-wave',
    'matte-diagonal',
    'hex-tech',
    'speed-lines',
] as const

type TextureId = (typeof TEXTURE_LIBRARY)[number]

function textureFromWrapId(wrapId: string): TextureId {
    let hash = 0
    for (let i = 0; i < wrapId.length; i += 1) hash = (hash * 31 + wrapId.charCodeAt(i)) >>> 0
    return TEXTURE_LIBRARY[hash % TEXTURE_LIBRARY.length]
}

function textureSvg(textureId: TextureId, width: number, height: number): string {
    switch (textureId) {
        case 'carbon-stripe':
            return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="transparent"/><pattern id="p" width="48" height="48" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><rect width="48" height="8" fill="rgba(20,20,20,0.35)"/></pattern><rect width="100%" height="100%" fill="url(#p)"/></svg>`
        case 'neon-grid':
            return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="transparent"/><pattern id="p" width="96" height="96" patternUnits="userSpaceOnUse"><path d="M0 0H96 M0 0V96" stroke="rgba(0,180,255,0.35)" stroke-width="4"/></pattern><rect width="100%" height="100%" fill="url(#p)"/></svg>`
        case 'sunset-wave':
            return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="transparent"/><g stroke="rgba(255,120,30,0.34)" stroke-width="12" fill="none">${Array.from({ length: 7 }, (_, i) => `<path d="M0 ${80 + i * 140} C ${width * 0.2} ${20 + i * 140}, ${width * 0.45} ${180 + i * 140}, ${width * 0.7} ${80 + i * 140} S ${width * 0.95} -20, ${width} ${80 + i * 140}"/>`).join('')}</g></svg>`
        case 'matte-diagonal':
            return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="transparent"/><pattern id="p" width="72" height="72" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)"><rect width="72" height="12" fill="rgba(255,255,255,0.22)"/></pattern><rect width="100%" height="100%" fill="url(#p)"/></svg>`
        case 'hex-tech':
            return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="transparent"/><pattern id="p" width="78" height="68" patternUnits="userSpaceOnUse"><polygon points="39,2 74,20 74,48 39,66 4,48 4,20" fill="none" stroke="rgba(130,90,255,0.28)" stroke-width="3"/></pattern><rect width="100%" height="100%" fill="url(#p)"/></svg>`
        case 'speed-lines':
            return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="transparent"/><g stroke="rgba(255,255,255,0.25)" stroke-width="10">${Array.from({ length: Math.ceil(height / 64) + 2 }, (_, i) => `<line x1="0" y1="${i * 64}" x2="${width}" y2="${i * 64 - 180}"/>`).join('')}</g></svg>`
    }
}

async function generateTexture(wrapId: string, width: number, height: number): Promise<Buffer> {
    const textureId = textureFromWrapId(wrapId)
    return sharp(Buffer.from(textureSvg(textureId, width, height)))
        .png()
        .toBuffer()
}

function parseDataUrl(customerPhotoUrl: string): { buffer: Buffer; contentType: string } {
    const match = customerPhotoUrl.match(/^data:(image\/\[a-zA-Z0-9.+-]+);base64,(.+)$/)
    if (!match) throw new Error('Invalid data URL')

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
    if (!response.ok) throw new Error('Unable to fetch image')

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

async function readLocalWrapImage(
    urlPath: string
): Promise<{ buffer: Buffer; contentType: string }> {
    if (!urlPath.startsWith('/uploads/wraps/')) {
        throw new Error('Unsupported local texture path')
    }

    const normalized = path.normalize(urlPath).replaceAll('\\', '/')
    if (!normalized.startsWith('/uploads/wraps/')) {
        throw new Error('Invalid local texture path')
    }

    const absolute = path.join(process.cwd(), 'public', ...normalized.split('/').filter(Boolean))
    const extension = path.extname(absolute).toLowerCase()
    const contentType =
        extension === '.png'
            ? 'image/png'
            : extension === '.jpg' || extension === '.jpeg'
              ? 'image/jpeg'
              : extension === '.webp'
                ? 'image/webp'
                : ''

    if (!visualizerConfig.supportedMimeTypes.includes(contentType)) {
        throw new Error('Unsupported image type')
    }

    const buffer = await readFile(absolute)
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

type TextureCandidate = {
    id: string
    url: string
    kind: string
    isActive: boolean
    displayOrder: number
}

function texturePriority(image: TextureCandidate): number {
    if (image.kind === 'visualizer_texture' && image.isActive) return 0
    if (image.kind === 'visualizer_texture') return 1
    if (image.kind === 'hero' && image.isActive) return 2
    if (image.kind === 'hero') return 3
    if (image.kind === 'gallery' && image.isActive) return 4
    return 5
}

async function resolveCatalogTextureUrl(
    wrapId: string,
    sourceWrapImageId?: string
): Promise<string | null> {
    if (sourceWrapImageId) {
        const sourceImage = await prisma.wrapImage.findFirst({
            where: {
                id: sourceWrapImageId,
                wrapId,
                deletedAt: null,
            },
            select: { url: true },
        })

        if (sourceImage) {
            return sourceImage.url
        }
    }

    const wrapImages = await prisma.wrapImage.findMany({
        where: {
            wrapId,
            deletedAt: null,
        },
        select: {
            id: true,
            url: true,
            kind: true,
            isActive: true,
            displayOrder: true,
        },
        orderBy: {
            displayOrder: 'asc',
        },
    })

    if (wrapImages.length === 0) {
        return null
    }

    const selected = [...wrapImages].sort((left, right) => {
        const priorityDelta = texturePriority(left) - texturePriority(right)
        if (priorityDelta !== 0) {
            return priorityDelta
        }
        return left.displayOrder - right.displayOrder
    })[0]

    return selected?.url ?? null
}

async function readCatalogTextureBuffer(
    wrapId: string,
    sourceWrapImageId?: string
): Promise<Buffer | null> {
    const textureUrl = await resolveCatalogTextureUrl(wrapId, sourceWrapImageId)
    if (!textureUrl) {
        return null
    }

    if (textureUrl.startsWith('data:')) {
        return parseDataUrl(textureUrl).buffer
    }

    if (textureUrl.startsWith('/')) {
        return readLocalWrapImage(textureUrl).then((result) => result.buffer)
    }

    const parsedUrl = new URL(textureUrl)
    return readRemoteImage(parsedUrl).then((result) => result.buffer)
}

export async function generateCompositePreview(params: {
    wrapId: string
    previewId: string
    customerPhotoUrl: string
    sourceWrapImageId?: string | null
}): Promise<string> {
    const { buffer: photoBuffer } = await readPhotoBuffer(params.customerPhotoUrl)

    let maskBuffer: Buffer
    try {
        maskBuffer = await createVehicleMask(photoBuffer)
    } catch {
        maskBuffer = await fallbackCenterMask(photoBuffer)
    }

    const metadata = await sharp(photoBuffer).metadata()
    if (!metadata.width || !metadata.height) throw new Error('Invalid photo dimensions')

    const normalizedMask = await sharp(maskBuffer)
        .resize(metadata.width, metadata.height)
        .png()
        .toBuffer()

    let textureBuffer: Buffer
    try {
        const catalogTexture = await readCatalogTextureBuffer(
            params.wrapId,
            params.sourceWrapImageId ?? undefined
        )
        textureBuffer = catalogTexture
            ? await sharp(catalogTexture).resize(metadata.width, metadata.height).png().toBuffer()
            : await generateTexture(params.wrapId, metadata.width, metadata.height)
    } catch {
        textureBuffer = await generateTexture(params.wrapId, metadata.width, metadata.height)
    }

    const composited = await compositeVehicleWrap({
        photoBuffer,
        maskBuffer: normalizedMask,
        textureBuffer,
        opacity: visualizerConfig.overlayOpacity,
        blend: visualizerConfig.blendMode,
    })

    return storePreviewImage({
        previewId: params.previewId,
        buffer: composited,
        contentType: 'image/png',
    })
}
