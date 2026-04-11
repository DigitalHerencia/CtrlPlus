'use client'
/**
 * Components — TODO: brief module description.
 * Domain: components
 * Public: TODO (yes/no)
 */

import { Input } from '@/components/ui/input'
import { FormField } from './form-field'
import { ProfileFormGroup } from './profile-form-group'
import { Label } from '@/components/ui/label'

interface ProfileFormPreferencesProps {
    theme: 'light' | 'dark' | 'system'
    timezone: string
    onThemeChange: (value: 'light' | 'dark' | 'system') => void
    onTimezoneChange: (value: string) => void
}

/**
 * ProfileFormPreferences — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function ProfileFormPreferences({
    theme,
    timezone,
    onThemeChange,
    onTimezoneChange,
}: ProfileFormPreferencesProps) {
    return (
        <ProfileFormGroup
            title="User Preferences"
            description="Customize your interface and system defaults"
        >
            <FormField label="Theme">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <input
                            type="radio"
                            id="theme-system"
                            name="theme"
                            value="system"
                            checked={theme === 'system'}
                            onChange={() => onThemeChange('system')}
                            className="h-4 w-4 cursor-pointer text-blue-600 focus:ring-2 focus:ring-blue-600"
                        />
                        <Label htmlFor="theme-system" className="flex-1 cursor-pointer text-sm">
                            System
                        </Label>
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="radio"
                            id="theme-light"
                            name="theme"
                            value="light"
                            checked={theme === 'light'}
                            onChange={() => onThemeChange('light')}
                            className="h-4 w-4 cursor-pointer text-blue-600 focus:ring-2 focus:ring-blue-600"
                        />
                        <Label htmlFor="theme-light" className="flex-1 cursor-pointer text-sm">
                            Light
                        </Label>
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="radio"
                            id="theme-dark"
                            name="theme"
                            value="dark"
                            checked={theme === 'dark'}
                            onChange={() => onThemeChange('dark')}
                            className="h-4 w-4 cursor-pointer text-blue-600 focus:ring-2 focus:ring-blue-600"
                        />
                        <Label htmlFor="theme-dark" className="flex-1 cursor-pointer text-sm">
                            Dark
                        </Label>
                    </div>
                </div>
            </FormField>

            <FormField label="Timezone" required>
                <Input
                    id="timezone"
                    value={timezone}
                    onChange={(e) => onTimezoneChange(e.target.value)}
                    placeholder="America/Denver"
                    className="bg-neutral-800 text-neutral-100 placeholder:text-neutral-500"
                />
            </FormField>
        </ProfileFormGroup>
    )
}
