import 'server-only'

import { BillingInvoiceDetail } from '@/components/billing/billing-invoice-detail'
import { createCheckoutSession } from '@/lib/billing/actions/create-checkout-session'
import { getInvoiceById } from '@/lib/billing/fetchers/get-invoice-by-id'
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
