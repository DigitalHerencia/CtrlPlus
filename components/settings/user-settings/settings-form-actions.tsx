/**
 * @introduction Components — TODO: short one-line summary of settings-form-actions.tsx
 *
 * @description TODO: longer description for settings-form-actions.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { Button } from '@/components/ui/button'

interface SettingsFormActionsProps {
    isPending?: boolean
    submitLabel?: string
}

/**
 * SettingsFormActions — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
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
