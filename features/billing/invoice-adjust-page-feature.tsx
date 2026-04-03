import Link from 'next/link'

import { WorkspacePageContextCard, WorkspacePageIntro } from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'
import { getInvoice } from '@/lib/fetchers/billing.fetchers'
import { notFound } from 'next/navigation'

import { InvoiceAdjustFormClient } from './invoice-adjust-form.client'

interface InvoiceAdjustPageFeatureProps {
    invoiceId: string
}

export async function InvoiceAdjustPageFeature({ invoiceId }: InvoiceAdjustPageFeatureProps) {
    const invoice = (await getInvoice(invoiceId)) ?? notFound()

    return (
        <div className="space-y-6">
            <WorkspacePageIntro
                label="Billing"
                title={`Adjust Invoice ${invoice.id}`}
                description="Apply precise credits or corrections to keep project billing accurate and customer-trust intact."
            />
            <WorkspacePageContextCard title="Adjustment Navigation" description="Return to invoice detail">
                <Button asChild variant="outline">
                    <Link href={`/billing/${invoice.id}`}>Back to Invoice</Link>
                </Button>
            </WorkspacePageContextCard>
            <InvoiceAdjustFormClient invoiceId={invoice.id} />
        </div>
    )
}
