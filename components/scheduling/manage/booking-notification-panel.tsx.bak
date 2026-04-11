import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface BookingNotificationPanelProps {
    enabled: boolean
    onToggle: (value: boolean) => void
}

export function BookingNotificationPanel({ enabled, onToggle }: BookingNotificationPanelProps) {
    return (
        <Card className="border-neutral-800 bg-neutral-950/80">
            <CardHeader>
                <CardTitle>Notification Controls</CardTitle>
            </CardHeader>
            <CardContent>
                <button
                    type="button"
                    onClick={() => onToggle(!enabled)}
                    className="rounded border border-neutral-700 px-3 py-2 text-sm text-neutral-100"
                >
                    {enabled ? 'Disable notifications' : 'Enable notifications'}
                </button>
            </CardContent>
        </Card>
    )
}
