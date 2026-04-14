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
        <section className="border border-neutral-700 bg-neutral-950/80 px-6 py-6">
            <div className="space-y-4">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-100">
                        {title}
                    </p>
                    {description && <p className="mt-1 text-xs text-neutral-400">{description}</p>}
                </div>
                <div className="space-y-4">{children}</div>
            </div>
        </section>
    )
}
