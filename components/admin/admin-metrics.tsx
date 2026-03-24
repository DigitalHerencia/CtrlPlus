import { WorkspaceMetricCard } from '@/components/shared/tenant-elements'
import { ClipboardList, DollarSign, Grid3x3, Layers } from 'lucide-react'

type Stats = {
    wrapCount: number
    hiddenWrapCount: number
    upcomingBookingCount: number
    bookingCount: number
    totalRevenue: number
    openInvoiceCount: number
    customerCount: number
}

export default function AdminMetrics({
    stats,
    formattedRevenue,
}: {
    stats: Stats
    formattedRevenue: string
}) {
    if (!stats) return null
    return (
        <div className="grid gap-4 sm:grid-cols-4">
            <WorkspaceMetricCard
                label="Catalog Items"
                value={stats.wrapCount}
                description={`${stats.hiddenWrapCount} hidden from customers.`}
                icon={Grid3x3}
            />
            <WorkspaceMetricCard
                label="Upcoming Jobs"
                value={stats.upcomingBookingCount}
                description={`${stats.bookingCount} total appointments.`}
                icon={ClipboardList}
            />
            <WorkspaceMetricCard
                label="Collected Revenue"
                value={formattedRevenue}
                description={`${stats.openInvoiceCount} open invoices.`}
                icon={DollarSign}
            />
            <WorkspaceMetricCard
                label="Customer Count"
                value={stats.customerCount}
                description={'Unique customers with bookings.'}
                icon={Layers}
            />
        </div>
    )
}
