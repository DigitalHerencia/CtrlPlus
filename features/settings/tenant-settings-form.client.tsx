'use client'


import { useState, useTransition } from 'react'
import { useForm, useWatch } from 'react-hook-form'

import { BrandingFields } from '@/components/settings/tenant-settings/branding-fields'
import { BusinessDetailsFields } from '@/components/settings/tenant-settings/business-details-fields'
import { TenantSettingsActions } from '@/components/settings/tenant-settings/tenant-settings-actions'
import { TenantSettingsFormShell } from '@/components/settings/tenant-settings/tenant-settings-form-shell'
import { TenantSettingsFormFields } from '@/components/settings/tenant-settings/tenant-settings-form-fields'
import { type TenantSettingsViewDTO } from '@/types/settings.types'

interface TenantSettingsFormClientProps {
    initialSettings: TenantSettingsViewDTO
    onSave: (input: {
        businessName?: string | null
        address?: string | null
        taxId?: string | null
        notificationEmail?: string | null
        logoUrl?: string | null
    }) => Promise<unknown>
}

type FormValues = {
    businessName: string
    address: string
    taxId: string
    notificationEmail: string
    logoUrl: string
}


export function TenantSettingsFormClient({
    initialSettings,
    onSave,
}: TenantSettingsFormClientProps) {
    const [isPending, startTransition] = useTransition()
    const [serverMessage, setServerMessage] = useState<string | null>(null)

    const form = useForm<FormValues>({
        defaultValues: {
            businessName: initialSettings.businessName ?? '',
            address: initialSettings.address ?? '',
            taxId: initialSettings.taxId ?? '',
            notificationEmail: initialSettings.notificationEmail ?? '',
            logoUrl: initialSettings.logoUrl ?? '',
        },
    })

    const businessName = useWatch({ control: form.control, name: 'businessName' })
    const address = useWatch({ control: form.control, name: 'address' })
    const taxId = useWatch({ control: form.control, name: 'taxId' })
    const notificationEmail = useWatch({ control: form.control, name: 'notificationEmail' })
    const logoUrl = useWatch({ control: form.control, name: 'logoUrl' })

    async function onSubmit(values: FormValues) {
        setServerMessage(null)
        startTransition(async () => {
            try {
                await onSave(values)
                setServerMessage('Tenant settings saved successfully.')
            } catch (error) {
                setServerMessage(
                    error instanceof Error ? error.message : 'Unable to save tenant settings.'
                )
            }
        })
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <TenantSettingsFormShell>
                <TenantSettingsFormFields
                    businessName={businessName}
                    address={address}
                    taxId={taxId}
                    notificationEmail={notificationEmail}
                    onBusinessNameChange={(value) =>
                        form.setValue('businessName', value, { shouldDirty: true })
                    }
                    onAddressChange={(value) =>
                        form.setValue('address', value, { shouldDirty: true })
                    }
                    onTaxIdChange={(value) => form.setValue('taxId', value, { shouldDirty: true })}
                    onNotificationEmailChange={(value) =>
                        form.setValue('notificationEmail', value, { shouldDirty: true })
                    }
                />

                <BusinessDetailsFields
                    businessName={businessName}
                    address={address}
                    taxId={taxId}
                    onBusinessNameChange={(value) =>
                        form.setValue('businessName', value, { shouldDirty: true })
                    }
                    onAddressChange={(value) =>
                        form.setValue('address', value, { shouldDirty: true })
                    }
                    onTaxIdChange={(value) => form.setValue('taxId', value, { shouldDirty: true })}
                />

                <BrandingFields
                    logoUrl={logoUrl}
                    onLogoUrlChange={(value) =>
                        form.setValue('logoUrl', value, { shouldDirty: true })
                    }
                />

                {serverMessage ? <p className="text-sm text-neutral-300">{serverMessage}</p> : null}
                <TenantSettingsActions isPending={isPending} />
            </TenantSettingsFormShell>
        </form>
    )
}
