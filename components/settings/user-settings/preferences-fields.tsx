/**
 * @introduction Components — TODO: short one-line summary of preferences-fields.tsx
 *
 * @description TODO: longer description for preferences-fields.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface PreferencesFieldsProps {
    theme: 'light' | 'dark' | 'system'
    onThemeChange: (value: 'light' | 'dark' | 'system') => void
}

/**
 * PreferencesFields — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function PreferencesFields({ theme, onThemeChange }: PreferencesFieldsProps) {
    return (
        <div className="grid gap-2">
            <Label htmlFor="settings-theme">Theme</Label>
            <Input
                id="settings-theme"
                value={theme}
                onChange={(event) => {
                    const value = event.target.value as 'light' | 'dark' | 'system'
                    if (value === 'light' || value === 'dark' || value === 'system') {
                        onThemeChange(value)
                    }
                }}
                placeholder="light | dark | system"
            />
        </div>
    )
}
