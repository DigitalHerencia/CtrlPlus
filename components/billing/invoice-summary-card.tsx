import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface InvoiceSummaryCardProps {
    title: string
    value: string
    description?: string
}

export function InvoiceSummaryCard({ title, value, description }: InvoiceSummaryCardProps) {
    return (
        <Card className="border-neutral-800 bg-neutral-900">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-neutral-400">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-xl font-semibold text-neutral-100">{value}</p>
                {description ? (
                    <p className="mt-1 text-xs text-neutral-500">{description}</p>
                ) : null}
            </CardContent>
        </Card>
    )
}
