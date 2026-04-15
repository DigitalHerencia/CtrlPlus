import Link from 'next/link'
import type { FormEventHandler } from 'react'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'

import { CatalogManagerHeader } from '@/components/catalog/manage/catalog-manager-header'
import { WrapDetailsFields } from '@/components/catalog/wrap-form/wrap-details-fields'
import { WrapFormActions } from '@/components/catalog/wrap-form/wrap-form-actions'
import { WrapFormFields } from '@/components/catalog/wrap-form/wrap-form-fields'
import { WrapFormShell } from '@/components/catalog/wrap-form/wrap-form-shell'
import { WrapPricingFields } from '@/components/catalog/wrap-form/wrap-pricing-fields'
import { WorkspacePageContextCard } from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { CreateWrapInput } from '@/types/catalog.types'

interface NewWrapPageViewProps {
    onSubmit: FormEventHandler<HTMLFormElement>
    register: UseFormRegister<CreateWrapInput>
    errors: FieldErrors<CreateWrapInput>
    isPending: boolean
    submitError: string | null
}

export function NewWrapPageView({
    onSubmit,
    register,
    errors,
    isPending,
    submitError,
}: NewWrapPageViewProps) {
    return (
        <div className="space-y-6">
            <CatalogManagerHeader
                title="Launch a New Wrap Package"
                description="Create a high-converting catalog listing with clear pricing, production-ready details, and premium positioning."
            />
            <WorkspacePageContextCard
                title="Creation Controls"
                description="Return to your manager workspace anytime"
            >
                <Button variant="outline" asChild>
                    <Link href="/catalog/manage">Cancel</Link>
                </Button>
            </WorkspacePageContextCard>

            <WrapFormShell
                title="Wrap Information"
                description="Basic metadata for your wrap product"
            >
                <form onSubmit={onSubmit} className="space-y-6">
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
