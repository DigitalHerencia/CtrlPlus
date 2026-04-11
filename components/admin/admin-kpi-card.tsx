/**
 * @introduction Components — TODO: short one-line summary of admin-kpi-card.tsx
 *
 * @description TODO: longer description for admin-kpi-card.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AdminKpiCardProps {
    label: string
    value: string | number
    description?: string
}

/**
 * AdminKpiCard — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function AdminKpiCard({ label, value, description }: AdminKpiCardProps) {
    return (
        <Card className="border-neutral-800 bg-neutral-950/80 text-neutral-100">
            <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
                    {label}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-black tracking-tight">{value}</p>
                {description ? (
                    <p className="mt-1 text-xs text-neutral-400">{description}</p>
                ) : null}
            </CardContent>
        </Card>
    )
}
