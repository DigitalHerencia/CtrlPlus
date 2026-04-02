import { InvoiceAdjustPageFeature } from '@/features/billing/invoice-adjust-page-feature'
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

interface InvoiceAdjustPageProps {
    params: Promise<{ invoiceId: string }>
}

export default async function InvoiceAdjustPage({ params }: InvoiceAdjustPageProps) {
    const { userId } = await getSession()
    if (!userId) {
        redirect('/sign-in')
    }

    const { invoiceId } = await params
    return <InvoiceAdjustPageFeature invoiceId={invoiceId} />
}
