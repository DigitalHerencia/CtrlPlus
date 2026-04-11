import { Card, CardContent } from '@/components/ui/card'

interface BookingsManagerStatsProps {
    total: number
    pending: number
    confirmed: number
    cancelled: number
}

export function BookingsManagerStats({
    total,
    pending,
    confirmed,
    cancelled,
}: BookingsManagerStatsProps) {
    const items = [
        { label: 'Total', value: total },
        { label: 'Pending', value: pending },
        { label: 'Confirmed', value: confirmed },
        { label: 'Cancelled', value: cancelled },
    ]

    return (
        <div className="grid gap-3 md:grid-cols-4">
            {items.map((item) => (
                <Card key={item.label} className="border-neutral-800 bg-neutral-950/80">
                    <CardContent className="space-y-1 p-4">
                        <p className="text-xs uppercase tracking-wide text-neutral-500">
                            {item.label}
                        </p>
                        <p className="text-2xl font-bold text-neutral-100">{item.value}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
