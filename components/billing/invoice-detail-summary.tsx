import { Card, CardContent } from '@/components/ui/card'
import { type InvoiceDetailDTO } from '@/types/billing.types'

interface InvoiceDetailSummaryProps {
    invoice: InvoiceDetailDTO
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
})

export function InvoiceDetailSummary({ invoice }: InvoiceDetailSummaryProps) {
    return (
        <Card className="border-neutral-800 bg-neutral-900">
            <CardContent className="space-y-3 p-4 text-sm">
                <div className="flex justify-between">
                    <span className="text-neutral-400">Subtotal</span>
                    <span>
                        {currencyFormatter.format(
                            (invoice.subtotalAmount ?? invoice.totalAmount) / 100
                        )}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-neutral-400">Tax</span>
                    <span>{currencyFormatter.format((invoice.taxAmount ?? 0) / 100)}</span>
                </div>
                <div className="flex justify-between border-t border-neutral-800 pt-3 font-semibold text-neutral-100">
                    <span>Total</span>
                    <span>{currencyFormatter.format(invoice.totalAmount / 100)}</span>
                </div>
            </CardContent>
        </Card>
    )
}
