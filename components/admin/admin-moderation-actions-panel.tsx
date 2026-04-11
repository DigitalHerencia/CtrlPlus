/**
 * @introduction Components — TODO: short one-line summary of admin-moderation-actions-panel.tsx
 *
 * @description TODO: longer description for admin-moderation-actions-panel.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import type { ReactNode } from 'react'

interface AdminModerationActionsPanelProps {
    children: ReactNode
}

/**
 * AdminModerationActionsPanel — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function AdminModerationActionsPanel({ children }: AdminModerationActionsPanelProps) {
    return <div className="flex items-center gap-2">{children}</div>
}
