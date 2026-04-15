import { InvoiceDetailPageFeature } from '@/features/billing/invoice-detail-page-feature'

interface InvoiceManageDetailPageProps {
    params: Promise<{ invoiceId: string }>
}

export default async function InvoiceManageDetailPage({ params }: InvoiceManageDetailPageProps) {
    return (
        <InvoiceDetailPageFeature
            params={params}
            backPath="/billing/manage"
            requireBillingReadAll
        />
    )
}
