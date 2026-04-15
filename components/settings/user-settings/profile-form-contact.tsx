'use client'


import { Input } from '@/components/ui/input'
import { FormField } from './form-field'
import { ProfileFormGroup } from './profile-form-group'

interface ProfileFormContactProps {
    fullName: string
    email: string
    phone: string
    onFullNameChange: (value: string) => void
    onEmailChange: (value: string) => void
    onPhoneChange: (value: string) => void
}


export function ProfileFormContact({
    fullName,
    email,
    phone,
    onFullNameChange,
    onEmailChange,
    onPhoneChange,
}: ProfileFormContactProps) {
    return (
        <ProfileFormGroup
            title="Contact Information"
            description="How we'll reach you about wrap projects and booking confirmations"
        >
            <FormField label="Contact Name">
                <Input
                    id="contact-name"
                    value={fullName}
                    onChange={(e) => onFullNameChange(e.target.value)}
                    placeholder="Jane Driver"
                    className="bg-neutral-800 text-neutral-100 placeholder:text-neutral-500"
                />
            </FormField>

            <FormField label="Contact Email" required>
                <Input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => onEmailChange(e.target.value)}
                    placeholder="jane@example.com"
                    className="bg-neutral-800 text-neutral-100 placeholder:text-neutral-500"
                />
            </FormField>

            <FormField label="Contact Phone">
                <Input
                    id="contact-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => onPhoneChange(e.target.value)}
                    placeholder="(555) 555-5555"
                    className="bg-neutral-800 text-neutral-100 placeholder:text-neutral-500"
                />
            </FormField>
        </ProfileFormGroup>
    )
}
