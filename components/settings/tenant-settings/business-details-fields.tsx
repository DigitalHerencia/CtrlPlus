/**
 * @introduction Components — TODO: short one-line summary of business-details-fields.tsx
 *
 * @description TODO: longer description for business-details-fields.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface BusinessDetailsFieldsProps {
    businessName: string
    address: string
    taxId: string
    onBusinessNameChange: (value: string) => void
    onAddressChange: (value: string) => void
    onTaxIdChange: (value: string) => void
}

/**
 * BusinessDetailsFields — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function BusinessDetailsFields({
    businessName,
    address,
    taxId,
    onBusinessNameChange,
    onAddressChange,
    onTaxIdChange,
}: BusinessDetailsFieldsProps) {
    return (
        <div className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="business-name">Business Name</Label>
                <Input
                    id="business-name"
                    value={businessName}
                    onChange={(e) => onBusinessNameChange(e.target.value)}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="business-address">Business Address</Label>
                <Input
                    id="business-address"
                    value={address}
                    onChange={(e) => onAddressChange(e.target.value)}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="business-tax-id">Tax ID</Label>
                <Input
                    id="business-tax-id"
                    value={taxId}
                    onChange={(e) => onTaxIdChange(e.target.value)}
                />
            </div>
        </div>
    )
}
