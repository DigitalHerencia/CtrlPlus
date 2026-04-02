'use client'

import { useTransition } from 'react'

import { Button } from '@/components/ui/button'

interface InvoiceLifecycleActionsClientProps {
    invoiceId: string
    onVoid: (input: { invoiceId: string }) => Promise<unknown>
}

export function InvoiceLifecycleActionsClient({
    invoiceId,
    onVoid,
}: InvoiceLifecycleActionsClientProps) {
    const [isPending, startTransition] = useTransition()

    return (
        <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => {
                startTransition(async () => {
                    await onVoid({ invoiceId })
                })
            }}
        >
            {isPending ? 'Voiding…' : 'Void Invoice'}
        </Button>
    )
}
