import { describe, expect, it } from 'vitest'

import { parseSchedulingSearchParams } from '@/lib/utils/search-params'

describe('parseSchedulingSearchParams', () => {
    it('normalizes empty input into the default scheduling table state', () => {
        const result = parseSchedulingSearchParams({})

        expect(result.filters).toMatchObject({
            page: 1,
            pageSize: 20,
        })
        expect(result.hasActiveFilters).toBe(false)
    })

    it('uses the first value for repeated params and preserves active filters', () => {
        const result = parseSchedulingSearchParams({
            status: ['confirmed', 'ignored'],
            page: ['2', '4'],
            pageSize: ['15', '20'],
        })

        expect(result.filters).toMatchObject({
            status: 'confirmed',
            page: 2,
            pageSize: 15,
        })
        expect(result.hasActiveFilters).toBe(true)
    })

    it('falls back to safe defaults when pagination inputs are invalid', () => {
        const result = parseSchedulingSearchParams({
            status: 'pending',
            page: 'bad',
            pageSize: 'bad',
        })

        expect(result.filters).toMatchObject({
            page: 1,
            pageSize: 20,
        })
        expect(result.hasActiveFilters).toBe(false)
    })
})
