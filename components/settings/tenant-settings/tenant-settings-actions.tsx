/**
 * @introduction Components — TODO: short one-line summary of tenant-settings-actions.tsx
 *
 * @description TODO: longer description for tenant-settings-actions.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { Button } from '@/components/ui/button'

interface TenantSettingsActionsProps {
    isPending?: boolean
}

/**
 * TenantSettingsActions — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function TenantSettingsActions({ isPending = false }: TenantSettingsActionsProps) {
    return (
        <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving…' : 'Save tenant settings'}
            </Button>
        </div>
    )
}
