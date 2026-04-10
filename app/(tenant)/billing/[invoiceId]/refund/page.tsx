import { InvoiceRefundPageFeature } from '@/features/billing/invoice-refund-page-feature'
import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import { redirect } from 'next/navigation'

interface InvoiceRefundPageProps {
    params: Promise<{ invoiceId: string }>
}

export default async function InvoiceRefundPage({ params }: InvoiceRefundPageProps) {
    const session = await getSession()
    if (!session.userId) {
        redirect('/sign-in')
    }

    const { invoiceId } = await params

    if (!hasCapability(session.authz, 'billing.write.all')) {
        redirect(`/billing/${invoiceId}`)
    }

    return <InvoiceRefundPageFeature invoiceId={invoiceId} />
}
