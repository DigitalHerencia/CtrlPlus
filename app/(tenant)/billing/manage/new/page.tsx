import { NewInvoicePageFeature } from '@/features/billing/manage/new-invoice-page-feature'
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

export default async function NewInvoicePage() {
    const { userId } = await getSession()
    if (!userId) {
        redirect('/sign-in')
    }

    return <NewInvoicePageFeature />
}
