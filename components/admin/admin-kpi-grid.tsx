/**
 * @introduction Components — TODO: short one-line summary of admin-kpi-grid.tsx
 *
 * @description TODO: longer description for admin-kpi-grid.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { AdminKpiCard } from '@/components/admin/admin-kpi-card'

interface AdminKpiGridProps {
    cards: Array<{
        id: string
        label: string
        value: string | number
        description?: string
    }>
}

/**
 * AdminKpiGrid — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function AdminKpiGrid({ cards }: AdminKpiGridProps) {
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Admin KPIs">
            {cards.map((card) => (
                <AdminKpiCard
                    key={card.id}
                    label={card.label}
                    value={card.value}
                    description={card.description}
                />
            ))}
        </section>
    )
}
