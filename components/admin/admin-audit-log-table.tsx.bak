import type { AuditLogRowDTO } from '@/types/admin.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AdminAuditLogTableProps {
    rows: AuditLogRowDTO[]
}

export function AdminAuditLogTable({ rows }: AdminAuditLogTableProps) {
    return (
        <Card className="border-neutral-800 bg-neutral-950/80 text-neutral-100">
            <CardHeader>
                <CardTitle>Audit history</CardTitle>
            </CardHeader>
            <CardContent>
                {rows.length === 0 ? (
                    <p className="text-sm text-neutral-400">No audit events found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="border-b border-neutral-800 text-left text-xs uppercase tracking-[0.16em] text-neutral-400">
                                    <th className="px-2 py-2">When</th>
                                    <th className="px-2 py-2">Actor</th>
                                    <th className="px-2 py-2">Event</th>
                                    <th className="px-2 py-2">Resource</th>
                                    <th className="px-2 py-2">Summary</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="border-b border-neutral-900 text-neutral-200"
                                    >
                                        <td className="px-2 py-2">
                                            {row.createdAt.toLocaleString()}
                                        </td>
                                        <td className="px-2 py-2">
                                            {row.actorName ?? row.actorId ?? 'Unknown'}
                                        </td>
                                        <td className="px-2 py-2">{row.eventType}</td>
                                        <td className="px-2 py-2">
                                            {[row.resourceType, row.resourceId]
                                                .filter(Boolean)
                                                .join(' · ') || '—'}
                                        </td>
                                        <td className="px-2 py-2 text-neutral-300">
                                            {row.summary}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
