import { describe, expect, it, vi } from 'vitest'

const { uploadVehiclePhotoMock, generatePreviewMock } = vi.hoisted(() => ({
    uploadVehiclePhotoMock: vi.fn(),
    generatePreviewMock: vi.fn(),
}))

vi.mock('./upload-photo', () => ({
    uploadVehiclePhoto: uploadVehiclePhotoMock,
}))

vi.mock('./generate-preview', () => ({
    generatePreview: generatePreviewMock,
}))

import { uploadAndGeneratePreview } from './upload-and-preview'
import type { UploadPhotoInput, VisualizerPreviewDTO } from '../types'

describe('uploadAndGeneratePreview', () => {
    it('uploads a photo and hands the generated preview id to the preview step', async () => {
        const uploaded = {
            id: 'preview-1',
            wrapId: 'wrap-1',
            customerPhotoUrl: 'https://cloudinary.com/fake-url.jpg',
            processedImageUrl: null,
            status: 'pending',
            cacheKey: 'preview-cache-key',
            expiresAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        const preview = {
            ...uploaded,
            processedImageUrl: 'https://cloudinary.com/fake-preview.jpg',
            status: 'complete',
        } as VisualizerPreviewDTO

        uploadVehiclePhotoMock.mockResolvedValue(uploaded)
        generatePreviewMock.mockResolvedValue(preview)

        const input: UploadPhotoInput = {
            wrapId: 'wrap-1',
            customerPhotoUrl: 'data:image/png;base64,fakebase64',
        }

        const result = await uploadAndGeneratePreview(input)

        expect(uploadVehiclePhotoMock).toHaveBeenCalledWith(input)
        expect(generatePreviewMock).toHaveBeenCalledWith({ previewId: 'preview-1' })
        expect(result.processedImageUrl).toBe('https://cloudinary.com/fake-preview.jpg')
        expect(result.cacheKey).toBe('preview-cache-key')
        expect(result.status).toBe('complete')
    })

    it('surfaces upload failures from the first step', async () => {
        uploadVehiclePhotoMock.mockRejectedValue(new Error('Image dimensions are invalid'))

        const input: UploadPhotoInput = {
            wrapId: 'wrap-1',
            customerPhotoUrl: 'data:image/png;base64,invalidbase64',
        }

        await expect(uploadAndGeneratePreview(input)).rejects.toThrow(
            'Image dimensions are invalid'
        )
    })

    it('surfaces preview generation failures from the second step', async () => {
        uploadVehiclePhotoMock.mockResolvedValue({
            id: 'preview-1',
        })
        generatePreviewMock.mockRejectedValue(new Error('User does not own this preview'))

        const input: UploadPhotoInput = {
            wrapId: 'wrap-1',
            customerPhotoUrl: 'data:image/png;base64,ownershipfail',
        }

        await expect(uploadAndGeneratePreview(input)).rejects.toThrow(
            'User does not own this preview'
        )
    })
})
