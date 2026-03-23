import crypto from 'crypto'
import { readFile } from 'fs/promises'
import path from 'path'

import sharp from 'sharp'

import { compositeVehicleWrap } from '@/lib/visualizer/compositor'
import { isAllowedRemotePhotoHost, visualizerConfig } from '@/lib/visualizer/config'
import { createVehicleMask, fallbackCenterMask } from '@/lib/visualizer/huggingface'
import { storePreviewImage } from '@/lib/visualizer/storage'

const MIN_DIMENSION = 512
const MAX_DIMENSION = 4096
const NORMALIZED_MAX_DIMENSION = 2048

export interface NormalizedVehicleUpload {
    buffer: Buffer
    contentType: 'image/png'
    width: number
    height: number
    hash: string
}

export interface WrapPromptInput {
    name: string
    description: string | null
    aiPromptTemplate: string | null
    aiNegativePrompt: string | null
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

    if (!contentType || !visualizerConfig.supportedMimeTypes.includes(contentType)) {
        throw new Error('Unsupported image type')
    }

    const buffer = await readFile(absolute)
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
        return readLocalWrapImage(url).then((result) => result.buffer)
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

function applyWrapPromptTemplate(template: string, input: WrapPromptInput): string {
    return template
        .replaceAll('{{wrap_name}}', input.name)
        .replaceAll('{{wrap_description}}', input.description ?? '')
}

export function buildWrapPreviewPrompt(input: WrapPromptInput): {
    prompt: string
    negativePrompt: string
    promptVersion: string
} {
    const prompt = input.aiPromptTemplate?.trim()
        ? applyWrapPromptTemplate(input.aiPromptTemplate, input)
        : [
              `Apply the wrap design "${input.name}" to the supplied vehicle image.`,
              'Keep the vehicle body shape, wheel position, reflections, windows, background, and camera angle unchanged.',
              'Use the provided wrap texture as the exterior material reference.',
              input.description ? `Design notes: ${input.description}` : null,
              'Produce a professional, realistic commercial vehicle wrap preview.',
          ]
              .filter(Boolean)
              .join(' ')

    const negativePrompt =
        input.aiNegativePrompt?.trim() ??
        'Do not change the vehicle model, body panels, mirrors, wheels, windows, lighting, or environment. Avoid distortions, extra vehicles, warped logos, unreadable text, and surreal edits.'

    const promptVersion = crypto
        .createHash('sha256')
        .update(`${prompt}\n---\n${negativePrompt}`)
        .digest('hex')

    return {
        prompt,
        negativePrompt,
        promptVersion,
    }
}

export async function buildPreviewConditioningBoard(params: {
    vehicleBuffer: Buffer
    textureBuffer: Buffer
    wrapName: string
    wrapDescription: string | null
}): Promise<Buffer> {
    const canvasWidth = 1536
    const canvasHeight = 1024
    const photoWidth = 1040
    const swatchWidth = 400
    const gutter = 48
    const rightPanelX = photoWidth + gutter

    const vehicleImage = await sharp(params.vehicleBuffer)
        .resize(photoWidth, canvasHeight - 96, { fit: 'contain', background: '#09090b' })
        .png()
        .toBuffer()

    const textureTile = await sharp(params.textureBuffer)
        .resize(swatchWidth, swatchWidth, { fit: 'cover' })
        .png()
        .toBuffer()

    const copySvg = Buffer.from(`
        <svg width="${canvasWidth}" height="${canvasHeight}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#09090b"/>
          <text x="${rightPanelX}" y="110" fill="#f5f5f5" font-size="56" font-family="Arial, sans-serif" font-weight="700">
            ${params.wrapName.replaceAll('&', '&amp;')}
          </text>
          <text x="${rightPanelX}" y="164" fill="#a3a3a3" font-size="24" font-family="Arial, sans-serif">
            Wrap texture reference
          </text>
          <text x="${rightPanelX}" y="654" fill="#a3a3a3" font-size="26" font-family="Arial, sans-serif">
            ${(
                params.wrapDescription ??
                'Apply this wrap while preserving the original vehicle and background.'
            )
                .slice(0, 160)
                .replaceAll('&', '&amp;')}
          </text>
        </svg>
    `)

    return sharp({
        create: {
            width: canvasWidth,
            height: canvasHeight,
            channels: 4,
            background: '#09090b',
        },
    })
        .composite([
            { input: copySvg },
            { input: vehicleImage, left: 24, top: 48 },
            { input: textureTile, left: rightPanelX, top: 220 },
        ])
        .png()
        .toBuffer()
}

export async function generateDeterministicCompositePreview(params: {
    previewId: string
    photoBuffer: Buffer
    textureBuffer: Buffer
}): Promise<string> {
    let maskBuffer: Buffer
    try {
        maskBuffer = await createVehicleMask(params.photoBuffer)
    } catch {
        maskBuffer = await fallbackCenterMask(params.photoBuffer)
    }

    const metadata = await sharp(params.photoBuffer).metadata()
    if (!metadata.width || !metadata.height) {
        throw new Error('Invalid photo dimensions')
    }

    const normalizedMask = await sharp(maskBuffer)
        .resize(metadata.width, metadata.height)
        .png()
        .toBuffer()

    const normalizedTexture = await sharp(params.textureBuffer)
        .resize(metadata.width, metadata.height)
        .png()
        .toBuffer()

    const composited = await compositeVehicleWrap({
        photoBuffer: params.photoBuffer,
        maskBuffer: normalizedMask,
        textureBuffer: normalizedTexture,
        opacity: visualizerConfig.overlayOpacity,
        blend: visualizerConfig.blendMode,
    })

    return storePreviewImage({
        previewId: params.previewId,
        buffer: composited,
        contentType: 'image/png',
    })
}
