/**
 * @introduction Components — TODO: short one-line summary of platform-action-panel.tsx
 *
 * @description TODO: longer description for platform-action-panel.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { ReactNode } from 'react'

interface PlatformActionPanelProps {
    title: string
    description: string
    children: ReactNode
}

/**
 * PlatformActionPanel — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function PlatformActionPanel({ title, description, children }: PlatformActionPanelProps) {
    return (
        <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription className="text-neutral-400">{description}</CardDescription>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    )
}
