/**
 * @introduction Components — TODO: short one-line summary of platform-page-header.tsx
 *
 * @description TODO: longer description for platform-page-header.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { WorkspacePageIntro } from '@/components/shared/tenant-elements'

interface PlatformPageHeaderProps {
    label?: string
    title: string
    description: string
}

/**
 * PlatformPageHeader — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function PlatformPageHeader({
    label = 'Platform',
    title,
    description,
}: PlatformPageHeaderProps) {
    return <WorkspacePageIntro label={label} title={title} description={description} />
}
