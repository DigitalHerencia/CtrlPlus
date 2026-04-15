import { InvoicePayPageFeature } from '@/features/billing/invoice-pay-page-feature'

interface InvoicePayPageProps {
    params: Promise<{ invoiceId: string }>
}

export default async function InvoicePayPage({ params }: InvoicePayPageProps) {
    return <InvoicePayPageFeature params={params} />
}
