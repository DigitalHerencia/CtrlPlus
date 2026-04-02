import type { ReactNode } from 'react'

export function VisualizerControlsPanel({ children }: { children: ReactNode }) {
    return (
        <section className="space-y-4 rounded-xl border border-neutral-800 bg-neutral-950/90 p-4">
            {children}
        </section>
    )
}
