import { CatalogPagination } from '@/components/catalog/CatalogPagination'
import { WrapFilter } from '@/components/catalog/WrapFilter'
import { WrapGrid } from '@/components/catalog/WrapGrid'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import { getWrapCategories } from '@/lib/catalog/fetchers/get-wrap-categories'
import { searchWraps } from '@/lib/catalog/fetchers/get-wraps'
import { parseCatalogSearchParams } from '@/lib/catalog/search-params'
import Link from 'next/link'
import { redirect } from 'next/navigation'

interface CatalogPageProps {
    searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
    const session = await getSession()
    const parsedSearch = parseCatalogSearchParams(await searchParams)
    if (!session.isAuthenticated || !session.userId) {
        redirect('/sign-in')
    }

    const canManageCatalog = hasCapability(session.authz, 'catalog.manage')
    const [data, categories] = await Promise.all([
        searchWraps(parsedSearch.filters, { includeHidden: canManageCatalog }),
        getWrapCategories(),
    ])

    const createPageHref = (page: number) => {
        const params = new URLSearchParams()
        const { filters } = parsedSearch

        if (filters.query) {
            params.set('query', filters.query)
        }
        if (filters.maxPrice !== undefined) {
            params.set('maxPrice', String(filters.maxPrice))
        }
        if (filters.categoryId) {
            params.set('categoryId', filters.categoryId)
        }
        if (filters.sortBy !== 'createdAt') {
            params.set('sortBy', filters.sortBy ?? 'createdAt')
        }
        if (filters.sortOrder !== 'desc') {
            params.set('sortOrder', filters.sortOrder ?? 'desc')
        }
        if (filters.pageSize !== 20) {
            params.set('pageSize', String(filters.pageSize))
        }
        params.set('page', String(page))
        const query = params.toString()
        return query ? `/catalog?${query}` : '/catalog'
    }

    // Modern header: title, search, sort, manage button
    // Accessible, branded, shadcn blocks
    return (
        <div className="space-y-6">
            <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
                <div className="flex items-center gap-2">
                    {/* Branded icon, title */}
                    <span
                        className="bg-primary mr-2 inline-block h-8 w-8 rounded-full"
                        aria-hidden="true"
                    />
                    <h1 className="text-2xl font-bold">Product Catalog</h1>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Search wraps..."
                        aria-label="Search wraps"
                        className="rounded border px-2 py-1"
                        defaultValue={parsedSearch.filters.query || ''}
                    />
                    <WrapFilter categories={categories} />
                    <select
                        aria-label="Sort wraps"
                        className="rounded border px-2 py-1"
                        defaultValue={parsedSearch.filters.sortBy || 'createdAt'}
                    >
                        <option value="createdAt">Newest</option>
                        <option value="price">Price</option>
                        <option value="name">Name</option>
                    </select>
                    {canManageCatalog && (
                        <Button asChild>
                            <Link href="/catalog/manage">Manage Catalog</Link>
                        </Button>
                    )}
                </div>
            </div>
            <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
                <CardContent className="pt-6">
                    {/* Filter panel */}
                    <WrapFilter categories={categories} />
                </CardContent>
            </Card>
            {parsedSearch.hasActiveFilters && (
                <p className="text-sm text-neutral-400">
                    Showing filtered results for your catalog search.
                </p>
            )}
            {/* Results count */}
            <div className="border border-neutral-700 bg-neutral-900 px-5 py-4 text-right">
                <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-400">Results</p>
                <p className="text-3xl font-black tabular-nums text-neutral-100">{data.total}</p>
            </div>
            {/* Grid or empty state */}
            {data.wraps.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center">
                    <span
                        className="bg-muted mb-4 inline-block h-16 w-16 rounded-full"
                        aria-hidden="true"
                    />
                    <span className="mb-2 text-lg font-semibold">No wraps found</span>
                    <span className="inline-block rounded border px-3 py-1 text-sm">
                        Try adjusting your filters or search
                    </span>
                </div>
            ) : (
                <WrapGrid wraps={data.wraps} canManageCatalog={canManageCatalog} />
            )}
            <CatalogPagination
                page={data.page}
                totalPages={data.totalPages}
                createPageHref={createPageHref}
            />
        </div>
    )
}
