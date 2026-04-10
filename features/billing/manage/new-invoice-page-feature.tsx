import Link from 'next/link'

import { WorkspacePageContextCard, WorkspacePageIntro } from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'
import { InvoiceEditorFormClient } from './invoice-editor-form.client'

interface NewInvoicePageFeatureProps {
    initialBookingId?: string
}

export function NewInvoicePageFeature({ initialBookingId = '' }: NewInvoicePageFeatureProps) {
    return (
        <div className="space-y-6">
            <WorkspacePageIntro
                label="Billing"
                title="Issue Invoice"
                description="Create a polished invoice after work is completed and route the customer into Stripe Checkout only when payment is due."
            />
            <WorkspacePageContextCard title="Manager Navigation" description="Return to invoice operations">
                <Button asChild variant="outline">
                    <Link href="/billing/manage">Back to Manager</Link>
                </Button>
            </WorkspacePageContextCard>
            <InvoiceEditorFormClient initialBookingId={initialBookingId} submitLabel="Create Invoice" />
        </div>
    )
}
