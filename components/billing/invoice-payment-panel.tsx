import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type InvoiceDetailDTO } from '@/types/billing.types'

interface InvoicePaymentPanelProps {
    invoice: InvoiceDetailDTO
}

export function InvoicePaymentPanel({ invoice }: InvoicePaymentPanelProps) {
    return (
        <Card className="border-neutral-800 bg-neutral-900">
            <CardHeader>
                <CardTitle className="text-neutral-100">Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="text-sm text-neutral-400">
                    Complete payment or review refunds and adjustments for this invoice.
                </p>
                <div className="flex flex-wrap gap-2">
                    <Button asChild size="sm">
                        <Link href={`/billing/${invoice.id}/pay`}>Pay</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                        <Link href={`/billing/${invoice.id}/refund`}>Refund</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                        <Link href={`/billing/${invoice.id}/adjust`}>Adjust</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
