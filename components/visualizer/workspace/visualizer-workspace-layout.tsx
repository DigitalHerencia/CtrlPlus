import type { ReactNode } from 'react'

export function VisualizerWorkspaceLayout({ children }: { children: ReactNode }) {
    return <div className="grid gap-6 lg:grid-cols-3">{children}</div>
}
