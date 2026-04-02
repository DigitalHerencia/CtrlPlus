import { WorkspacePageIntro } from '@/components/shared/tenant-elements'
import type { ReactNode } from 'react'

interface CatalogPageHeaderProps {
    label: string
    title: string
    description: string
    actions?: ReactNode
    detail?: ReactNode
}

export function CatalogPageHeader({
    label,
    title,
    description,
    actions,
    detail,
}: CatalogPageHeaderProps) {
    return (
        <WorkspacePageIntro
            label={label}
            title={title}
            description={description}
            actions={actions}
            detail={detail}
        />
    )
}
