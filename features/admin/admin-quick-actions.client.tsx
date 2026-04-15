'use client'


import Link from 'next/link'
import { AdminActionPanel } from '@/components/admin/admin-action-panel'


export function AdminQuickActionsClient() {
    return (
        <AdminActionPanel
            title="Admin quick actions"
            description="Jump to operational areas that need immediate attention."
        >
            <div className="grid gap-2 sm:grid-cols-2">
                <Link
                    href="/admin/moderation"
                    className="rounded border border-neutral-800 px-3 py-2 text-sm text-neutral-200 hover:border-blue-700"
                >
                    Review moderation queue
                </Link>
                <Link
                    href="/admin/audit"
                    className="rounded border border-neutral-800 px-3 py-2 text-sm text-neutral-200 hover:border-blue-700"
                >
                    Inspect audit history
                </Link>
                <Link
                    href="/admin/analytics"
                    className="rounded border border-neutral-800 px-3 py-2 text-sm text-neutral-200 hover:border-blue-700"
                >
                    Open analytics trends
                </Link>
                <Link
                    href="/platform"
                    className="rounded border border-neutral-800 px-3 py-2 text-sm text-neutral-200 hover:border-blue-700"
                >
                    Escalate to platform console
                </Link>
            </div>
        </AdminActionPanel>
    )
}
