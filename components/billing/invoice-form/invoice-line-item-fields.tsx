import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface InvoiceLineItemFieldsProps {
    quantity: number
    unitAmount: number
    onQuantityChange: (value: number) => void
    onUnitAmountChange: (value: number) => void
}

export function InvoiceLineItemFields({
    quantity,
    unitAmount,
    onQuantityChange,
    onUnitAmountChange,
}: InvoiceLineItemFieldsProps) {
    return (
        <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
                <Label htmlFor="line-qty">Quantity</Label>
                <Input
                    id="line-qty"
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(event) => onQuantityChange(Number(event.target.value) || 1)}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="line-amount">Unit Amount (cents)</Label>
                <Input
                    id="line-amount"
                    type="number"
                    min={0}
                    value={unitAmount}
                    onChange={(event) => onUnitAmountChange(Number(event.target.value) || 0)}
                />
            </div>
        </div>
    )
}
