import { BillingInvoiceDetailPageFeature } from '@/features/billing/billing-invoice-detail-page-feature'
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

interface InvoiceDetailPageProps {
    params: Promise<{ id: string }>
    searchParams: Promise<{ payment?: string }>
}

export default async function InvoiceDetailPage({
    params,
    searchParams,
}: InvoiceDetailPageProps) {
    const { userId } = await getSession()

    if (!userId) {
        redirect('/sign-in')
    }

    const { id } = await params
    const { payment } = await searchParams
    const paymentState = payment === 'success' || payment === 'cancelled' ? payment : undefined

    return <BillingInvoiceDetailPageFeature invoiceId={id} paymentState={paymentState} />
}
