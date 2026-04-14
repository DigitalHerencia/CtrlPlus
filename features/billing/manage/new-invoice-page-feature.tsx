/**
 * @introduction Features — TODO: short one-line summary of new-invoice-page-feature.tsx
 *
 * @description TODO: longer description for new-invoice-page-feature.tsx. Keep it short — one or two sentences.
 * Domain: features
 * Public: TODO (yes/no)
 */
import Link from 'next/link'

import { WorkspacePageContextCard, WorkspacePageIntro } from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'
import { getBooking } from '@/lib/fetchers/scheduling.fetchers'
import { InvoiceEditorFormClient } from './invoice-editor-form.client'

interface NewInvoicePageFeatureProps {
    initialBookingId?: string
}

/**
 * NewInvoicePageFeature — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export async function NewInvoicePageFeature({
    initialBookingId = '',
}: NewInvoicePageFeatureProps) {
    const booking = initialBookingId ? await getBooking(initialBookingId) : null
    const initialDescription = booking?.wrapName
        ? `${booking.wrapName} appointment services`
        : 'Service appointment'

    return (
        <div className="space-y-6">
            <WorkspacePageIntro
                label="Billing"
                title="Compose Invoice"
                description="Create a manager-authored invoice from booking context, set the exact line-item pricing, and route the customer into Stripe Checkout only when payment is due."
            />
            <WorkspacePageContextCard title="Manager Navigation" description="Return to invoice operations">
                <Button asChild variant="outline">
                    <Link href="/billing/manage">Back to Manager</Link>
                </Button>
            </WorkspacePageContextCard>
            <InvoiceEditorFormClient
                initialBookingId={initialBookingId}
                initialDescription={initialDescription}
                submitLabel="Create Invoice"
            />
        </div>
    )
}
