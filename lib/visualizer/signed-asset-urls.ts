import { createHmac, timingSafeEqual } from 'crypto'

const DEFAULT_TTL_SECONDS = 10 * 60

function getSigningSecret(): string {
    const secret =
        process.env.VISUALIZER_ASSET_URL_SECRET?.trim() ||
        process.env.CLOUDINARY_API_SECRET?.trim() ||
        (process.env.NODE_ENV === 'test' ? 'test-visualizer-asset-secret' : '')

    if (!secret) {
        throw new Error(
            'Visualizer asset URL signing requires VISUALIZER_ASSET_URL_SECRET or CLOUDINARY_API_SECRET.'
        )
    }

    return secret
}

function buildSignature(pathname: string, expiresAt: number) {
    return createHmac('sha256', getSigningSecret())
        .update(`${pathname}:${expiresAt}`)
        .digest('hex')
}

function buildSignedPath(pathname: string, ttlSeconds = DEFAULT_TTL_SECONDS) {
    const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds
    const signature = buildSignature(pathname, expiresAt)

    return `${pathname}?expires=${expiresAt}&signature=${signature}`
}

export function buildSignedVisualizerUploadUrl(uploadId: string, ttlSeconds?: number) {
    return buildSignedPath(`/api/visualizer/uploads/${uploadId}/image`, ttlSeconds)
}

export function buildSignedVisualizerPreviewImageUrl(previewId: string, ttlSeconds?: number) {
    return buildSignedPath(`/api/visualizer/previews/${previewId}/image`, ttlSeconds)
}

export function verifySignedVisualizerAssetRequest(
    pathname: string,
    expires: string | null,
    signature: string | null
) {
    if (!expires || !signature) {
        return false
    }

    const expiresAt = Number(expires)
    if (!Number.isFinite(expiresAt) || expiresAt < Math.floor(Date.now() / 1000)) {
        return false
    }

    const expected = Buffer.from(buildSignature(pathname, expiresAt), 'hex')
    const received = Buffer.from(signature, 'hex')

    if (expected.length !== received.length) {
        return false
    }

    return timingSafeEqual(expected, received)
}
