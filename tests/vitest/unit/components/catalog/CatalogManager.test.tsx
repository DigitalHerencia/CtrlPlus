import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { CatalogManagerItemDTO } from '@/types/catalog'
import { CatalogManager } from '@/components/catalog/CatalogManager'

const mocks = vi.hoisted(() => ({
    refresh: vi.fn(),
    createWrap: vi.fn(),
    updateWrap: vi.fn(),
    publishWrap: vi.fn(),
    unpublishWrap: vi.fn(),
    deleteWrap: vi.fn(),
    createWrapCategory: vi.fn(),
    deleteWrapCategory: vi.fn(),
    setWrapCategoryMappings: vi.fn(),
    addWrapImage: vi.fn(),
    removeWrapImage: vi.fn(),
    reorderWrapImages: vi.fn(),
    updateWrapImageMetadata: vi.fn(),
}))

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        refresh: mocks.refresh,
    }),
}))

vi.mock('@/lib/actions/catalog.actions', () => ({
    createWrap: mocks.createWrap,
    updateWrap: mocks.updateWrap,
    publishWrap: mocks.publishWrap,
    unpublishWrap: mocks.unpublishWrap,
    deleteWrap: mocks.deleteWrap,
    createWrapCategory: mocks.createWrapCategory,
    deleteWrapCategory: mocks.deleteWrapCategory,
    setWrapCategoryMappings: mocks.setWrapCategoryMappings,
    addWrapImage: mocks.addWrapImage,
    removeWrapImage: mocks.removeWrapImage,
    reorderWrapImages: mocks.reorderWrapImages,
    updateWrapImageMetadata: mocks.updateWrapImageMetadata,
}))

const mockCategories = [{ id: 'cat1', name: 'Matte', slug: 'matte' }]

const mockWraps: CatalogManagerItemDTO[] = [
    {
        id: 'wrap1',
        name: 'Graphite Stealth',
        description: 'Premium satin finish for daily drivers.',
        price: 325000,
        isHidden: true,
        installationMinutes: 480,
        aiPromptTemplate: null,
        aiNegativePrompt: null,
        images: [
            {
                id: 'img1',
                url: 'https://example.com/hero.jpg',
                kind: 'hero' as const,
                isActive: true,
                version: 1,
                contentHash: 'hash-1',
                displayOrder: 0,
            },
        ],
        categories: mockCategories,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-02T00:00:00Z'),
        displayImage: {
            id: 'img1',
            url: 'https://example.com/hero.jpg',
            kind: 'hero' as const,
            isActive: true,
            version: 1,
            contentHash: 'hash-1',
            displayOrder: 0,
            thumbnailUrl: 'https://example.com/thumb.jpg',
            cardUrl: 'https://example.com/card.jpg',
            detailUrl: 'https://example.com/detail.jpg',
        },
        galleryImages: [],
        visualizerTextureImage: null,
        visualizerMaskHintImage: null,
        displayImages: [],
        heroImage: {
            id: 'img1',
            url: 'https://example.com/hero.jpg',
            kind: 'hero' as const,
            isActive: true,
            version: 1,
            contentHash: 'hash-1',
            displayOrder: 0,
            thumbnailUrl: 'https://example.com/thumb.jpg',
            cardUrl: 'https://example.com/card.jpg',
            detailUrl: 'https://example.com/detail.jpg',
        },
        readiness: {
            canPublish: false,
            isVisualizerReady: false,
            missingRequiredAssetRoles: ['visualizer_texture' as const],
            requiredAssetRoles: ['hero', 'visualizer_texture'],
            activeAssetKinds: ['hero'],
            hasDisplayAsset: true,
            activeHeroCount: 1,
            activeGalleryCount: 0,
            activeVisualizerTextureCount: 0,
            activeVisualizerMaskHintCount: 0,
            issues: [
                {
                    code: 'missing_visualizer_texture',
                    message: 'Add an active visualizer texture before publish.',
                    blocking: true,
                },
            ],
        },
        imageCount: 1,
        activeImageCount: 1,
    },
]

describe('CatalogManager', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders the inventory and selected wrap workspace', () => {
        render(<CatalogManager wraps={mockWraps} categories={mockCategories} />)

        expect(screen.getByText('Visible Wraps')).toBeInTheDocument()
        expect(screen.getAllByText('Graphite Stealth').length).toBeGreaterThan(0)
        expect(screen.getAllByText(/missing required roles/i).length).toBeGreaterThan(0)
        expect(screen.getByText('Category Mapping')).toBeInTheDocument()
    })

    it('creates wraps through the create form', async () => {
        render(<CatalogManager wraps={mockWraps} categories={mockCategories} />)

        fireEvent.change(screen.getByPlaceholderText('Wrap name'), {
            target: { value: 'Midnight Chrome' },
        })
        fireEvent.change(screen.getByPlaceholderText('Price (USD)'), {
            target: { value: '1299.99' },
        })
        fireEvent.click(screen.getByRole('button', { name: 'Create Wrap' }))

        await waitFor(() =>
            expect(mocks.createWrap).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: 'Midnight Chrome',
                    price: 129999,
                })
            )
        )
    })

    it('publishes the selected wrap through metadata actions', async () => {
        render(
            <CatalogManager
                wraps={[
                    {
                        ...mockWraps[0],
                        readiness: {
                            ...mockWraps[0].readiness,
                            canPublish: true,
                            isVisualizerReady: true,
                            missingRequiredAssetRoles: [],
                            activeVisualizerTextureCount: 1,
                            issues: [],
                        },
                    },
                ]}
                categories={mockCategories}
            />
        )

        fireEvent.click(screen.getByRole('button', { name: 'Publish Wrap' }))

        await waitFor(() => expect(mocks.publishWrap).toHaveBeenCalledWith('wrap1'))
    })
})
