import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'

interface PlatformKpiCardProps {
    label: string
    value: number | string
    tone?: 'default' | 'secondary' | 'destructive' | 'outline'
}

export function PlatformKpiCard({ label, value, tone = 'secondary' }: PlatformKpiCardProps) {
    return (
        <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
            <CardHeader>
                <CardDescription className="text-neutral-400">{label}</CardDescription>
            </CardHeader>
            <CardContent>
                <Badge variant={tone}>{value}</Badge>
            </CardContent>
        </Card>
    )
}
