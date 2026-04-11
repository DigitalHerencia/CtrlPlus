/**
 * @introduction Components — TODO: short one-line summary of wrap-form-shell.tsx
 *
 * @description TODO: longer description for wrap-form-shell.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import type { ReactNode } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface WrapFormShellProps {
    title: string
    description: string
    children: ReactNode
}

/**
 * WrapFormShell — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function WrapFormShell({ title, description, children }: WrapFormShellProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    )
}
