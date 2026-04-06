import { describe, expect, it } from 'vitest'

import {
    getCatalogAssetReadiness,
    resolveCatalogGalleryImages,
    resolveHeroAsset,
    resolvePrimaryDisplayAsset,
} from '@/lib/fetchers/catalog.mappers'
import { WrapImageKind } from '@/lib/constants/statuses'
import type { WrapImageDTO } from '@/types/catalog.types'

function createImage(overrides: Partial<WrapImageDTO>): WrapImageDTO {
    return {
        id: overrides.id ?? 'image-1',
        url: overrides.url ?? 'https://example.com/image.jpg',
        kind: overrides.kind ?? WrapImageKind.GALLERY,
        isActive: overrides.isActive ?? true,
        version: overrides.version ?? 1,
        contentHash: overrides.contentHash ?? 'hash',
        displayOrder: overrides.displayOrder ?? 0,
    }
}

describe('resolvePrimaryDisplayAsset', () => {
    it('prefers an active hero asset for the customer-facing cover image', () => {
        const asset = resolvePrimaryDisplayAsset([
            createImage({ id: 'gallery-1', kind: WrapImageKind.GALLERY, displayOrder: 1 }),
            createImage({ id: 'hero-1', kind: WrapImageKind.HERO, displayOrder: 0 }),
        ])

        expect(asset?.id).toBe('hero-1')
    })

    it('does not fall back to non-display assets when hero and gallery are missing', () => {
        const asset = resolvePrimaryDisplayAsset([
            createImage({
                id: 'texture-1',
                kind: WrapImageKind.VISUALIZER_TEXTURE,
            }),
        ])

        expect(asset).toBeNull()
    })

    it('does not use inactive hero or gallery assets as display candidates', () => {
        const asset = resolvePrimaryDisplayAsset([
            createImage({
                id: 'inactive-hero',
                kind: WrapImageKind.HERO,
                isActive: false,
            }),
            createImage({
                id: 'inactive-gallery',
                kind: WrapImageKind.GALLERY,
                isActive: false,
                displayOrder: 1,
            }),
        ])

        expect(asset).toBeNull()
    })
})

describe('role-specific resolvers', () => {
    it('returns only active hero assets', () => {
        const hero = resolveHeroAsset([
            createImage({ id: 'inactive-hero', kind: WrapImageKind.HERO, isActive: false }),
            createImage({ id: 'active-hero', kind: WrapImageKind.HERO, isActive: true }),
        ])

        expect(hero?.id).toBe('active-hero')
    })

    it('returns only active gallery assets', () => {
        const gallery = resolveCatalogGalleryImages([
            createImage({ id: 'inactive-gallery', kind: WrapImageKind.GALLERY, isActive: false }),
            createImage({ id: 'active-gallery', kind: WrapImageKind.GALLERY, isActive: true }),
        ])

        expect(gallery).toHaveLength(1)
        expect(gallery[0]?.id).toBe('active-gallery')
    })

})

describe('getCatalogAssetReadiness', () => {
    it('requires a hero asset before publish', () => {
        const readiness = getCatalogAssetReadiness([
            createImage({
                id: 'gallery-1',
                kind: WrapImageKind.GALLERY,
                displayOrder: 1,
            }),
        ])

        expect(readiness.canPublish).toBe(false)
        expect(readiness.hasDisplayAsset).toBe(true)
        expect(readiness.missingRequiredAssetRoles).toEqual([WrapImageKind.HERO])
    })

    it('marks wraps without hero or gallery assets as missing a display asset', () => {
        const readiness = getCatalogAssetReadiness([
            createImage({
                id: 'texture-1',
                kind: WrapImageKind.VISUALIZER_TEXTURE,
            }),
        ])

        expect(readiness.hasDisplayAsset).toBe(false)
        expect(readiness.canPublish).toBe(false)
    })
})
