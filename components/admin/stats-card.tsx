import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatsCardProps {
    title: string
    value: string | number
    description?: string
}

export function StatsCard({ title, value, description }: StatsCardProps) {
    return (
        <Card className="border-neutral-700 bg-neutral-900 text-neutral-100">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium uppercase tracking-[0.16em] text-neutral-100">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-black tracking-tight text-neutral-100">{value}</div>
                {description && <p className="mt-1 text-xs text-neutral-100">{description}</p>}
            </CardContent>
        </Card>
    )
}
