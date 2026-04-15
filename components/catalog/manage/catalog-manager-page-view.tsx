import { CatalogPagination } from '@/components/catalog/catalog-pagination'
import { CatalogManagerHeader } from '@/components/catalog/manage/catalog-manager-header'
import type { CatalogManagerProps } from '@/types/catalog.types'

import { CatalogManagerClient } from '@/features/catalog/catalog-manager-client'

interface CatalogManagerPageViewProps extends CatalogManagerProps {
    page: number
    totalPages: number
    createPageHref: (page: number) => string
}

export function CatalogManagerPageView({
    wraps,
    categories,
    page,
    totalPages,
    createPageHref,
}: CatalogManagerPageViewProps) {
    return (
        <div className="space-y-6">
            <CatalogManagerHeader />
            <CatalogManagerClient wraps={wraps} categories={categories} />
            <CatalogPagination
                page={page}
                totalPages={totalPages}
                createPageHref={createPageHref}
            />
        </div>
    )
}
