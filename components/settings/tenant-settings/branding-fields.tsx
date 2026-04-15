
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface BrandingFieldsProps {
    logoUrl: string
    onLogoUrlChange: (value: string) => void
}


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
