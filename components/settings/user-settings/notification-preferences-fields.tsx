/**
 * @introduction Components — TODO: short one-line summary of notification-preferences-fields.tsx
 *
 * @description TODO: longer description for notification-preferences-fields.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface NotificationPreferencesFieldsProps {
    email: boolean
    sms: boolean
    push: boolean
    onEmailChange: (value: boolean) => void
    onSmsChange: (value: boolean) => void
    onPushChange: (value: boolean) => void
}

function ToggleRow({
    label,
    value,
    onChange,
}: {
    label: string
    value: boolean
    onChange: (value: boolean) => void
}) {
    return (
        <div className="flex items-center justify-between rounded-md border border-neutral-800 p-3">
            <Label>{label}</Label>
            <Input
                type="checkbox"
                checked={value}
                onChange={(event) => onChange(event.target.checked)}
                className="h-4 w-4"
            />
        </div>
    )
}

/**
 * NotificationPreferencesFields — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function NotificationPreferencesFields({
    email,
    sms,
    push,
    onEmailChange,
    onSmsChange,
    onPushChange,
}: NotificationPreferencesFieldsProps) {
    return (
        <div className="space-y-3">
            <ToggleRow label="Email notifications" value={email} onChange={onEmailChange} />
            <ToggleRow label="SMS notifications" value={sms} onChange={onSmsChange} />
            <ToggleRow label="Push notifications" value={push} onChange={onPushChange} />
        </div>
    )
}
