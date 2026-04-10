import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import { redirect } from 'next/navigation'

interface EditInvoicePageProps {
    params: Promise<{ invoiceId: string }>
}

export default async function EditInvoicePage({ params }: EditInvoicePageProps) {
    const session = await getSession()
    if (!session.userId) {
        redirect('/sign-in')
    }

    const { invoiceId } = await params

    if (!hasCapability(session.authz, 'billing.write.all')) {
        redirect(`/billing/${invoiceId}`)
    }

    redirect(`/billing/manage/${invoiceId}`)
}
