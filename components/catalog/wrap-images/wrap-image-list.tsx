import type { ReactNode } from 'react'

interface WrapImageListProps {
    children: ReactNode
}

export function WrapImageList({ children }: WrapImageListProps) {
    return <div className="grid grid-cols-3 gap-4">{children}</div>
}
