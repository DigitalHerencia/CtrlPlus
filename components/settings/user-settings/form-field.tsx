/**
 * @introduction Components — TODO: short one-line summary of form-field.tsx
 *
 * @description TODO: longer description for form-field.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { ReactNode } from 'react'
import { Label } from '@/components/ui/label'

interface FormFieldProps {
    label?: string
    required?: boolean
    error?: string
    children: ReactNode
}

/**
 * FormField — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function FormField({ label, required = false, error, children }: FormFieldProps) {
    return (
        <div className="grid gap-2">
            {label && (
                <Label className="text-sm font-medium text-neutral-100">
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </Label>
            )}
            {children}
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    )
}
