import type { ReactNode } from 'react'

interface WrapImageCarouselManagerProps {
    children: ReactNode
}

export function WrapImageCarouselManager({ children }: WrapImageCarouselManagerProps) {
    return <div className="grid gap-2 sm:grid-cols-4">{children}</div>
}
