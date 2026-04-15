
import type { ReactNode } from 'react'

interface WrapFormActionsProps {
    children: ReactNode
}


export function WrapFormActions({ children }: WrapFormActionsProps) {
    return <div className="flex gap-2">{children}</div>
}
