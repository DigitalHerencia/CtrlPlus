import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface InvoicePaymentPanelProps {
    invoiceId: string
    canPayInvoice: boolean
    canAdjustInvoice: boolean
    canRefundInvoice: boolean
}

export function InvoicePaymentPanel({
    invoiceId,
    canPayInvoice,
    canAdjustInvoice,
    canRefundInvoice,
}: InvoicePaymentPanelProps) {
    return (
        <Card className="border-neutral-700 bg-neutral-950/80">
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
                                <Link href={`/billing/${invoiceId}/pay`}>Pay</Link>
                            </Button>
                        ) : null}
                        {canRefundInvoice ? (
                            <Button asChild size="sm" variant="outline">
                                <Link href={`/billing/manage/${invoiceId}/refund`}>Refund</Link>
                            </Button>
                        ) : null}
                        {canAdjustInvoice ? (
                            <Button asChild size="sm" variant="outline">
                                <Link href={`/billing/manage/${invoiceId}/adjust`}>Adjust</Link>
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
