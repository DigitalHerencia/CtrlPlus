import { applyCredit } from '@/lib/actions/billing.actions'
import { WorkspacePageContextCard, WorkspacePageIntro } from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'
import { getInvoice } from '@/lib/fetchers/billing.fetchers'
import { notFound } from 'next/navigation'
import Link from 'next/link'

import { InvoiceEditorFormClient } from './invoice-editor-form.client'

interface EditInvoicePageFeatureProps {
    invoiceId: string
}

export async function EditInvoicePageFeature({ invoiceId }: EditInvoicePageFeatureProps) {
    const invoice = (await getInvoice(invoiceId)) ?? notFound()

    async function onSubmitInvoice(input: { bookingId: string }) {
        'use server'
        return applyCredit({
            invoiceId,
            amount: 0,
            notes: `Edited from booking ${input.bookingId}`,
        })
    }

    return (
        <div className="space-y-6">
            <WorkspacePageIntro
                label="Billing"
                title={`Edit Invoice ${invoice.id}`}
                description="Refine billing details without losing financial traceability or customer confidence."
            />
            <WorkspacePageContextCard title="Manager Navigation" description="Return to invoice operations">
                <Button asChild variant="outline">
                    <Link href="/billing/manage">Back to Manager</Link>
                </Button>
            </WorkspacePageContextCard>
            <InvoiceEditorFormClient
                initialBookingId={invoice.bookingId}
                submitLabel="Save Changes"
                onSubmitInvoice={onSubmitInvoice}
            />
        </div>
    )
}
