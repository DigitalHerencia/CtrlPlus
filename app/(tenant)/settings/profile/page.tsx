import { ProfileSettingsPageFeature } from '@/features/settings/profile-settings-page-feature'
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

export default async function ProfileSettingsPage() {
    const session = await getSession()

    if (!session.isAuthenticated || !session.userId) {
        redirect('/sign-in')
    }

    return <ProfileSettingsPageFeature />
}
