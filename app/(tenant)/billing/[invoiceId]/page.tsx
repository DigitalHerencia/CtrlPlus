import { InvoiceDetailPageFeature } from '@/features/billing/invoice-detail-page-feature'

interface InvoiceDetailPageProps {
    params: Promise<{ invoiceId: string }>
}

export default async function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
    return <InvoiceDetailPageFeature params={params} />
}
