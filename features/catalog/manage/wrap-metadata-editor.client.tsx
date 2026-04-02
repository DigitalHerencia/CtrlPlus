'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { WrapDetailsFields } from '@/components/catalog/wrap-form/wrap-details-fields'
import { WrapFormActions } from '@/components/catalog/wrap-form/wrap-form-actions'
import { WrapFormFields } from '@/components/catalog/wrap-form/wrap-form-fields'
import { WrapFormShell } from '@/components/catalog/wrap-form/wrap-form-shell'
import { WrapPricingFields } from '@/components/catalog/wrap-form/wrap-pricing-fields'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateWrap } from '@/lib/actions/catalog.actions'
import { updateWrapSchema } from '@/schemas/catalog.schemas'
import type { CatalogDetailDTO, UpdateWrapInput } from '@/types/catalog.types'

export interface WrapMetadataEditorProps {
    wrap: CatalogDetailDTO
}

export function WrapMetadataEditor({ wrap }: WrapMetadataEditorProps) {
    const [isPending, startTransition] = useTransition()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(updateWrapSchema),
        defaultValues: {
            name: wrap.name,
            description: wrap.description ?? '',
            price: wrap.price,
            installationMinutes: wrap.installationMinutes ?? undefined,
        },
    })

    const onSubmit = async (data: unknown) => {
        const validated = updateWrapSchema.parse(data)
        startTransition(async () => {
            try {
                await updateWrap(wrap.id, validated)
                console.log('Wrap updated successfully')
            } catch (error) {
                console.error('Failed to update wrap', error)
            }
        })
    }

    return (
        <WrapFormShell title="Wrap Information" description="Edit wrap metadata and pricing">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <WrapFormFields>
                    <WrapDetailsFields>
                        <Label htmlFor="name">Wrap Name</Label>
                        <Input id="name" {...register('name')} />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </WrapDetailsFields>

                    <WrapDetailsFields>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" rows={4} {...register('description')} />
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description.message}</p>
                        )}
                    </WrapDetailsFields>

                    <WrapPricingFields>
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (cents)</Label>
                            <Input
                                id="price"
                                type="number"
                                {...register('price', { valueAsNumber: true })}
                            />
                            {errors.price && (
                                <p className="text-sm text-red-500">{errors.price.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="installationMinutes">Installation Time (minutes)</Label>
                            <Input
                                id="installationMinutes"
                                type="number"
                                {...register('installationMinutes', { valueAsNumber: true })}
                            />
                        </div>
                    </WrapPricingFields>
                </WrapFormFields>

                <WrapFormActions>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                </WrapFormActions>
            </form>
        </WrapFormShell>
    )
}
