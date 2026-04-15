import { InvoiceAdjustPageFeature } from '@/features/billing/invoice-adjust-page-feature'

interface InvoiceAdjustPageProps {
    params: Promise<{ invoiceId: string }>
}

export default async function InvoiceAdjustPage({ params }: InvoiceAdjustPageProps) {
    return <InvoiceAdjustPageFeature params={params} />
}
