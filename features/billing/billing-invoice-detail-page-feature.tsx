import 'server-only'

import { BillingInvoiceDetail } from '@/components/billing/billing-invoice-detail'
import { createCheckoutSession } from '@/lib/actions/billing.actions'
import { getInvoiceById } from '@/lib/fetchers/billing.fetchers'
import { notFound } from 'next/navigation'

interface BillingInvoiceDetailPageFeatureProps {
    invoiceId: string
    paymentState?: 'success' | 'cancelled'
}

export async function BillingInvoiceDetailPageFeature({
    invoiceId,
    paymentState,
}: BillingInvoiceDetailPageFeatureProps) {
    const invoice = (await getInvoiceById(invoiceId)) ?? notFound()

    const canPay =
        invoice.status === 'sent' || invoice.status === 'draft' || invoice.status === 'failed'
    const checkoutActionLabel =
        invoice.status === 'failed' || paymentState === 'cancelled'
            ? 'Retry Payment'
            : 'Pay with Stripe'

    async function startCheckout() {
        'use server'

        return createCheckoutSession({ invoiceId: invoice.id })
    }

    return (
        <BillingInvoiceDetail
            invoice={invoice}
            canPay={canPay}
            paymentState={paymentState}
            checkoutActionLabel={checkoutActionLabel}
            onCheckout={canPay ? startCheckout : undefined}
        />
    )
}
