import type { ReactNode } from 'react'

interface WrapImageCardProps {
    children: ReactNode
}

export function WrapImageCard({ children }: WrapImageCardProps) {
    return (
        <div className="space-y-2 rounded-md border border-neutral-800 bg-neutral-950 p-2">
            {children}
        </div>
    )
}
