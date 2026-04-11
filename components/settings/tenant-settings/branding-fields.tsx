/**
 * @introduction Components — TODO: short one-line summary of branding-fields.tsx
 *
 * @description TODO: longer description for branding-fields.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface BrandingFieldsProps {
    logoUrl: string
    onLogoUrlChange: (value: string) => void
}

/**
 * BrandingFields — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function BrandingFields({ logoUrl, onLogoUrlChange }: BrandingFieldsProps) {
    return (
        <div className="grid gap-2">
            <Label htmlFor="tenant-logo-url">Logo URL</Label>
            <Input
                id="tenant-logo-url"
                value={logoUrl}
                onChange={(event) => onLogoUrlChange(event.target.value)}
                placeholder="https://cdn.example.com/logo.png"
            />
        </div>
    )
}
