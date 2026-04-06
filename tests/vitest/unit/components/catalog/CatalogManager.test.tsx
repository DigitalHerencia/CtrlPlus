import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CatalogManagerClient } from '@/features/catalog/catalog-manager-client'
import type { CatalogManagerItemDTO } from '@/types/catalog.types'

const mocks = vi.hoisted(() => ({
    refresh: vi.fn(),
    push: vi.fn(),
    searchParams: new URLSearchParams(),
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
        push: mocks.push,
    }),
    usePathname: () => '/catalog/manage',
    useSearchParams: () => mocks.searchParams,
}))

vi.mock('@/components/ui/sheet', () => ({
    Sheet: ({ open, children }: { open?: boolean; children: React.ReactNode }) =>
        open ? <div data-testid="sheet-root">{children}</div> : null,
    SheetContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SheetHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SheetTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
    SheetDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
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
                thumbnailUrl: 'https://example.com/thumb.jpg',
                cardUrl: 'https://example.com/card.jpg',
                detailUrl: 'https://example.com/detail.jpg',
            },
        ],
        categories: mockCategories,
        createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
        updatedAt: new Date('2024-01-02T00:00:00Z').toISOString(),
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
            isVisualizerReady: true,
            missingRequiredAssetRoles: [],
            requiredAssetRoles: ['hero'],
            activeAssetKinds: ['hero'],
            hasDisplayAsset: true,
            activeHeroCount: 1,
            activeGalleryCount: 0,
            issues: [
                {
                    code: 'invalid_price',
                    message: 'Wrap price must be greater than zero before publish.',
                    blocking: true,
                },
            ],
        },
        imageCount: 1,
        activeImageCount: 1,
    },
]

describe('CatalogManagerClient', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders the inventory and selected wrap workspace', () => {
        render(<CatalogManagerClient wraps={mockWraps} categories={mockCategories} />)

        expect(screen.getByText('Visible Wraps')).toBeInTheDocument()
        expect(screen.getAllByText('Graphite Stealth').length).toBeGreaterThan(0)
        expect(screen.getByText('Inventory')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Create Wrap' })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'Back to Gallery' })).toBeInTheDocument()
    })

    it('creates wraps through the create form', async () => {
        render(<CatalogManagerClient wraps={mockWraps} categories={mockCategories} />)

        fireEvent.click(screen.getByRole('button', { name: 'Create Wrap' }))

        fireEvent.change(screen.getByPlaceholderText('Wrap name'), {
            target: { value: 'Midnight Chrome' },
        })
        fireEvent.change(screen.getByPlaceholderText('Price (USD)'), {
            target: { value: '1299.99' },
        })
        const sheetRoot = screen.getByTestId('sheet-root')
        fireEvent.click(within(sheetRoot).getByRole('button', { name: 'Create Wrap' }))

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
            <CatalogManagerClient
                wraps={[
                    {
                        ...mockWraps[0],
                        readiness: {
                            ...mockWraps[0].readiness,
                            canPublish: true,
                            isVisualizerReady: true,
                            missingRequiredAssetRoles: [],
                            issues: [],
                        },
                    },
                ]}
                categories={mockCategories}
            />
        )

        fireEvent.click(screen.getByRole('button', { name: /edit metadata for graphite stealth/i }))
        const publishButton = await screen.findByRole('button', { name: 'Publish Wrap' })
        fireEvent.click(publishButton)
        await waitFor(() => expect(mocks.publishWrap).toHaveBeenCalledWith('wrap1'))
    })
})
