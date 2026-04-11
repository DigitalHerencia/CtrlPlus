'use client'
/**
 * Components — TODO: brief module description.
 * Domain: components
 * Public: TODO (yes/no)
 */

import { FormField } from './form-field'
import { ProfileFormGroup } from './profile-form-group'
import { Label } from '@/components/ui/label'

interface ProfileFormNotificationsProps {
    emailNotifications: boolean
    smsNotifications: boolean
    pushNotifications: boolean
    onEmailChange: (value: boolean) => void
    onSmsChange: (value: boolean) => void
    onPushChange: (value: boolean) => void
}

/**
 * ProfileFormNotifications — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function ProfileFormNotifications({
    emailNotifications,
    smsNotifications,
    pushNotifications,
    onEmailChange,
    onSmsChange,
    onPushChange,
}: ProfileFormNotificationsProps) {
    return (
        <ProfileFormGroup
            title="Notification Preferences"
            description="Control how and when we reach you"
        >
            <FormField>
                <div className="flex items-center justify-between rounded-md border border-neutral-800 bg-neutral-900/50 p-3">
                    <Label htmlFor="email-notif" className="cursor-pointer text-sm">
                        Email notifications
                    </Label>
                    <input
                        id="email-notif"
                        type="checkbox"
                        checked={emailNotifications}
                        onChange={(e) => onEmailChange(e.target.checked)}
                        className="h-4 w-4 cursor-pointer text-blue-600 focus:ring-2 focus:ring-blue-600"
                    />
                </div>
            </FormField>

            <FormField>
                <div className="flex items-center justify-between rounded-md border border-neutral-800 bg-neutral-900/50 p-3">
                    <Label htmlFor="sms-notif" className="cursor-pointer text-sm">
                        SMS notifications
                    </Label>
                    <input
                        id="sms-notif"
                        type="checkbox"
                        checked={smsNotifications}
                        onChange={(e) => onSmsChange(e.target.checked)}
                        className="h-4 w-4 cursor-pointer text-blue-600 focus:ring-2 focus:ring-blue-600"
                    />
                </div>
            </FormField>

            <FormField>
                <div className="flex items-center justify-between rounded-md border border-neutral-800 bg-neutral-900/50 p-3">
                    <Label htmlFor="push-notif" className="cursor-pointer text-sm">
                        Push notifications
                    </Label>
                    <input
                        id="push-notif"
                        type="checkbox"
                        checked={pushNotifications}
                        onChange={(e) => onPushChange(e.target.checked)}
                        className="h-4 w-4 cursor-pointer text-blue-600 focus:ring-2 focus:ring-blue-600"
                    />
                </div>
            </FormField>
        </ProfileFormGroup>
    )
}
