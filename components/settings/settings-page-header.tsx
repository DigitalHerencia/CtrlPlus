/**
 * @introduction Components — TODO: short one-line summary of settings-page-header.tsx
 *
 * @description TODO: longer description for settings-page-header.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { WorkspacePageIntro } from '@/components/shared/tenant-elements'

interface SettingsPageHeaderProps {
    label?: string
    title: string
    description: string
}

/**
 * SettingsPageHeader — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function SettingsPageHeader({
    label = 'Settings',
    title,
    description,
}: SettingsPageHeaderProps) {
    return <WorkspacePageIntro label={label} title={title} description={description} />
}
