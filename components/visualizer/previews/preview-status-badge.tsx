import { PreviewStatus } from '@/lib/constants/statuses'

export function PreviewStatusBadge({ status }: { status: string }) {
    const normalizedStatus = status.toLowerCase()

    const { colorClass, label } =
        normalizedStatus === PreviewStatus.COMPLETE
            ? {
                  colorClass: 'bg-emerald-600/20 text-emerald-300',
                  label: 'complete',
              }
            : normalizedStatus === PreviewStatus.FAILED
              ? {
                    colorClass: 'bg-red-600/20 text-red-300',
                    label: 'failed',
                }
              : normalizedStatus === PreviewStatus.PROCESSING
                  ? {
                        colorClass: 'bg-indigo-600/20 text-indigo-300',
                        label: 'processing',
                    }
                  : normalizedStatus === PreviewStatus.PENDING
                    ? {
                          colorClass: 'bg-blue-600/20 text-blue-300',
                          label: 'pending',
                      }
                    : {
                          colorClass: 'bg-orange-600/20 text-orange-300',
                          label: 'unknown',
                      }

    return <span className={`rounded px-2 py-1 text-xs ${colorClass}`}>{label}</span>
}
