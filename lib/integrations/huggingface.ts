import { InferenceClient } from '@huggingface/inference'
import sharp from 'sharp'
import { getCloudinaryCredentials } from '@/lib/integrations/cloudinary'

function parseAllowedHosts(value: string | undefined): string[] {
    if (!value) {
        return []
    }

    return value
        .split(',')
        .map((host) => host.trim().toLowerCase())
        .filter((host) => host.length > 0)
}

function extractHostFromUrl(url: string | undefined): string | null {
    if (!url) {
        return null
    }

    try {
        return new URL(url).hostname.toLowerCase()
    } catch {
        return null
    }
}

export const visualizerConfig = {
    maxUploadSizeBytes: Number(process.env.VISUALIZER_MAX_UPLOAD_SIZE_BYTES ?? 10 * 1024 * 1024),
    supportedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    previewTtlMs: 24 * 60 * 60 * 1000,
    maskModel: process.env.HUGGINGFACE_VISUALIZER_MODEL ?? 'keras/segformer_b1_cityscapes_1024',
    huggingFaceModelRevision: process.env.HUGGINGFACE_VISUALIZER_REVISION ?? 'main',
    huggingFaceProvider: process.env.HUGGINGFACE_VISUALIZER_PROVIDER ?? 'self-hosted',
    previewModel: process.env.HUGGINGFACE_VISUALIZER_PREVIEW_MODEL ?? '',
    previewProvider: process.env.HUGGINGFACE_VISUALIZER_PREVIEW_PROVIDER ?? 'hf-inference',
    huggingFaceApiBase:
        process.env.HUGGINGFACE_INFERENCE_API_BASE ?? 'https://api-inference.huggingface.co/models',
    huggingFaceToken: process.env.HUGGINGFACE_API_TOKEN,
    huggingFaceTimeoutMs: Number(process.env.HUGGINGFACE_TIMEOUT_MS ?? 12000),
    huggingFaceRetries: Number(process.env.HUGGINGFACE_RETRIES ?? 2),
    blendMode:
        (process.env.VISUALIZER_BLEND_MODE as 'multiply' | 'overlay' | undefined) ?? 'multiply',
    overlayOpacity: Number(process.env.VISUALIZER_OVERLAY_OPACITY ?? 0.58),
    allowedRemotePhotoHosts: Array.from(
        new Set(
            [
                ...parseAllowedHosts(process.env.VISUALIZER_ALLOWED_IMAGE_HOSTS),
                extractHostFromUrl(process.env.NEXT_PUBLIC_APP_URL),
                extractHostFromUrl(process.env.BLOB_STORE_URL),
                getCloudinaryCredentials() ? 'res.cloudinary.com' : null,
                process.env.BLOB_READ_WRITE_TOKEN ? 'blob.vercel-storage.com' : null,
            ].filter((value): value is string => Boolean(value))
        )
    ),
}

export function isAllowedRemotePhotoHost(hostname: string): boolean {
    const normalizedHostname = hostname.toLowerCase()

    return visualizerConfig.allowedRemotePhotoHosts.some(
        (allowedHost) =>
            normalizedHostname === allowedHost || normalizedHostname.endsWith(`.${allowedHost}`)
    )
}

interface HfSegmentationResult {
    label?: string
    score?: number
    mask?: string
}

const VEHICLE_LABELS = new Set(['car', 'truck', 'bus', 'vehicle'])

function buildHfInferenceUrl(): string {
    const encodedModel = encodeURIComponent(visualizerConfig.maskModel)
    const base = `${visualizerConfig.huggingFaceApiBase}/${encodedModel}`
    const revision = visualizerConfig.huggingFaceModelRevision?.trim()

    if (!revision || revision === 'main') {
        return base
    }

    return `${base}?revision=${encodeURIComponent(revision)}`
}

async function callHf(imageBuffer: Buffer): Promise<HfSegmentationResult[]> {
    if (!visualizerConfig.huggingFaceToken) {
        throw new Error('HUGGINGFACE_API_TOKEN is required for segmentation')
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), visualizerConfig.huggingFaceTimeoutMs)

    try {
        const response = await fetch(buildHfInferenceUrl(), {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${visualizerConfig.huggingFaceToken}`,
                'Content-Type': 'application/octet-stream',
            },
            body: new Uint8Array(imageBuffer),
            signal: controller.signal,
        })

        if (!response.ok) {
            throw new Error(`HF inference failed: ${response.status}`)
        }

        return (await response.json()) as HfSegmentationResult[]
    } finally {
        clearTimeout(timeout)
    }
}

export async function createVehicleMask(imageBuffer: Buffer): Promise<Buffer> {
    let lastError: Error | null = null

    for (let attempt = 0; attempt <= visualizerConfig.huggingFaceRetries; attempt += 1) {
        try {
            const results = await callHf(imageBuffer)
            const candidate = results
                .filter(
                    (item) =>
                        item.mask && item.label && VEHICLE_LABELS.has(item.label.toLowerCase())
                )
                .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))[0]

            if (!candidate?.mask) {
                throw new Error('No vehicle labels found in segmentation output')
            }

            return Buffer.from(candidate.mask, 'base64')
        } catch (error) {
            lastError = error instanceof Error ? error : new Error('Unknown HF inference error')
            if (attempt === visualizerConfig.huggingFaceRetries) {
                break
            }

            await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)))
        }
    }

    throw lastError ?? new Error('Failed to generate vehicle mask')
}

export async function fallbackCenterMask(imageBuffer: Buffer): Promise<Buffer> {
    const metadata = await sharp(imageBuffer).metadata()
    if (!metadata.width || !metadata.height) {
        throw new Error('Invalid source image dimensions')
    }

    const svgMask = `
    <svg width="${metadata.width}" height="${metadata.height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="black"/>
      <ellipse cx="${metadata.width / 2}" cy="${metadata.height * 0.58}" rx="${metadata.width * 0.4}" ry="${metadata.height * 0.23}" fill="white"/>
    </svg>
  `

    return sharp(Buffer.from(svgMask)).png().toBuffer()
}

export class HuggingFacePreviewUnavailableError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'HuggingFacePreviewUnavailableError'
    }
}

export interface WrapPreviewGeneratorInput {
    boardBuffer: Buffer
    prompt: string
    negativePrompt?: string | null
}

export interface WrapPreviewGeneratorAdapter {
    generate(input: WrapPreviewGeneratorInput): Promise<Buffer>
}

class HuggingFaceWrapPreviewAdapter implements WrapPreviewGeneratorAdapter {
    private readonly client: InferenceClient

    constructor() {
        if (!visualizerConfig.huggingFaceToken) {
            throw new HuggingFacePreviewUnavailableError(
                'Hugging Face preview generation is not configured.'
            )
        }

        if (!visualizerConfig.previewModel) {
            throw new HuggingFacePreviewUnavailableError(
                'Hugging Face preview model is not configured.'
            )
        }

        this.client = new InferenceClient(visualizerConfig.huggingFaceToken)
    }

    async generate(input: WrapPreviewGeneratorInput): Promise<Buffer> {
        const prompt = input.negativePrompt
            ? `${input.prompt}\nNegative prompt: ${input.negativePrompt}`
            : input.prompt

        const generationPromise = this.client.imageToImage({
            model: visualizerConfig.previewModel,
            inputs: new Blob([new Uint8Array(input.boardBuffer)], { type: 'image/png' }),
            parameters: {
                prompt,
            },
        })

        const result = await Promise.race([
            generationPromise,
            new Promise<never>((_, reject) =>
                setTimeout(
                    () =>
                        reject(
                            new HuggingFacePreviewUnavailableError(
                                'Hugging Face preview generation timed out.'
                            )
                        ),
                    visualizerConfig.huggingFaceTimeoutMs
                )
            ),
        ]).catch((error: unknown) => {
            if (error instanceof HuggingFacePreviewUnavailableError) {
                throw error
            }

            const message = error instanceof Error ? error.message : 'Hugging Face preview failed.'
            throw new HuggingFacePreviewUnavailableError(message)
        })

        return Buffer.from(await result.arrayBuffer())
    }
}

export function createWrapPreviewGeneratorAdapter(): WrapPreviewGeneratorAdapter {
    return new HuggingFaceWrapPreviewAdapter()
}
