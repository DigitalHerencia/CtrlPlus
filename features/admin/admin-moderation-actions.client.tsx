'use client'


import { resolveFlag } from '@/lib/actions/admin.actions'
import { useTransition } from 'react'

interface AdminModerationActionsClientProps {
    flagId: string
    status: 'open' | 'resolved'
}


export function AdminModerationActionsClient({
    flagId,
    status,
}: AdminModerationActionsClientProps) {
    const [isPending, startTransition] = useTransition()

    function resolve(action: 'approve' | 'dismiss' | 'hide' | 'delete') {
        startTransition(async () => {
            await resolveFlag({
                tenantId: 'single-store',
                flagId,
                action,
            })
        })
    }

    if (status === 'resolved') {
        return (
            <span className="text-xs uppercase tracking-[0.16em] text-emerald-300">Resolved</span>
        )
    }

    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                disabled={isPending}
                onClick={() => resolve('approve')}
                className="rounded border border-emerald-700 px-2 py-1 text-xs text-emerald-300 disabled:opacity-50"
            >
                Approve
            </button>
            <button
                type="button"
                disabled={isPending}
                onClick={() => resolve('dismiss')}
                className="rounded border border-neutral-700 px-2 py-1 text-xs text-neutral-200 disabled:opacity-50"
            >
                Dismiss
            </button>
            <button
                type="button"
                disabled={isPending}
                onClick={() => resolve('hide')}
                className="rounded border border-amber-700 px-2 py-1 text-xs text-amber-300 disabled:opacity-50"
            >
                Hide
            </button>
        </div>
    )
}
