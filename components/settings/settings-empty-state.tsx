
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SettingsEmptyStateProps {
    title: string
    description: string
}


export function SettingsEmptyState({ title, description }: SettingsEmptyStateProps) {
    return (
        <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-neutral-400">{description}</p>
            </CardContent>
        </Card>
    )
}
