
import type { ReactNode } from 'react'

interface WrapFormFieldsProps {
    children: ReactNode
}


export function WrapFormFields({ children }: WrapFormFieldsProps) {
    return <div className="space-y-6">{children}</div>
}
