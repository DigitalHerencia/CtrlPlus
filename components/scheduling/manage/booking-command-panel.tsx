import type { ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface BookingCommandPanelProps {
    children: ReactNode
}

export function BookingCommandPanel({ children }: BookingCommandPanelProps) {
    return (
        <Card className="border-neutral-800 bg-neutral-950/80">
            <CardHeader>
                <CardTitle>Command Panel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">{children}</CardContent>
        </Card>
    )
}
