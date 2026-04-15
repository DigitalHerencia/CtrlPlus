
import { Button } from '@/components/ui/button'

interface TenantSettingsActionsProps {
    isPending?: boolean
}


export function TenantSettingsActions({ isPending = false }: TenantSettingsActionsProps) {
    return (
        <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving…' : 'Save tenant settings'}
            </Button>
        </div>
    )
}
