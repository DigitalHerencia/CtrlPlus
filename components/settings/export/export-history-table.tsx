
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { type ExportHistoryRowDTO } from '@/types/settings.types'

interface ExportHistoryTableProps {
    rows: ExportHistoryRowDTO[]
}


export function ExportHistoryTable({ rows }: ExportHistoryTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow className="border-neutral-800">
                    <TableHead>Request</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Requested by</TableHead>
                    <TableHead>Created</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {rows.map((row) => (
                    <TableRow key={row.id} className="border-neutral-800">
                        <TableCell className="font-mono text-xs">{row.id}</TableCell>
                        <TableCell>{row.format.toUpperCase()}</TableCell>
                        <TableCell>{row.requestedBy}</TableCell>
                        <TableCell>{row.createdAt}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
