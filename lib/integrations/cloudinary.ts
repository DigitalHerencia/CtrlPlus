import { v2 as cloudinary } from 'cloudinary'
import { createHash } from 'crypto'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface CloudinaryCredentials {
    cloudName: string
    apiKey: string
    apiSecret: string
}

export function getCloudinaryCredentials(): CloudinaryCredentials | null {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim() ?? ''
    const apiKey = process.env.CLOUDINARY_API_KEY?.trim() ?? ''
    const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim() ?? ''

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
        publicIdSegments[publicIdSegments.length - 1] = lastSegment.replace(
            /\.[a-zA-Z0-9]+$/,
            ''
        )

        return publicIdSegments.join('/')
    } catch {
        return null
    }
}

export { cloudinary }
