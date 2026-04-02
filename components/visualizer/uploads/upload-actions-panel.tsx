import type { ReactNode } from 'react'

export function UploadActionsPanel({ children }: { children: ReactNode }) {
    return <div className="flex flex-wrap gap-2">{children}</div>
}
