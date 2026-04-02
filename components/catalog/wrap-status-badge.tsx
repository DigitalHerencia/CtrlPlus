import { Badge } from '@/components/ui/badge'

interface WrapStatusBadgeProps {
    isHidden: boolean
    canPublish: boolean
}

export function WrapStatusBadge({ isHidden, canPublish }: WrapStatusBadgeProps) {
    if (isHidden) {
        return (
            <Badge variant="outline" className="border-amber-500/50 bg-black/60 text-amber-200">
                Hidden
            </Badge>
        )
    }

    return (
        <Badge
            variant="secondary"
            className={
                canPublish ? 'bg-emerald-500/15 text-emerald-200' : 'bg-blue-500/15 text-blue-200'
            }
        >
            {canPublish ? 'Ready' : 'Visible'}
        </Badge>
    )
}
