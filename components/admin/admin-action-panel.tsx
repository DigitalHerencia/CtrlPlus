/**
 * @introduction Components — TODO: short one-line summary of admin-action-panel.tsx
 *
 * @description TODO: longer description for admin-action-panel.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ReactNode } from 'react'

interface AdminActionPanelProps {
    title: string
    description?: string
    children: ReactNode
}

/**
 * AdminActionPanel — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function AdminActionPanel({ title, description, children }: AdminActionPanelProps) {
    return (
        <Card className="border-neutral-800 bg-neutral-950/80 text-neutral-100">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description ? <p className="text-sm text-neutral-400">{description}</p> : null}
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    )
}
