import { DataExportPageFeature } from '@/features/settings/data-export-page-feature'
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

export default async function DataSettingsPage() {
    const session = await getSession()

    if (!session.isAuthenticated || !session.userId) {
        redirect('/sign-in')
    }

    return <DataExportPageFeature tenantId="default-tenant" />
}
