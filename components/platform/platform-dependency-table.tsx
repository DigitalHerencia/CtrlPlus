import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import type { DependencyHealthDTO } from '@/types/platform.types'

interface PlatformDependencyTableProps {
    dependencies: DependencyHealthDTO[]
}

export function PlatformDependencyTable({ dependencies }: PlatformDependencyTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Dependency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Response time</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {dependencies.map((dependency) => (
                    <TableRow key={dependency.name}>
                        <TableCell className="font-medium capitalize">{dependency.name}</TableCell>
                        <TableCell>{dependency.status}</TableCell>
                        <TableCell>{dependency.message ?? '—'}</TableCell>
                        <TableCell>{dependency.responseTimeMs ?? '—'} ms</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
