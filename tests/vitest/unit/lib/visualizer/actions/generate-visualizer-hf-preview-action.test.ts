import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    requireCapability: vi.fn(),
    getVisualizerHfCatalogData: vi.fn(),
    getVisualizerSelectableWrapById: vi.fn(),
    updateBookingDraftFromVisualizer: vi.fn(),
    generateVehicleWrapPreviewViaHfSpace: vi.fn(),
}))

vi.mock('@/lib/auth/session', () => ({
    getSession: mocks.getSession,
}))

vi.mock('@/lib/authz/policy', () => ({
    requireCapability: mocks.requireCapability,
}))

vi.mock('@/lib/fetchers/visualizer.fetchers', () => ({
    getVisualizerHfCatalogData: mocks.getVisualizerHfCatalogData,
}))

vi.mock('@/lib/fetchers/catalog.fetchers', () => ({
    getVisualizerSelectableWrapById: mocks.getVisualizerSelectableWrapById,
}))

vi.mock('@/lib/actions/scheduling.actions', () => ({
    updateBookingDraftFromVisualizer: mocks.updateBookingDraftFromVisualizer,
}))

vi.mock('@/lib/visualizer/huggingface/space-client', () => ({
    generateVehicleWrapPreviewViaHfSpace: mocks.generateVehicleWrapPreviewViaHfSpace,
}))

import { generateVisualizerHfPreviewAction } from '@/lib/actions/visualizer.actions'

describe('generateVisualizerHfPreviewAction', () => {
    beforeEach(() => {
        vi.clearAllMocks()

        mocks.getSession.mockResolvedValue({
            isAuthenticated: true,
            userId: 'user-1',
            isOwner: false,
            isPlatformAdmin: false,
            authz: {},
        })

        mocks.getVisualizerHfCatalogData.mockResolvedValue({
            makes: ['Ford'],
            vehicleIndex: {
                Ford: {
                    F150: {
                        '2024': ['XLT'],
                    },
                },
            },
            wraps: [
                {
                    id: 'wrap-1',
                    name: 'Arctic Gloss Satin Wrap',
                    category: 'Stealth',
                    description: 'desc',
                    stylePrompt: 'style',
                    promptTemplate: 'template',
                },
            ],
            initialSelection: {
                make: 'Ford',
                model: 'F150',
                year: '2024',
                trim: 'XLT',
                wrapId: 'wrap-1',
            },
            selectedWrapId: 'wrap-1',
        })

        mocks.getVisualizerSelectableWrapById.mockResolvedValue({
            id: 'wrap-1',
            name: 'Arctic Gloss Satin Wrap',
            aiPromptTemplate:
                'Studio automotive concept render of a {vehicle}, exact {year} {make} {model} {trim}, three-quarter front angle. A vehicle fully wrapped in a pristine high-gloss white finish, ultra-smooth reflective surface with a factory paint appearance, seamless panel coverage with no visible edges or breaks, subtle soft reflections across body contours, clean minimal aesthetic with no graphics or decals, pure white color with slight depth and clearcoat-like shine, studio lighting emphasizing smooth curvature and reflections, premium automotive finish, highly polished, realistic material response, no texture noise, showroom-quality appearance. Preserve the real production body shape, wheelbase, glasshouse, and OEM proportions. Neutral studio background, premium lighting, photorealistic vehicle wrap visualization.',
            aiNegativePrompt:
                'A vehicle fully wrapped in a pristine high-gloss white finish, ultra-smooth reflective surface with a factory paint appearance, seamless panel coverage with no visible edges or breaks, subtle soft reflections across body contours, clean minimal aesthetic with no graphics or decals, pure white color with slight depth and clearcoat-like shine, studio lighting emphasizing smooth curvature and reflections, premium automotive finish, highly polished, realistic material response, no texture noise, showroom-quality appearance',
        })

        mocks.generateVehicleWrapPreviewViaHfSpace.mockResolvedValue({
            imageUrl: 'https://image.test/preview.png',
            promptUsed: 'prompt used',
        })
    })

    it('rejects unauthenticated users', async () => {
        mocks.getSession.mockResolvedValueOnce({
            isAuthenticated: false,
            userId: null,
            authz: {},
        })

        await expect(
            generateVisualizerHfPreviewAction({
                make: 'Ford',
                model: 'F150',
                year: '2024',
                trim: 'XLT',
                wrapId: 'wrap-1',
            })
        ).rejects.toThrow('Unauthorized: not authenticated')
    })

    it('calls HF generation when selection is valid', async () => {
        const result = await generateVisualizerHfPreviewAction({
            make: 'Ford',
            model: 'F150',
            year: '2024',
            trim: 'XLT',
            wrapId: 'wrap-1',
        })

        expect(mocks.requireCapability).toHaveBeenCalledWith({}, 'visualizer.use')
        expect(mocks.generateVehicleWrapPreviewViaHfSpace).toHaveBeenCalledWith({
            make: 'Ford',
            model: 'F150',
            year: '2024',
            trim: 'XLT',
            wrapName: 'Arctic Gloss Satin Wrap',
        })
        expect(mocks.updateBookingDraftFromVisualizer).toHaveBeenCalledWith({
            wrapId: 'wrap-1',
            vehicleMake: 'Ford',
            vehicleModel: 'F150',
            vehicleYear: '2024',
            vehicleTrim: 'XLT',
            previewImageUrl: 'https://image.test/preview.png',
            previewPromptUsed: 'prompt used',
            previewStatus: 'complete',
        })
        expect(result).toEqual({
            wrapId: 'wrap-1',
            wrapName: 'Arctic Gloss Satin Wrap',
            imageUrl: 'https://image.test/preview.png',
            promptUsed: 'prompt used',
        })
    })

    it('rejects invalid trim combinations', async () => {
        await expect(
            generateVisualizerHfPreviewAction({
                make: 'Ford',
                model: 'F150',
                year: '2024',
                trim: 'Lariat',
                wrapId: 'wrap-1',
            })
        ).rejects.toThrow('Invalid trim selection for year.')
    })

    it('maps HF Space catalog mismatch to actionable error and marks the draft failed', async () => {
        mocks.generateVehicleWrapPreviewViaHfSpace.mockRejectedValueOnce(
            new Error(
                "space_catalog_mismatch:Value: Accord is not in the list of choices: ['Hummer']"
            )
        )

        await expect(
            generateVisualizerHfPreviewAction({
                make: 'Ford',
                model: 'F150',
                year: '2024',
                trim: 'XLT',
                wrapId: 'wrap-1',
            })
        ).rejects.toThrow(
            'Visualizer preview service catalog is out of sync. Please redeploy the HF Space and retry.'
        )

        expect(mocks.updateBookingDraftFromVisualizer).toHaveBeenCalledWith({
            wrapId: 'wrap-1',
            vehicleMake: 'Ford',
            vehicleModel: 'F150',
            vehicleYear: '2024',
            vehicleTrim: 'XLT',
            previewStatus: 'failed',
        })
    })

    it('maps queue timeout failures to retry guidance and marks the draft failed', async () => {
        mocks.generateVehicleWrapPreviewViaHfSpace.mockRejectedValueOnce(
            new Error('space_queue_timeout:Hugging Face request timed out.')
        )

        await expect(
            generateVisualizerHfPreviewAction({
                make: 'Ford',
                model: 'F150',
                year: '2024',
                trim: 'XLT',
                wrapId: 'wrap-1',
            })
        ).rejects.toThrow('Preview generation timed out. Please retry in a moment.')

        expect(mocks.updateBookingDraftFromVisualizer).toHaveBeenCalledWith({
            wrapId: 'wrap-1',
            vehicleMake: 'Ford',
            vehicleModel: 'F150',
            vehicleYear: '2024',
            vehicleTrim: 'XLT',
            previewStatus: 'failed',
        })
    })

    it('maps provider availability failures to temporary outage guidance', async () => {
        mocks.generateVehicleWrapPreviewViaHfSpace.mockRejectedValueOnce(
            new Error('provider_unavailable:Space backend overloaded')
        )

        await expect(
            generateVisualizerHfPreviewAction({
                make: 'Ford',
                model: 'F150',
                year: '2024',
                trim: 'XLT',
                wrapId: 'wrap-1',
            })
        ).rejects.toThrow('Preview service is temporarily unavailable. Please try again shortly.')
    })

    it('uses the legacy HF Space catalog label when live wrap metadata still maps to it', async () => {
        mocks.getVisualizerSelectableWrapById.mockResolvedValueOnce({
            id: 'wrap-1',
            name: 'Arctic Gloss Wrap',
            aiPromptTemplate: null,
            aiNegativePrompt: null,
        })

        await generateVisualizerHfPreviewAction({
            make: 'Ford',
            model: 'F150',
            year: '2024',
            trim: 'XLT',
            wrapId: 'wrap-1',
        })

        expect(mocks.generateVehicleWrapPreviewViaHfSpace).toHaveBeenCalledWith({
            make: 'Ford',
            model: 'F150',
            year: '2024',
            trim: 'XLT',
            wrapName: 'Arctic Gloss Satin Wrap',
        })
    })
})
