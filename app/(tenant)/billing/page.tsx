import { InvoicesDashboardPageFeature } from '@/features/billing/invoices-dashboard-page-feature'
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

interface BillingPageProps {
    searchParams?: Promise<{ page?: string; pageSize?: string }>
}

export default async function BillingPage({ searchParams }: BillingPageProps) {
    const { userId } = await getSession()

    if (!userId) {
        redirect('/sign-in')
    }

    return <InvoicesDashboardPageFeature searchParams={searchParams} />
}
