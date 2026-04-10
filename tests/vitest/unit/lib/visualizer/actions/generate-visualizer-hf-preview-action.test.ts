import { describe, expect, it, vi, beforeEach } from 'vitest'

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    requireCapability: vi.fn(),
    getVisualizerHfCatalogData: vi.fn(),
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
                wrapName: 'Arctic Gloss Satin Wrap',
            },
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
                wrapName: 'Arctic Gloss Satin Wrap',
            })
        ).rejects.toThrow('Unauthorized: not authenticated')
    })

    it('calls HF generation when selection is valid', async () => {
        const result = await generateVisualizerHfPreviewAction({
            make: 'Ford',
            model: 'F150',
            year: '2024',
            trim: 'XLT',
            wrapName: 'Arctic Gloss Satin Wrap',
        })

        expect(mocks.requireCapability).toHaveBeenCalledWith({}, 'visualizer.use')
        expect(mocks.generateVehicleWrapPreviewViaHfSpace).toHaveBeenCalledWith({
            make: 'Ford',
            model: 'F150',
            year: '2024',
            trim: 'XLT',
            wrapName: 'Arctic Gloss Satin Wrap',
        })
        expect(result).toEqual({
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
                wrapName: 'Arctic Gloss Satin Wrap',
            })
        ).rejects.toThrow('Invalid trim selection for year.')
    })

    it('maps HF Space catalog mismatch to actionable error', async () => {
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
                wrapName: 'Arctic Gloss Satin Wrap',
            })
        ).rejects.toThrow(
            'Visualizer preview service catalog is out of sync. Please redeploy the HF Space and retry.'
        )
    })
})
