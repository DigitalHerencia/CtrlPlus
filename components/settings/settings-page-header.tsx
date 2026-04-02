import { type ReactNode } from 'react'

interface SettingsPageHeaderProps {
    title: string
    description: string
    actions?: ReactNode
}

export function SettingsPageHeader({ title, description, actions }: SettingsPageHeaderProps) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold text-neutral-100">{title}</h1>
                <p className="text-sm text-neutral-400">{description}</p>
            </div>
            {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </div>
    )
}
