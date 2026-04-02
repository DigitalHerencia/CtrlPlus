import { PreviewStatus } from '@/lib/constants/statuses'

export function PreviewStatusBadge({ status }: { status: string }) {
    const colorClass =
        status === PreviewStatus.COMPLETE
            ? 'bg-emerald-600/20 text-emerald-300'
            : status === PreviewStatus.FAILED
              ? 'bg-red-600/20 text-red-300'
              : 'bg-blue-600/20 text-blue-300'

    return <span className={`rounded px-2 py-1 text-xs ${colorClass}`}>{status}</span>
}
