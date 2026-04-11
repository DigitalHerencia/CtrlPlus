/**
 * @introduction Components — TODO: short one-line summary of catalog-manager-header.tsx
 *
 * @description TODO: longer description for catalog-manager-header.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { CatalogPageHeader } from '@/components/catalog/catalog-page-header'

interface CatalogManagerHeaderProps {
    title?: string
    description?: string
}

/**
 * CatalogManagerHeader — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function CatalogManagerHeader({
    title = 'Catalog Manager',
    description = 'Curate premium wrap packages, keep visual assets consistent, and keep every preview customer-ready.',
}: CatalogManagerHeaderProps) {
    return (
        <CatalogPageHeader
            label="Catalog Manager"
            title={title}
            description={description}
        />
    )
}
