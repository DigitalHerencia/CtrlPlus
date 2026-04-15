import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { InvoiceDetailDTO } from '@/types/billing.types'

interface InvoicePaymentHistoryPanelProps {
    paymentHistory: InvoiceDetailDTO['paymentHistory']
}

export function InvoicePaymentHistoryPanel({ paymentHistory }: InvoicePaymentHistoryPanelProps) {
    return (
        <Card className="border-neutral-700 bg-neutral-950/80">
            <CardHeader>
                <CardTitle className="text-neutral-100">Payment History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {paymentHistory.length === 0 ? (
                    <p className="text-sm text-neutral-400">No payment events yet.</p>
                ) : (
                    paymentHistory.map((event) => (
                        <div
                            key={event.id}
                            className="flex items-center justify-between rounded-md border border-neutral-700 p-3"
                        >
                            <span className="text-sm text-neutral-300">{event.type}</span>
                            <span className="text-sm text-neutral-100">{event.amount / 100}</span>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    )
}
