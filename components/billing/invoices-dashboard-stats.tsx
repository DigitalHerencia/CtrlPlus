/**
 * @introduction Components — TODO: short one-line summary of invoices-dashboard-stats.tsx
 *
 * @description TODO: longer description for invoices-dashboard-stats.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface InvoicesDashboardStatsProps {
    totalInvoices: number
    outstandingAmount: number
    creditAmount: number
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
})

function StatCard({ label, value }: { label: string; value: string | number }) {
    return (
        <Card className="border-neutral-700 bg-neutral-950/80">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-neutral-400">{label}</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold text-neutral-100">{value}</CardContent>
        </Card>
    )
}

/**
 * InvoicesDashboardStats — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function InvoicesDashboardStats({
    totalInvoices,
    outstandingAmount,
    creditAmount,
}: InvoicesDashboardStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <StatCard label="Invoices" value={totalInvoices} />
            <StatCard
                label="Outstanding"
                value={currencyFormatter.format(outstandingAmount / 100)}
            />
            <StatCard label="Credits" value={currencyFormatter.format(creditAmount / 100)} />
        </div>
    )
}
