import { type SearchWrapsInput, searchWrapsSchema } from '@/lib/catalog/types'

interface CatalogSearchParamsResult {
    filters: SearchWrapsInput
    hasActiveFilters: boolean
}

function toNumber(value: string | null): number | undefined {
    if (!value) {
        return undefined
    }

    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
}

export function parseCatalogSearchParams(
    searchParams: Record<string, string | string[] | undefined>
): CatalogSearchParamsResult {
    const first = (value: string | string[] | undefined) =>
        Array.isArray(value) ? value[0] : value

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
              page: 1,
              pageSize: 20,
          })

    const filters: SearchWrapsInput = {
        ...normalized,
        sortBy: normalized.sortBy ?? 'createdAt',
        sortOrder: normalized.sortOrder ?? 'desc',
    }

    return {
        filters,
        hasActiveFilters: Boolean(filters.query || filters.maxPrice || filters.categoryId),
    }
}
