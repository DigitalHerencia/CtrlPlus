import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import { type WebhookFailureDTO } from '@/types/platform'

interface PlatformFailureTableProps {
    failures: WebhookFailureDTO[]
}

export function PlatformFailureTable({ failures }: PlatformFailureTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Provider</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last attempt</TableHead>
                    <TableHead>Recovery</TableHead>
                    <TableHead>Notes</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {failures.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center text-neutral-500">
                            No recent webhook failures.
                        </TableCell>
                    </TableRow>
                ) : (
                    failures.map((failure) => (
                        <TableRow key={`${failure.source}:${failure.id}`}>
                            <TableCell>
                                <Badge variant="outline" className="uppercase">
                                    {failure.source}
                                </Badge>
                            </TableCell>
                            <TableCell className="font-medium text-neutral-100">
                                {failure.type}
                            </TableCell>
                            <TableCell>
                                <Badge variant="destructive">{failure.status}</Badge>
                            </TableCell>
                            <TableCell>{new Date(failure.processedAt).toLocaleString()}</TableCell>
                            <TableCell>
                                <Badge variant={failure.canReplay ? 'secondary' : 'outline'}>
                                    {failure.canReplay ? 'Replay available' : 'Diagnostics only'}
                                </Badge>
                            </TableCell>
                            <TableCell className="max-w-md text-sm text-neutral-400">
                                {failure.error ??
                                    failure.replayUnavailableReason ??
                                    'No additional notes.'}
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    )
}
