import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface InvoiceDiscountFieldsProps {
    amount: number
    onAmountChange: (value: number) => void
}

export function InvoiceDiscountFields({ amount, onAmountChange }: InvoiceDiscountFieldsProps) {
    return (
        <div className="grid gap-2">
            <Label htmlFor="discount-amount">Credit / Discount (cents)</Label>
            <Input
                id="discount-amount"
                type="number"
                min={0}
                value={amount}
                onChange={(event) => onAmountChange(Number(event.target.value) || 0)}
            />
        </div>
    )
}
