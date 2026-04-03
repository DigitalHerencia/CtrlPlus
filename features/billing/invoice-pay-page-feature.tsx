import Link from 'next/link'

import { WorkspacePageContextCard, WorkspacePageIntro } from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'
import { getInvoice } from '@/lib/fetchers/billing.fetchers'
import { notFound } from 'next/navigation'

import { InvoicePayFormClient } from './invoice-pay-form.client'

interface InvoicePayPageFeatureProps {
    invoiceId: string
}

export async function InvoicePayPageFeature({ invoiceId }: InvoicePayPageFeatureProps) {
    const invoice = (await getInvoice(invoiceId)) ?? notFound()

    return (
        <div className="space-y-6">
            <WorkspacePageIntro
                label="Billing"
                title={`Pay Invoice ${invoice.id}`}
                description="Complete this payment securely to keep your wrap project moving on schedule."
            />
            <WorkspacePageContextCard title="Payment Navigation" description="Return to invoice detail">
                <Button asChild variant="outline">
                    <Link href={`/billing/${invoice.id}`}>Back to Invoice</Link>
                </Button>
            </WorkspacePageContextCard>
            <InvoicePayFormClient invoiceId={invoice.id} />
        </div>
    )
}
