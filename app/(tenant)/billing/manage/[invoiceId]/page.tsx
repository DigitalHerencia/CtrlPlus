import { InvoiceDetailPageFeature } from '@/features/billing/invoice-detail-page-feature'
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

interface InvoiceManageDetailPageProps {
    params: Promise<{ invoiceId: string }>
}

export default async function InvoiceManageDetailPage({ params }: InvoiceManageDetailPageProps) {
    const { userId } = await getSession()
    if (!userId) {
        redirect('/sign-in')
    }

    const { invoiceId } = await params
    return <InvoiceDetailPageFeature invoiceId={invoiceId} />
}
