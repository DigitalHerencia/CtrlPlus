import type { ReactNode } from 'react'

interface WrapCategoryFieldsProps {
    children: ReactNode
}

export function WrapCategoryFields({ children }: WrapCategoryFieldsProps) {
    return <div className="space-y-3">{children}</div>
}
