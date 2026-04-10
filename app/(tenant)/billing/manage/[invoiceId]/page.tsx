import { InvoiceDetailPageFeature } from '@/features/billing/invoice-detail-page-feature'
import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import { redirect } from 'next/navigation'

interface InvoiceManageDetailPageProps {
    params: Promise<{ invoiceId: string }>
}

export default async function InvoiceManageDetailPage({ params }: InvoiceManageDetailPageProps) {
    const session = await getSession()
    if (!session.userId) {
        redirect('/sign-in')
    }

    if (!hasCapability(session.authz, 'billing.read.all')) {
        redirect('/billing')
    }

    const { invoiceId } = await params
    return <InvoiceDetailPageFeature invoiceId={invoiceId} />
}
