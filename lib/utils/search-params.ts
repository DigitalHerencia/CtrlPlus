import { APP_ROUTES } from '@/lib/constants/app'
import { searchWrapsSchema } from '@/schemas/catalog.schemas'
import { visualizerSearchParamsSchema } from '@/schemas/visualizer.schemas'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/lib/constants/app'
import type { CatalogSearchParamsResult, SearchWrapsInput } from '@/types/catalog.types'
import type { SearchParamRecord } from '@/types/common.types'
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

export function createCatalogQueryString(filters: SearchWrapsInput): string {
    const params = new URLSearchParams()

    if (filters.query) {
        params.set('query', filters.query)
    }

    if (filters.maxPrice !== undefined) {
        params.set('maxPrice', String(filters.maxPrice))
    }

    if (filters.categoryId) {
        params.set('categoryId', filters.categoryId)
    }

    if (filters.sortBy && filters.sortBy !== 'createdAt') {
        params.set('sortBy', filters.sortBy)
    }

    if (filters.sortOrder && filters.sortOrder !== 'desc') {
        params.set('sortOrder', filters.sortOrder)
    }

    if (filters.pageSize !== undefined && filters.pageSize !== 20) {
        params.set('pageSize', String(filters.pageSize))
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
        maxPrice: toNumber(first(searchParams.maxPrice) ?? null),
        sortBy: first(searchParams.sortBy),
        sortOrder: first(searchParams.sortOrder),
        page: toNumber(first(searchParams.page) ?? null),
        pageSize: toNumber(first(searchParams.pageSize) ?? null),
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
        sortOrder: normalized.sortOrder ?? 'desc',
    }

    return {
        filters,
        hasActiveFilters: Boolean(
            filters.query ||
            filters.maxPrice !== undefined ||
            filters.categoryId ||
            filters.sortBy !== 'createdAt' ||
            filters.sortOrder !== 'desc' ||
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
