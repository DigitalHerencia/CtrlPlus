/**
 * @introduction Components — TODO: short one-line summary of invoice-form-actions.tsx
 *
 * @description TODO: longer description for invoice-form-actions.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { Button } from '@/components/ui/button'

interface InvoiceFormActionsProps {
    submitLabel?: string
    isPending?: boolean
}

/**
 * InvoiceFormActions — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
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
