import { UnifiedSettingsPageFeature } from '@/features/settings/unified-settings-page-feature'
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

/**
 * Account settings now redirected to unified settings page.
 * Maintained for backward compatibility.
 */
export default async function AccountSettingsPage() {
    const session = await getSession()

    if (!session.isAuthenticated || !session.userId) {
        redirect('/sign-in')
    }

    // Render unified settings page; tab selection is handled client-side
    return <UnifiedSettingsPageFeature />
}
