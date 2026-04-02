import { InvoicePayPageFeature } from '@/features/billing/invoice-pay-page-feature'
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

interface InvoicePayPageProps {
    params: Promise<{ invoiceId: string }>
}

export default async function InvoicePayPage({ params }: InvoicePayPageProps) {
    const { userId } = await getSession()
    if (!userId) {
        redirect('/sign-in')
    }

    const { invoiceId } = await params
    return <InvoicePayPageFeature invoiceId={invoiceId} />
}
