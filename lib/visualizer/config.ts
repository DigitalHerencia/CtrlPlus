function parseAllowedHosts(value: string | undefined): string[] {
    if (!value) return []

    return value
        .split(',')
        .map((host) => host.trim().toLowerCase())
        .filter((host) => host.length > 0)
}

function extractHostFromUrl(url: string | undefined): string | null {
    if (!url) return null

    try {
        return new URL(url).hostname.toLowerCase()
    } catch {
        return null
    }
}

export const visualizerConfig = {
    maxUploadSizeBytes: Number(process.env.VISUALIZER_MAX_UPLOAD_SIZE_BYTES ?? 10 * 1024 * 1024),
    supportedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'],
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
                process.env.BLOB_READ_WRITE_TOKEN ? 'blob.vercel-storage.com' : null,
            ].filter((value): value is string => Boolean(value))
        )
    ),
}

export function isAllowedRemotePhotoHost(hostname: string): boolean {
    const normalizedHostname = hostname.toLowerCase()

    return visualizerConfig.allowedRemotePhotoHosts.some((allowedHost) => {
        return normalizedHostname === allowedHost || normalizedHostname.endsWith(`.${allowedHost}`)
    })
}
