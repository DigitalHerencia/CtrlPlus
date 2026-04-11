/**
 * @introduction Components — TODO: short one-line summary of invoice-adjustment-fields.tsx
 *
 * @description TODO: longer description for invoice-adjustment-fields.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface InvoiceAdjustmentFieldsProps {
    amount: number
    notes: string
    onAmountChange: (value: number) => void
    onNotesChange: (value: string) => void
}

/**
 * InvoiceAdjustmentFields — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function InvoiceAdjustmentFields({
    amount,
    notes,
    onAmountChange,
    onNotesChange,
}: InvoiceAdjustmentFieldsProps) {
    return (
        <div className="space-y-3">
            <div className="grid gap-2">
                <Label htmlFor="adjustment-amount">Adjustment (cents)</Label>
                <Input
                    id="adjustment-amount"
                    type="number"
                    min={1}
                    value={amount}
                    onChange={(event) => onAmountChange(Number(event.target.value) || 0)}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="adjustment-notes">Notes</Label>
                <Textarea
                    id="adjustment-notes"
                    value={notes}
                    onChange={(event) => onNotesChange(event.target.value)}
                />
            </div>
        </div>
    )
}
