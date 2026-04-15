
import { WorkspacePageIntro } from '@/components/shared/tenant-elements'

interface AdminPageHeaderProps {
    label: string
    title: string
    description: string
}


export function AdminPageHeader({ label, title, description }: AdminPageHeaderProps) {
    return <WorkspacePageIntro label={label} title={title} description={description} />
}
