import { BillingPageFeature } from '@/features/billing/billing-page-feature'
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

export default async function BillingPage() {
    const { userId } = await getSession()

    if (!userId) {
        redirect('/sign-in')
    }

    return <BillingPageFeature />
}
