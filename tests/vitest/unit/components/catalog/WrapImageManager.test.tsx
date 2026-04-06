import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { WrapImageManager } from '@/components/catalog/WrapImageManager'

const mockImages = [
    {
        id: 'img1',
        url: 'https://example.com/img1.jpg',
        kind: 'hero' as const,
        isActive: true,
        version: 1,
        contentHash: 'hash1',
        displayOrder: 0,
    },
    {
        id: 'img2',
        url: 'https://example.com/img2.jpg',
        kind: 'gallery' as const,
        isActive: true,
        version: 1,
        contentHash: 'hash2',
        displayOrder: 1,
    },
]

describe('WrapImageManager', () => {
    it('renders readiness and current catalog assets', () => {
        render(
            <WrapImageManager
                wrapId="wrap1"
                images={mockImages}
                readiness={{
                    canPublish: false,
                    isVisualizerReady: true,
                    missingRequiredAssetRoles: [],
                    requiredAssetRoles: ['hero'],
                    activeAssetKinds: ['hero', 'gallery'],
                    hasDisplayAsset: true,
                    activeHeroCount: 1,
                    activeGalleryCount: 1,
                    issues: [
                        {
                            code: 'invalid_price',
                            message: 'Wrap price must be greater than zero before publish.',
                            blocking: true,
                        },
                    ],
                }}
                onAddImage={vi.fn()}
                onRemoveImage={vi.fn()}
                onReorderImages={vi.fn()}
                onUpdateImageMetadata={vi.fn()}
            />
        )

        expect(screen.getByText('Catalog Assets')).toBeInTheDocument()
        expect(screen.getByText(/missing required roles/i)).toBeInTheDocument()
        expect(screen.getAllByRole('img').length).toBeGreaterThan(0)
    })

    it('submits an uploaded asset through the provided callback', async () => {
        const onAddImage = vi.fn()

        render(
            <WrapImageManager
                wrapId="wrap1"
                images={mockImages}
                onAddImage={onAddImage}
                onRemoveImage={vi.fn()}
                onReorderImages={vi.fn()}
                onUpdateImageMetadata={vi.fn()}
            />
        )

        const file = new File(['asset'], 'gallery.png', { type: 'image/png' })
        fireEvent.change(screen.getByLabelText('Upload asset'), {
            target: { files: [file] },
        })
        fireEvent.click(screen.getByRole('button', { name: 'Add Asset' }))

        await waitFor(() => expect(onAddImage).toHaveBeenCalledWith(file, 'gallery', true))
    })

    it('supports reordering and removing assets', () => {
        const onRemoveImage = vi.fn()
        const onReorderImages = vi.fn()

        render(
            <WrapImageManager
                wrapId="wrap1"
                images={mockImages}
                onAddImage={vi.fn()}
                onRemoveImage={onRemoveImage}
                onReorderImages={onReorderImages}
                onUpdateImageMetadata={vi.fn()}
            />
        )

        fireEvent.click(screen.getAllByRole('button', { name: 'Move Down' })[0])
        expect(onReorderImages).toHaveBeenCalledWith(['img2', 'img1'])

        fireEvent.click(screen.getAllByRole('button', { name: 'Remove' })[0])
        expect(onRemoveImage).toHaveBeenCalledWith('img1')
    })
})
