/**
 * @introduction Components — TODO: short one-line summary of scheduling-dashboard-header.tsx
 *
 * @description TODO: longer description for scheduling-dashboard-header.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { WorkspacePageIntro } from '@/components/shared/tenant-elements'

interface SchedulingDashboardHeaderProps {
    label?: string
    title?: string
    description?: string
}

/**
 * SchedulingDashboardHeader — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function SchedulingDashboardHeader({
    label = 'Scheduling',
    title = 'Scheduling',
    description = 'Turn vehicle-wrap interest into confirmed install appointments with clear availability and timeline visibility.',
}: SchedulingDashboardHeaderProps) {
    return <WorkspacePageIntro label={label} title={title} description={description} />
}
