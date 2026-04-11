import { Card, CardContent } from '@/components/ui/card'

interface SchedulingDashboardStatsProps {
    total: number
    pending: number
    confirmed: number
    completed: number
}

export function SchedulingDashboardStats({
    total,
    pending,
    confirmed,
    completed,
}: SchedulingDashboardStatsProps) {
    const cards = [
        { label: 'Total', value: total },
        { label: 'Pending', value: pending },
        { label: 'Confirmed', value: confirmed },
        { label: 'Completed', value: completed },
    ]

    return (
        <div className="grid gap-3 md:grid-cols-4">
            {cards.map((card) => (
                <Card key={card.label} className="border-neutral-800 bg-neutral-950/80">
                    <CardContent className="space-y-1 p-4">
                        <p className="text-xs uppercase tracking-wide text-neutral-500">
                            {card.label}
                        </p>
                        <p className="text-2xl font-bold text-neutral-100">{card.value}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
