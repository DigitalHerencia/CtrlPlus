'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { CatalogManagerHeader } from '@/components/catalog/manage/catalog-manager-header'
import { WrapDetailsFields } from '@/components/catalog/wrap-form/wrap-details-fields'
import { WrapFormActions } from '@/components/catalog/wrap-form/wrap-form-actions'
import { WrapFormFields } from '@/components/catalog/wrap-form/wrap-form-fields'
import { WrapFormShell } from '@/components/catalog/wrap-form/wrap-form-shell'
import { WrapPricingFields } from '@/components/catalog/wrap-form/wrap-pricing-fields'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createWrap } from '@/lib/actions/catalog.actions'
import { createWrapSchema } from '@/schemas/catalog.schemas'
import type { CreateWrapInput } from '@/types/catalog.types'
import { useRouter } from 'next/navigation'

function parsePriceInput(value: number): number {
    if (!Number.isFinite(value) || value <= 0) {
        throw new Error('Price must be a positive number.')
    }

    return Math.round(value * 100)
}

export function NewWrapPageFeature() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [submitError, setSubmitError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(createWrapSchema),
    })

    const onSubmit = (data: CreateWrapInput) => {
        setSubmitError(null)
        startTransition(async () => {
            try {
                const wrap = await createWrap({
                    ...data,
                    price: parsePriceInput(data.price),
                })
                router.push(`/catalog/manage/${wrap.id}`)
            } catch (error) {
                setSubmitError(error instanceof Error ? error.message : 'Failed to create wrap.')
            }
        })
    }

    return (
        <div className="space-y-6">
            <CatalogManagerHeader
                total={0}
                actions={
                    <Button variant="outline" asChild>
                        <Link href="/catalog/manage">Cancel</Link>
                    </Button>
                }
            />

            <WrapFormShell
                title="Wrap Information"
                description="Basic metadata for your wrap product"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <WrapFormFields>
                        <WrapDetailsFields>
                            <Label htmlFor="name">Wrap Name *</Label>
                            <Input
                                id="name"
                                placeholder="e.g., Phoenix Metallic Blue"
                                {...register('name')}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name.message}</p>
                            )}
                        </WrapDetailsFields>

                        <WrapDetailsFields>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe this wrap design"
                                rows={4}
                                {...register('description')}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500">{errors.description.message}</p>
                            )}
                        </WrapDetailsFields>

                        <WrapPricingFields>
                            <div className="space-y-2">
                                <Label htmlFor="price">Price (USD) *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    placeholder="e.g., 2500 for $2,500"
                                    {...register('price', { valueAsNumber: true })}
                                />
                                {errors.price && (
                                    <p className="text-sm text-red-500">{errors.price.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="installationMinutes">
                                    Installation Time (minutes)
                                </Label>
                                <Input
                                    id="installationMinutes"
                                    type="number"
                                    placeholder="e.g., 180"
                                    {...register('installationMinutes', { valueAsNumber: true })}
                                />
                                {errors.installationMinutes && (
                                    <p className="text-sm text-red-500">
                                        {errors.installationMinutes.message}
                                    </p>
                                )}
                            </div>
                        </WrapPricingFields>
                    </WrapFormFields>

                    <WrapFormActions>
                        {submitError ? <p className="text-sm text-red-500">{submitError}</p> : null}
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Creating...' : 'Create Wrap'}
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/catalog/manage">Cancel</Link>
                        </Button>
                    </WrapFormActions>
                </form>
            </WrapFormShell>
        </div>
    )
}
