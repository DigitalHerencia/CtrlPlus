/**
 * @introduction Components — TODO: short one-line summary of invoice-detail-summary.tsx
 *
 * @description TODO: longer description for invoice-detail-summary.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { Card, CardContent } from '@/components/ui/card'
import { type InvoiceDetailDTO } from '@/types/billing.types'

interface InvoiceDetailSummaryProps {
    invoice: InvoiceDetailDTO
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
})

/**
 * InvoiceDetailSummary — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function InvoiceDetailSummary({ invoice }: InvoiceDetailSummaryProps) {
    return (
        <Card className="border-neutral-700 bg-neutral-950/80">
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
                <div className="flex justify-between border-t border-neutral-700 pt-3 font-semibold text-neutral-100">
                    <span>Total</span>
                    <span>{currencyFormatter.format(invoice.totalAmount / 100)}</span>
                </div>
            </CardContent>
        </Card>
    )
}
