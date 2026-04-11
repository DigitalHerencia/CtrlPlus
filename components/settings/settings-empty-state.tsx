/**
 * @introduction Components — TODO: short one-line summary of settings-empty-state.tsx
 *
 * @description TODO: longer description for settings-empty-state.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SettingsEmptyStateProps {
    title: string
    description: string
}

/**
 * SettingsEmptyState — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function SettingsEmptyState({ title, description }: SettingsEmptyStateProps) {
    return (
        <Card className="border-neutral-800 bg-neutral-950/70 text-neutral-100">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-neutral-400">{description}</p>
            </CardContent>
        </Card>
    )
}
