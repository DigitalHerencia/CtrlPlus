/**
 * @introduction Components — TODO: short one-line summary of platform-kpi-card.tsx
 *
 * @description TODO: longer description for platform-kpi-card.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'

interface PlatformKpiCardProps {
    label: string
    value: number | string
    tone?: 'default' | 'secondary' | 'destructive' | 'outline'
}

/**
 * PlatformKpiCard — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
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
