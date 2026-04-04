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

export interface CloudinaryCredentials {
    cloudName: string
    apiKey: string
    apiSecret: string
}

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

export function extractCloudinaryPublicId(url: string): string | null {
    try {
        const parsed = new URL(url)
        if (!parsed.hostname.includes('res.cloudinary.com')) {
            return null
        }

        const segments = parsed.pathname.split('/').filter(Boolean)
        const uploadIndex = segments.indexOf('upload')
        if (uploadIndex < 0 || uploadIndex + 1 >= segments.length) {
            return null
        }

        const publicIdSegments = segments.slice(uploadIndex + 1)
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
