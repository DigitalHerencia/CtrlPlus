import { describe, expect, it } from 'vitest'

import { parseCatalogSearchParams } from '@/lib/utils/search-params'

describe('parseCatalogSearchParams', () => {
    it('normalizes empty input into the default browse state', () => {
        const result = parseCatalogSearchParams({})

        expect(result.filters).toMatchObject({
            page: 1,
            pageSize: 20,
            sortBy: 'createdAt',
        })
        expect(result.hasActiveFilters).toBe(false)
    })

    it('uses the first value for repeated params and preserves active filters', () => {
        const result = parseCatalogSearchParams({
            query: ['matte', 'ignored'],
            categoryId: ['cat-1', 'ignored'],
            sortBy: ['price', 'createdAt'],
            page: ['3', '4'],
        })

        expect(result.filters).toMatchObject({
            query: 'matte',
            categoryId: 'cat-1',
            sortBy: 'price',
            page: 3,
            pageSize: 20,
        })
        expect(result.hasActiveFilters).toBe(true)
    })

    it('falls back to safe defaults when pagination inputs are invalid', () => {
        const result = parseCatalogSearchParams({
            query: 'satin',
            page: 'not-a-number',
        })

        expect(result.filters).toMatchObject({
            query: 'satin',
            page: 1,
            pageSize: 20,
            sortBy: 'createdAt',
        })
        expect(result.hasActiveFilters).toBe(true)
    })
})
