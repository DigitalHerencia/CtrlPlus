import type { ReactNode } from 'react'

interface WrapImageActionsProps {
    children: ReactNode
}

export function WrapImageActions({ children }: WrapImageActionsProps) {
    return <div className="flex items-center gap-2">{children}</div>
}
