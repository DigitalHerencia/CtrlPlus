import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { ReactNode } from 'react'

interface PlatformActionPanelProps {
    title: string
    description: string
    children: ReactNode
}

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
