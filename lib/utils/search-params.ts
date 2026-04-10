import { APP_ROUTES } from '@/lib/constants/app'
import { invoiceListParamsSchema } from '@/schemas/billing.schemas'
import { searchWrapsSchema } from '@/schemas/catalog.schemas'
import { bookingListParamsSchema } from '@/schemas/scheduling.schemas'
import { visualizerSearchParamsSchema } from '@/schemas/visualizer.schemas'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/lib/constants/app'
import type { InvoiceListParams } from '@/types/billing.types'
import type { CatalogSearchParamsResult, SearchWrapsInput } from '@/types/catalog.types'
import type { SearchParamRecord } from '@/types/common.types'
import type { BookingListParams } from '@/types/scheduling.types'
import type { VisualizerSearchParamsResult } from '@/types/visualizer.types'

function toNumber(value: string | null): number | undefined {
    if (!value) {
        return undefined
    }

    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
}

function first(value: string | string[] | undefined): string | undefined {
    return Array.isArray(value) ? value[0] : value
}

/**
 * Normalises a Next.js search-param value that may be a string, an array of
 * strings, or undefined into a single nullable string.  Suitable for any page
 * whose `searchParams` object is typed as `Record<string, string | string[] | undefined>`.
 */
export function getSingleSearchParam(param: string | string[] | undefined): string | null {
    if (!param) return null
    return Array.isArray(param) ? (param[0] ?? null) : param
}

export function createCatalogQueryString(filters: SearchWrapsInput): string {
    const params = new URLSearchParams()

    if (filters.query) {
        params.set('query', filters.query)
    }

    if (filters.categoryId) {
        params.set('categoryId', filters.categoryId)
    }

    if (filters.sortBy && filters.sortBy !== 'createdAt') {
        params.set('sortBy', filters.sortBy)
    }

    if (filters.page !== undefined && filters.page !== 1) {
        params.set('page', String(filters.page))
    }

    return params.toString()
}

export function createCatalogPageHref(filters: SearchWrapsInput, page: number): string {
    const query = createCatalogQueryString({
        ...filters,
        page,
    })

    return query ? `${APP_ROUTES.catalog}?${query}` : APP_ROUTES.catalog
}

export function parseCatalogSearchParams(
    searchParams: SearchParamRecord
): CatalogSearchParamsResult {
    const candidate = {
        query: first(searchParams.query),
        sortBy: first(searchParams.sortBy),
        page: toNumber(first(searchParams.page) ?? null),
        categoryId: first(searchParams.categoryId),
    }

    const parsed = searchWrapsSchema.safeParse(candidate)
    const normalized = parsed.success
        ? parsed.data
        : searchWrapsSchema.parse({
              query: candidate.query,
              page: DEFAULT_PAGE,
              pageSize: DEFAULT_PAGE_SIZE,
          })

    const filters: SearchWrapsInput = {
        ...normalized,
        sortBy: normalized.sortBy ?? 'createdAt',
        pageSize: normalized.pageSize ?? DEFAULT_PAGE_SIZE,
    }

    return {
        filters,
        hasActiveFilters: Boolean(
            filters.query || filters.categoryId || filters.sortBy !== 'createdAt'
        ),
    }
}

export function parseBillingSearchParams(searchParams: SearchParamRecord): {
    filters: InvoiceListParams
    hasActiveFilters: boolean
} {
    const candidate = {
        query: first(searchParams.query),
        status: first(searchParams.status),
        page: first(searchParams.page),
        pageSize: first(searchParams.pageSize),
    }

    const parsed = invoiceListParamsSchema.safeParse(candidate)
    const filters = parsed.success
        ? parsed.data
        : invoiceListParamsSchema.parse({
              query: candidate.query,
              status: candidate.status,
              page: DEFAULT_PAGE,
              pageSize: DEFAULT_PAGE_SIZE,
          })

    return {
        filters,
        hasActiveFilters: Boolean(
            filters.query || filters.status || filters.pageSize !== DEFAULT_PAGE_SIZE
        ),
    }
}

export function parseSchedulingSearchParams(searchParams: SearchParamRecord): {
    filters: BookingListParams
    hasActiveFilters: boolean
} {
    const candidate = {
        status: first(searchParams.status),
        page: first(searchParams.page),
        pageSize: first(searchParams.pageSize),
        fromDate: first(searchParams.fromDate),
        toDate: first(searchParams.toDate),
    }

    const parsed = bookingListParamsSchema.safeParse(candidate)
    const normalized = parsed.success
        ? parsed.data
        : bookingListParamsSchema.parse({
              page: DEFAULT_PAGE,
              pageSize: DEFAULT_PAGE_SIZE,
          })

    const filters: BookingListParams = {
        ...normalized,
        fromDate: normalized.fromDate?.toISOString(),
        toDate: normalized.toDate?.toISOString(),
    }

    return {
        filters,
        hasActiveFilters: Boolean(
            filters.status ||
            filters.fromDate ||
            filters.toDate ||
            filters.pageSize !== DEFAULT_PAGE_SIZE
        ),
    }
}

export function parseVisualizerSearchParams(
    searchParams: SearchParamRecord
): VisualizerSearchParamsResult {
    const parsed = visualizerSearchParamsSchema.safeParse({
        wrapId: first(searchParams.wrapId),
    })

    return {
        requestedWrapId: parsed.success ? (parsed.data.wrapId ?? null) : null,
    }
}

export function createVisualizerQueryString(wrapId: string | null | undefined): string {
    const normalizedWrapId = wrapId?.trim() ?? ''
    if (!normalizedWrapId) {
        return ''
    }

    const params = new URLSearchParams()
    params.set('wrapId', normalizedWrapId)
    return params.toString()
}

export function createVisualizerHref(wrapId: string | null | undefined): string {
    const query = createVisualizerQueryString(wrapId)
    return query ? `${APP_ROUTES.visualizer}?${query}` : APP_ROUTES.visualizer
}
