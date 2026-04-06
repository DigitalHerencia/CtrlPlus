import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { deletePersistedWrapImage, persistWrapImage } from '@/lib/uploads/storage'
import { MAX_WRAP_IMAGE_BYTES, validateWrapImageFile } from '@/lib/uploads/file-validation'

const originalEnv = {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    CLOUDINARY_WRAP_UPLOAD_PRESET: process.env.CLOUDINARY_WRAP_UPLOAD_PRESET,
    CLOUDINARY_WRAP_FOLDER: process.env.CLOUDINARY_WRAP_FOLDER,
}

function resetEnv(): void {
    const keys = Object.keys(originalEnv) as Array<keyof typeof originalEnv>
    for (const key of keys) {
        const value = originalEnv[key]
        if (value === undefined) {
            delete process.env[key]
        } else {
            process.env[key] = value
        }
    }
}

beforeEach(() => {
    resetEnv()
    vi.clearAllMocks()
    vi.stubGlobal('fetch', vi.fn())
})

afterEach(async () => {
    resetEnv()
    vi.unstubAllGlobals()
})

describe('validateWrapImageFile', () => {
    it('accepts supported image files and rejects invalid payloads', () => {
        expect(() =>
            validateWrapImageFile(new File(['ok'], 'wrap.png', { type: 'image/png' }))
        ).not.toThrow()

        expect(() =>
            validateWrapImageFile(new File(['ok'], 'wrap.gif', { type: 'image/gif' }))
        ).toThrow('Unsupported image format. Allowed: JPEG, PNG, WEBP.')

        expect(() =>
            validateWrapImageFile(
                new File([new Uint8Array(MAX_WRAP_IMAGE_BYTES + 1)], 'wrap.png', {
                    type: 'image/png',
                })
            )
        ).toThrow('Image exceeds size limit of 5MB.')
    })
})

describe('persistWrapImage', () => {
    it('uploads through Cloudinary when configured', async () => {
        process.env.CLOUDINARY_CLOUD_NAME = 'demo'
        process.env.CLOUDINARY_API_KEY = 'api-key'
        process.env.CLOUDINARY_API_SECRET = 'api-secret'
        process.env.CLOUDINARY_WRAP_UPLOAD_PRESET = 'wraps-preset'
        process.env.CLOUDINARY_WRAP_FOLDER = 'ctrlplus/wraps'

        const fetchMock = vi.mocked(fetch)
        fetchMock.mockResolvedValue(
            new Response(
                JSON.stringify({
                    secure_url:
                        'https://res.cloudinary.com/demo/image/upload/v1/ctrlplus/wraps/wrap-1',
                    asset_id: 'asset-1',
                    public_id: 'ctrlplus/wraps/wrap-1',
                    version: 1,
                    resource_type: 'image',
                    type: 'upload',
                    asset_folder: 'ctrlplus/wraps',
                    format: 'png',
                    bytes: 512,
                    width: 1200,
                    height: 800,
                    original_filename: 'wrap-1',
                }),
                {
                    status: 200,
                    headers: { 'content-type': 'application/json' },
                }
            )
        )

        const file = new File(['asset'], 'wrap.png', { type: 'image/png' })
        const result = await persistWrapImage({ wrapId: 'wrap-1', file })

        expect(result).toEqual({
            url: 'https://res.cloudinary.com/demo/image/upload/v1/ctrlplus/wraps/wrap-1',
            contentHash: expect.any(String),
            secureUrl: 'https://res.cloudinary.com/demo/image/upload/v1/ctrlplus/wraps/wrap-1',
            assetId: 'asset-1',
            publicId: 'ctrlplus/wraps/wrap-1',
            version: 1,
            resourceType: 'image',
            deliveryType: 'upload',
            assetFolder: 'ctrlplus/wraps',
            format: 'png',
            bytes: 512,
            width: 1200,
            height: 800,
            mimeType: 'image/png',
            originalFileName: 'wrap-1',
        })
        expect(result.contentHash).toHaveLength(64)
        expect(fetchMock).toHaveBeenCalledWith(
            'https://api.cloudinary.com/v1_1/demo/image/upload',
            expect.objectContaining({ method: 'POST' })
        )
    })

    it('rejects wrap uploads when Cloudinary credentials are incomplete', async () => {
        process.env.CLOUDINARY_CLOUD_NAME = 'demo'
        delete process.env.CLOUDINARY_API_KEY
        delete process.env.CLOUDINARY_API_SECRET
        process.env.CLOUDINARY_WRAP_UPLOAD_PRESET = 'wraps-preset'

        const file = new File(['asset'], 'wrap.png', { type: 'image/png' })
        await expect(persistWrapImage({ wrapId: 'wrap-credentials', file })).rejects.toThrow(
            /Cloudinary is required/i
        )
        expect(vi.mocked(fetch)).not.toHaveBeenCalled()
    })

    it('rejects wrap uploads when Cloudinary is unavailable', async () => {
        delete process.env.CLOUDINARY_CLOUD_NAME
        delete process.env.CLOUD_NAME
        delete process.env.CLOUDINARY_URL

        const file = new File(['asset'], 'wrap.png', { type: 'image/png' })
        await expect(persistWrapImage({ wrapId: 'wrap-2', file })).rejects.toThrow(
            /Cloudinary is required/i
        )
        expect(vi.mocked(fetch)).not.toHaveBeenCalled()
    })
})

describe('deletePersistedWrapImage', () => {
    it('destroys Cloudinary assets when credentials and a Cloudinary URL are present', async () => {
        process.env.CLOUDINARY_CLOUD_NAME = 'demo'
        process.env.CLOUDINARY_API_KEY = 'api-key'
        process.env.CLOUDINARY_API_SECRET = 'api-secret'

        const fetchMock = vi.mocked(fetch)
        fetchMock.mockResolvedValue(new Response('', { status: 200 }))

        await deletePersistedWrapImage({
            url: 'https://res.cloudinary.com/demo/image/upload/v1700000000/ctrlplus/wraps/wrap-3.png',
            cloudinaryPublicId: 'ctrlplus/wraps/wrap-3',
            cloudinaryResourceType: 'image',
            cloudinaryDeliveryType: 'upload',
        })

        expect(fetchMock).toHaveBeenCalledTimes(1)
        expect(fetchMock.mock.calls[0]?.[0]).toBe(
            'https://api.cloudinary.com/v1_1/demo/image/destroy'
        )
        const body = fetchMock.mock.calls[0]?.[1]?.body as URLSearchParams
        expect(body.toString()).toContain('public_id=ctrlplus%2Fwraps%2Fwrap-3')
        expect(body.toString()).toContain('resource_type=image')
        expect(body.toString()).toContain('type=upload')
    })
})
