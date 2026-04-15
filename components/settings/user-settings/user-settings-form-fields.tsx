
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface UserSettingsFormFieldsProps {
    language: string
    timezone: string
    onLanguageChange: (value: string) => void
    onTimezoneChange: (value: string) => void
}


export function UserSettingsFormFields({
    language,
    timezone,
    onLanguageChange,
    onTimezoneChange,
}: UserSettingsFormFieldsProps) {
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
                <Label htmlFor="settings-language">Language</Label>
                <Input
                    id="settings-language"
                    value={language}
                    onChange={(event) => onLanguageChange(event.target.value)}
                    placeholder="en-US"
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="settings-timezone">Timezone</Label>
                <Input
                    id="settings-timezone"
                    value={timezone}
                    onChange={(event) => onTimezoneChange(event.target.value)}
                    placeholder="America/Denver"
                />
            </div>
        </div>
    )
}
