import Link from 'next/link'

import { WorkspacePageContextCard, WorkspacePageIntro } from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'
import { getInvoice } from '@/lib/fetchers/billing.fetchers'
import { notFound } from 'next/navigation'

import { InvoiceRefundFormClient } from './invoice-refund-form.client'

interface InvoiceRefundPageFeatureProps {
    invoiceId: string
}

export async function InvoiceRefundPageFeature({ invoiceId }: InvoiceRefundPageFeatureProps) {
    const invoice = (await getInvoice(invoiceId)) ?? notFound()

    return (
        <div className="space-y-6">
            <WorkspacePageIntro
                label="Billing"
                title={`Refund Invoice ${invoice.id}`}
                description="Issue a controlled refund while preserving full audit clarity and a premium customer experience."
            />
            <WorkspacePageContextCard title="Refund Navigation" description="Return to invoice detail">
                <Button asChild variant="outline">
                    <Link href={`/billing/${invoice.id}`}>Back to Invoice</Link>
                </Button>
            </WorkspacePageContextCard>
            <InvoiceRefundFormClient invoiceId={invoice.id} />
        </div>
    )
}
