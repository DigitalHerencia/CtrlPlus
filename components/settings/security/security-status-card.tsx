/**
 * @introduction Components — TODO: short one-line summary of security-status-card.tsx
 *
 * @description TODO: longer description for security-status-card.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SecurityStatusCardProps {
    title: string
    value: string
}

/**
 * SecurityStatusCard — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function SecurityStatusCard({ title, value }: SecurityStatusCardProps) {
    return (
        <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
            <CardHeader>
                <CardTitle className="text-sm text-neutral-400">{title}</CardTitle>
            </CardHeader>
            <CardContent className="font-medium">{value}</CardContent>
        </Card>
    )
}
