import { CatalogPagination as CatalogPaginationBlock } from './catalog-pagination'

interface CatalogPaginationProps {
    page: number
    totalPages: number
    createPageHref: (page: number) => string
}

export function CatalogPagination({ page, totalPages, createPageHref }: CatalogPaginationProps) {
    return (
        <CatalogPaginationBlock
            page={page}
            totalPages={totalPages}
            createPageHref={createPageHref}
        />
    )
}
