import { Button } from '@/components/ui/button'

interface SettingsFormActionsProps {
    isPending?: boolean
    submitLabel?: string
}

export function SettingsFormActions({
    isPending = false,
    submitLabel = 'Save preferences',
}: SettingsFormActionsProps) {
    return (
        <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving…' : submitLabel}
            </Button>
        </div>
    )
}
