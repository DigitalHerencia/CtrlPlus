import { WorkspacePageIntro } from '@/components/shared/tenant-elements'

interface PlatformPageHeaderProps {
    label?: string
    title: string
    description: string
}

export function PlatformPageHeader({
    label = 'Platform',
    title,
    description,
}: PlatformPageHeaderProps) {
    return <WorkspacePageIntro label={label} title={title} description={description} />
}
