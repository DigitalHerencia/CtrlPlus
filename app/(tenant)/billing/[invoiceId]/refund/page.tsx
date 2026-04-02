import { InvoiceRefundPageFeature } from '@/features/billing/invoice-refund-page-feature'
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

interface InvoiceRefundPageProps {
    params: Promise<{ invoiceId: string }>
}

export default async function InvoiceRefundPage({ params }: InvoiceRefundPageProps) {
    const { userId } = await getSession()
    if (!userId) {
        redirect('/sign-in')
    }

    const { invoiceId } = await params
    return <InvoiceRefundPageFeature invoiceId={invoiceId} />
}
