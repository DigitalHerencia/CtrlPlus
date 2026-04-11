/**
 * @introduction Components — TODO: short one-line summary of catalog-page-header.tsx
 *
 * @description TODO: longer description for catalog-page-header.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { WorkspacePageIntro } from '@/components/shared/tenant-elements'

interface CatalogPageHeaderProps {
    label: string
    title: string
    description: string
}

/**
 * CatalogPageHeader — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function CatalogPageHeader({ label, title, description }: CatalogPageHeaderProps) {
    return <WorkspacePageIntro label={label} title={title} description={description} />
}
