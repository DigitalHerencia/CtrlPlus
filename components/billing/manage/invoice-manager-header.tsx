import { type ReactNode } from 'react'

interface InvoiceManagerHeaderProps {
    actions?: ReactNode
}

export function InvoiceManagerHeader({ actions }: InvoiceManagerHeaderProps) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold text-neutral-100">Invoice Manager</h1>
                <p className="text-sm text-neutral-400">
                    Issue, refund, credit, and void invoices.
                </p>
            </div>
            {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </div>
    )
}
