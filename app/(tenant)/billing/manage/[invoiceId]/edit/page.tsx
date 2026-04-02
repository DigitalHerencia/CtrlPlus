import { EditInvoicePageFeature } from '@/features/billing/manage/edit-invoice-page-feature'
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

interface EditInvoicePageProps {
    params: Promise<{ invoiceId: string }>
}

export default async function EditInvoicePage({ params }: EditInvoicePageProps) {
    const { userId } = await getSession()
    if (!userId) {
        redirect('/sign-in')
    }

    const { invoiceId } = await params
    return <EditInvoicePageFeature invoiceId={invoiceId} />
}
