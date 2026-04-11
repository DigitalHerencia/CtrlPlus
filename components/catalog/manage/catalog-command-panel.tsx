/**
 * @introduction Components — TODO: short one-line summary of catalog-command-panel.tsx
 *
 * @description TODO: longer description for catalog-command-panel.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import type { ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CatalogCommandPanelProps {
    title: string
    children: ReactNode
}

/**
 * CatalogCommandPanel — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function CatalogCommandPanel({ title, children }: CatalogCommandPanelProps) {
    return (
        <Card className="border-neutral-800 bg-neutral-950/80 text-neutral-100">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    )
}
