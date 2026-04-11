import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import type { BookingManagerRowDTO } from '@/types/scheduling.types'

import { BookingStatusBadge } from './booking-status-badge'

interface SchedulingDashboardTableProps {
    rows: BookingManagerRowDTO[]
    emptyLabel?: string
}

export function SchedulingDashboardTable({
    rows,
    emptyLabel = 'No bookings found for the current filters.',
}: SchedulingDashboardTableProps) {
    if (rows.length === 0) {
        return (
            <p className="rounded border border-neutral-800 bg-neutral-950/70 p-6 text-sm text-neutral-400">
                {emptyLabel}
            </p>
        )
    }

    return (
        <div className="overflow-hidden border border-neutral-800 bg-neutral-950/80">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Booking</TableHead>
                        <TableHead>Scheduled</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Duration</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell className="font-medium text-neutral-100">
                                {row.id.slice(0, 10)}
                            </TableCell>
                            <TableCell>{new Date(row.scheduledAt).toLocaleString()}</TableCell>
                            <TableCell>
                                <BookingStatusBadge status={row.status} />
                            </TableCell>
                            <TableCell className="text-right">{row.durationMinutes}m</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
