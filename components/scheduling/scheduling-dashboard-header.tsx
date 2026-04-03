import { WorkspacePageIntro } from '@/components/shared/tenant-elements'

interface SchedulingDashboardHeaderProps {
    label?: string
    title?: string
    description?: string
}

export function SchedulingDashboardHeader({
    label = 'Scheduling',
    title = 'Scheduling',
    description = 'Turn vehicle-wrap interest into confirmed install appointments with clear availability and timeline visibility.',
}: SchedulingDashboardHeaderProps) {
    return <WorkspacePageIntro label={label} title={title} description={description} />
}
