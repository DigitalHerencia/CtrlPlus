import { InvoiceDetailPageFeature } from './invoice-detail-page-feature'

interface BillingInvoiceDetailPageFeatureProps {
    invoiceId: string
}

export async function BillingInvoiceDetailPageFeature({
    invoiceId,
}: BillingInvoiceDetailPageFeatureProps) {
    return <InvoiceDetailPageFeature invoiceId={invoiceId} />
}
