'use client'


import { useTransition } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

import { InvoiceFormActions } from '@/components/billing/invoice-form/invoice-form-actions'
import { InvoiceFormFields } from '@/components/billing/invoice-form/invoice-form-fields'
import { InvoiceFormShell } from '@/components/billing/invoice-form/invoice-form-shell'
import { createInvoice } from '@/lib/actions/billing.actions'
import { createInvoiceSchema } from '@/schemas/billing.schemas'
import type { z } from 'zod'

type CreateInvoiceFormValues = z.input<typeof createInvoiceSchema>
type CreateInvoiceInput = z.output<typeof createInvoiceSchema>

interface InvoiceEditorFormClientProps {
    initialBookingId?: string
    initialDescription?: string
    submitLabel?: string
    onSubmitInvoice?: (input: CreateInvoiceInput) => Promise<unknown>
}


export function InvoiceEditorFormClient({
    initialBookingId = '',
    initialDescription = '',
    submitLabel = 'Create Invoice',
    onSubmitInvoice,
}: InvoiceEditorFormClientProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const form = useForm<CreateInvoiceFormValues, unknown, CreateInvoiceInput>({
        mode: 'onSubmit',
        resolver: zodResolver(createInvoiceSchema),
        defaultValues: {
            bookingId: initialBookingId,
            description: initialDescription,
            quantity: 1,
        },
    })
    const bookingId = useWatch({ control: form.control, name: 'bookingId' })
    const description = useWatch({ control: form.control, name: 'description' }) ?? ''
    const unitPrice = useWatch({ control: form.control, name: 'unitPrice' }) as number | undefined
    const quantity =
        (useWatch({ control: form.control, name: 'quantity' }) as number | undefined) ?? 1

    function onSubmit(values: CreateInvoiceInput) {
        form.clearErrors()
        startTransition(async () => {
            try {
                if (onSubmitInvoice) {
                    await onSubmitInvoice(values)
                    router.refresh()
                    return
                }

                const invoice = await createInvoice(values)
                router.push(`/billing/${invoice.invoiceId}`)
                router.refresh()
            } catch (error) {
                form.setError('root', {
                    type: 'server',
                    message: error instanceof Error ? error.message : 'Unable to save invoice.',
                })
            }
        })
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <InvoiceFormShell
                title="Invoice Editor"
                description="Issue an invoice from booking context."
            >
                {form.formState.errors.root ? (
                    <p className="text-sm text-red-300">{form.formState.errors.root.message}</p>
                ) : null}
                <InvoiceFormFields
                    bookingId={bookingId}
                    description={description}
                    unitPrice={unitPrice}
                    quantity={quantity}
                    onBookingIdChange={(value) =>
                        form.setValue('bookingId', value, {
                            shouldValidate: true,
                            shouldDirty: true,
                        })
                    }
                    onDescriptionChange={(value) =>
                        form.setValue('description', value, {
                            shouldValidate: true,
                            shouldDirty: true,
                        })
                    }
                    onUnitPriceChange={(value) =>
                        form.setValue('unitPrice', value, {
                            shouldValidate: true,
                            shouldDirty: true,
                        })
                    }
                    onQuantityChange={(value) =>
                        form.setValue('quantity', value, {
                            shouldValidate: true,
                            shouldDirty: true,
                        })
                    }
                />
                <InvoiceFormActions submitLabel={submitLabel} isPending={isPending} />
            </InvoiceFormShell>
        </form>
    )
}
