
import { WorkspacePageIntro } from '@/components/shared/tenant-elements'

interface CatalogPageHeaderProps {
    label: string
    title: string
    description: string
}


export function CatalogPageHeader({ label, title, description }: CatalogPageHeaderProps) {
    return <WorkspacePageIntro label={label} title={title} description={description} />
}
