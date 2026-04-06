import { describe, expect, it } from 'vitest'

import {
    assertWrapCanBePublished,
    getMissingRequiredAssetRolesForPublish,
} from '@/lib/fetchers/catalog.mappers'

describe('getMissingRequiredAssetRolesForPublish', () => {
    it('returns the hero role when no publishable assets are present', () => {
        expect(getMissingRequiredAssetRolesForPublish([])).toEqual(['hero'])
    })

    it('requires active roles and ignores inactive entries', () => {
        expect(
            getMissingRequiredAssetRolesForPublish([
                { kind: 'hero', isActive: false },
                { kind: 'gallery', isActive: true },
            ])
        ).toEqual(['hero'])
    })

    it('returns empty when the active hero role exists', () => {
        expect(
            getMissingRequiredAssetRolesForPublish([
                { kind: 'hero', isActive: true },
                { kind: 'gallery', isActive: true },
            ])
        ).toEqual([])
    })
})

describe('assertWrapCanBePublished', () => {
    it('throws with missing role details', () => {
        expect(() =>
            assertWrapCanBePublished([
                { kind: 'gallery', isActive: true },
            ])
        ).toThrow('Cannot publish wrap. Missing active asset roles: hero')
    })

    it('does not throw when publish prerequisites are met', () => {
        expect(() =>
            assertWrapCanBePublished([
                { kind: 'hero', isActive: true },
                { kind: 'gallery', isActive: true },
            ])
        ).not.toThrow()
    })
})
