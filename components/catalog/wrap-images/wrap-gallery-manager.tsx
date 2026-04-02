import type { ReactNode } from 'react'

interface WrapGalleryManagerProps {
    children: ReactNode
}

export function WrapGalleryManager({ children }: WrapGalleryManagerProps) {
    return <div className="space-y-3">{children}</div>
}
