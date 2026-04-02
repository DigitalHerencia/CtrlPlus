import { AccountSettingsPageFeature } from '@/features/settings/account-settings-page-feature'
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

export default async function AccountSettingsPage() {
    const session = await getSession()

    if (!session.isAuthenticated || !session.userId) {
        redirect('/sign-in')
    }

    return <AccountSettingsPageFeature tenantId="default-tenant" />
}
