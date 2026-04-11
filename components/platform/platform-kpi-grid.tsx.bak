import { PlatformKpiCard } from '@/components/platform/platform-kpi-card'

interface PlatformKpiItem {
    label: string
    value: number | string
    tone?: 'default' | 'secondary' | 'destructive' | 'outline'
}

interface PlatformKpiGridProps {
    items: PlatformKpiItem[]
}

export function PlatformKpiGrid({ items }: PlatformKpiGridProps) {
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {items.map((item) => (
                <PlatformKpiCard
                    key={item.label}
                    label={item.label}
                    value={item.value}
                    tone={item.tone}
                />
            ))}
        </section>
    )
}
