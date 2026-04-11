/**
 * @introduction Components — TODO: short one-line summary of profile-form-group.tsx
 *
 * @description TODO: longer description for profile-form-group.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { ReactNode } from 'react'

interface ProfileFormGroupProps {
    title: string
    description?: string
    children: ReactNode
}

/**
 * ProfileFormGroup — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function ProfileFormGroup({ title, description, children }: ProfileFormGroupProps) {
    return (
        <div className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-900/50 p-5">
            <div>
                <h3 className="text-sm font-semibold text-neutral-100">{title}</h3>
                {description && <p className="text-xs text-neutral-400">{description}</p>}
            </div>
            <div className="space-y-4">{children}</div>
        </div>
    )
}
