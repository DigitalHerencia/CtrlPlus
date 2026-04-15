import { InvoiceRefundPageFeature } from '@/features/billing/invoice-refund-page-feature'

interface InvoiceRefundPageProps {
    params: Promise<{ invoiceId: string }>
}

export default async function InvoiceRefundPage({ params }: InvoiceRefundPageProps) {
    return <InvoiceRefundPageFeature params={params} />
}
