/**
 * @introduction Components — TODO: short one-line summary of admin-page-header.tsx
 *
 * @description TODO: longer description for admin-page-header.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { WorkspacePageIntro } from '@/components/shared/tenant-elements'

interface AdminPageHeaderProps {
    label: string
    title: string
    description: string
}

/**
 * AdminPageHeader — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function AdminPageHeader({ label, title, description }: AdminPageHeaderProps) {
    return <WorkspacePageIntro label={label} title={title} description={description} />
}
