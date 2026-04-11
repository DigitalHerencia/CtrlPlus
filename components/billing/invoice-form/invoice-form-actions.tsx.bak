import { Button } from '@/components/ui/button'

interface InvoiceFormActionsProps {
    submitLabel?: string
    isPending?: boolean
}

export function InvoiceFormActions({
    submitLabel = 'Submit',
    isPending = false,
}: InvoiceFormActionsProps) {
    return (
        <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving…' : submitLabel}
            </Button>
        </div>
    )
}
