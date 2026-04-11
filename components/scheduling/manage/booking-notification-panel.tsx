/**
 * @introduction Components — TODO: short one-line summary of booking-notification-panel.tsx
 *
 * @description TODO: longer description for booking-notification-panel.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface BookingNotificationPanelProps {
    enabled: boolean
    onToggle: (value: boolean) => void
}

/**
 * BookingNotificationPanel — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
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
