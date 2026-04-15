import { InvoiceActionPageShell } from '@/components/billing/invoice-action-page-shell'
import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import { getBooking } from '@/lib/fetchers/scheduling.fetchers'
import type { SearchParamRecord } from '@/types/common.types'
import { redirect } from 'next/navigation'
import { InvoiceEditorFormClient } from './invoice-editor-form.client'

interface NewInvoicePageFeatureProps {
    searchParams: Promise<SearchParamRecord>
}

export async function NewInvoicePageFeature({ searchParams }: NewInvoicePageFeatureProps) {
    const session = await getSession()
    if (!session.userId) {
        redirect('/sign-in')
    }

    if (!hasCapability(session.authz, 'billing.write.all')) {
        redirect('/billing/manage')
    }

    const resolvedSearchParams = await searchParams
    const initialBookingId =
        typeof resolvedSearchParams.bookingId === 'string' ? resolvedSearchParams.bookingId : ''

    const booking = initialBookingId ? await getBooking(initialBookingId) : null
    const initialDescription = booking?.wrapName
        ? `${booking.wrapName} appointment services`
        : 'Service appointment'

    return (
        <InvoiceActionPageShell
            title="Compose Invoice"
            description="Create a manager-authored invoice from booking context, set the exact line-item pricing, and route the customer into Stripe Checkout only when payment is due."
            backHref="/billing/manage"
            backLabel="Back to Manager"
            navTitle="Manager Navigation"
            navDescription="Return to invoice operations"
        >
            <InvoiceEditorFormClient
                initialBookingId={initialBookingId}
                initialDescription={initialDescription}
                submitLabel="Create Invoice"
            />
        </InvoiceActionPageShell>
    )
}
