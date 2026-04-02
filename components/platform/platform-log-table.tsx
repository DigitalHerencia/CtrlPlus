import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import type { PlatformIncidentDTO } from '@/types/platform.types'

interface PlatformLogTableProps {
    rows: PlatformIncidentDTO[]
}

export function PlatformLogTable({ rows }: PlatformLogTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Severity</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Created</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {rows.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center text-neutral-500">
                            No logs available.
                        </TableCell>
                    </TableRow>
                ) : (
                    rows.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>{row.severity}</TableCell>
                            <TableCell>{row.title}</TableCell>
                            <TableCell>{row.message}</TableCell>
                            <TableCell>{row.source ?? 'n/a'}</TableCell>
                            <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    )
}
