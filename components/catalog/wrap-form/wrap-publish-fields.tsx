import type { ReactNode } from 'react'

interface WrapPublishFieldsProps {
    children: ReactNode
}

export function WrapPublishFields({ children }: WrapPublishFieldsProps) {
    return <div className="space-y-3">{children}</div>
}
