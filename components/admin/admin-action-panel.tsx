
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ReactNode } from 'react'

interface AdminActionPanelProps {
    title: string
    description?: string
    children: ReactNode
}


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
