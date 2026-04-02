import { Badge } from '@/components/ui/badge'

interface PlatformPageHeaderProps {
    title: string
    description: string
    status?: 'healthy' | 'degraded' | 'down'
}

export function PlatformPageHeader({ title, description, status }: PlatformPageHeaderProps) {
    return (
        <header className="space-y-3 border border-neutral-800 bg-neutral-950/80 p-5">
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-2xl font-black text-neutral-100">{title}</h1>
                {status ? (
                    <Badge
                        variant={
                            status === 'healthy'
                                ? 'secondary'
                                : status === 'degraded'
                                  ? 'outline'
                                  : 'destructive'
                        }
                        className="uppercase"
                    >
                        {status}
                    </Badge>
                ) : null}
            </div>
            <p className="text-sm text-neutral-300">{description}</p>
        </header>
    )
}
