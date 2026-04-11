/**
 * @introduction Components — TODO: short one-line summary of invoice-payment-panel.tsx
 *
 * @description TODO: longer description for invoice-payment-panel.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import Link from 'next/link'

import { isInvoicePayable } from '@/lib/constants/statuses'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type InvoiceDetailDTO } from '@/types/billing.types'

interface InvoicePaymentPanelProps {
    invoice: InvoiceDetailDTO
    canManageInvoice: boolean
}

/**
 * InvoicePaymentPanel — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function InvoicePaymentPanel({ invoice, canManageInvoice }: InvoicePaymentPanelProps) {
    const canPayInvoice = isInvoicePayable(invoice.status)
    const canAdjustInvoice =
        canManageInvoice && (invoice.status === 'draft' || invoice.status === 'issued')
    const canRefundInvoice = canManageInvoice && invoice.status === 'paid'

    return (
        <Card className="border-neutral-800 bg-neutral-900">
            <CardHeader>
                <CardTitle className="text-neutral-100">Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="text-sm text-neutral-400">
                    Complete payment or review refunds and adjustments for this invoice.
                </p>
                {canPayInvoice || canRefundInvoice || canAdjustInvoice ? (
                    <div className="flex flex-wrap gap-2">
                        {canPayInvoice ? (
                            <Button asChild size="sm">
                                <Link href={`/billing/${invoice.id}/pay`}>Pay</Link>
                            </Button>
                        ) : null}
                        {canRefundInvoice ? (
                            <Button asChild size="sm" variant="outline">
                                <Link href={`/billing/${invoice.id}/refund`}>Refund</Link>
                            </Button>
                        ) : null}
                        {canAdjustInvoice ? (
                            <Button asChild size="sm" variant="outline">
                                <Link href={`/billing/${invoice.id}/adjust`}>Adjust</Link>
                            </Button>
                        ) : null}
                    </div>
                ) : (
                    <p className="text-sm text-neutral-500">
                        No payment actions are available for the current invoice status.
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
