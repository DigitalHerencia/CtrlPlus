import { describe, expect, it } from 'vitest'

import { parseBillingSearchParams } from '@/lib/utils/search-params'

describe('parseBillingSearchParams', () => {
    it('normalizes empty input into the default billing table state', () => {
        const result = parseBillingSearchParams({})

        expect(result.filters).toMatchObject({
            page: 1,
            pageSize: 20,
        })
        expect(result.hasActiveFilters).toBe(false)
    })

    it('uses the first value for repeated params and preserves active filters', () => {
        const result = parseBillingSearchParams({
            query: ['inv_123', 'ignored'],
            page: ['3', '4'],
            pageSize: ['10', '20'],
        })

        expect(result.filters).toMatchObject({
            query: 'inv_123',
            page: 3,
            pageSize: 10,
        })
        expect(result.hasActiveFilters).toBe(true)
    })

    it('falls back to safe defaults when pagination inputs are invalid', () => {
        const result = parseBillingSearchParams({
            query: 'inv_456',
            page: 'oops',
            pageSize: 'bad',
        })

        expect(result.filters).toMatchObject({
            query: 'inv_456',
            page: 1,
            pageSize: 20,
        })
        expect(result.hasActiveFilters).toBe(true)
    })
})
