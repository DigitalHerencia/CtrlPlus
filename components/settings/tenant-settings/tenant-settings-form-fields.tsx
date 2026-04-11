/**
 * @introduction Components — TODO: short one-line summary of tenant-settings-form-fields.tsx
 *
 * @description TODO: longer description for tenant-settings-form-fields.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface TenantSettingsFormFieldsProps {
    businessName: string
    address: string
    taxId: string
    notificationEmail: string
    onBusinessNameChange: (value: string) => void
    onAddressChange: (value: string) => void
    onTaxIdChange: (value: string) => void
    onNotificationEmailChange: (value: string) => void
}

/**
 * TenantSettingsFormFields — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function TenantSettingsFormFields({
    businessName,
    address,
    taxId,
    notificationEmail,
    onBusinessNameChange,
    onAddressChange,
    onTaxIdChange,
    onNotificationEmailChange,
}: TenantSettingsFormFieldsProps) {
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
                <Label htmlFor="tenant-business-name">Business name</Label>
                <Input
                    id="tenant-business-name"
                    value={businessName}
                    onChange={(event) => onBusinessNameChange(event.target.value)}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="tenant-tax-id">Tax ID</Label>
                <Input
                    id="tenant-tax-id"
                    value={taxId}
                    onChange={(event) => onTaxIdChange(event.target.value)}
                />
            </div>
            <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="tenant-address">Address</Label>
                <Input
                    id="tenant-address"
                    value={address}
                    onChange={(event) => onAddressChange(event.target.value)}
                />
            </div>
            <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="tenant-email">Notification email</Label>
                <Input
                    id="tenant-email"
                    value={notificationEmail}
                    onChange={(event) => onNotificationEmailChange(event.target.value)}
                />
            </div>
        </div>
    )
}
