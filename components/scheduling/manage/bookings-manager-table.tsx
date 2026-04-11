/**
 * @introduction Components — TODO: short one-line summary of bookings-manager-table.tsx
 *
 * @description TODO: longer description for bookings-manager-table.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import type { BookingManagerRowDTO } from '@/types/scheduling.types'

import { BookingStatusBadge } from '../booking-status-badge'

interface BookingsManagerTableProps {
    rows: BookingManagerRowDTO[]
    rowActions?: (row: BookingManagerRowDTO) => import('react').ReactNode
}

/**
 * BookingsManagerTable — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function BookingsManagerTable({ rows, rowActions }: BookingsManagerTableProps) {
    if (rows.length === 0) {
        return (
            <p className="rounded border border-neutral-800 bg-neutral-950/70 p-6 text-sm text-neutral-400">
                No bookings found.
            </p>
        )
    }

    return (
        <div className="overflow-hidden border border-neutral-800 bg-neutral-950/80">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Scheduled</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>{row.id.slice(0, 10)}</TableCell>
                            <TableCell>{row.customerEmail}</TableCell>
                            <TableCell>{new Date(row.scheduledAt).toLocaleString()}</TableCell>
                            <TableCell>
                                <BookingStatusBadge status={row.status} />
                            </TableCell>
                            <TableCell className="text-right">{rowActions?.(row)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
