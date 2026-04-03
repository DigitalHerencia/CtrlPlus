'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

import { InvoiceFormActions } from '@/components/billing/invoice-form/invoice-form-actions'
import { InvoiceFormFields } from '@/components/billing/invoice-form/invoice-form-fields'
import { InvoiceFormShell } from '@/components/billing/invoice-form/invoice-form-shell'
import { createInvoice } from '@/lib/actions/billing.actions'
import { createInvoiceSchema } from '@/schemas/billing.schemas'
import type { z } from 'zod'

type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>

interface InvoiceEditorFormClientProps {
    initialBookingId?: string
    submitLabel?: string
    onSubmitInvoice?: (input: { bookingId: string }) => Promise<unknown>
}

export function InvoiceEditorFormClient({
    initialBookingId = '',
    submitLabel = 'Create Invoice',
    onSubmitInvoice,
}: InvoiceEditorFormClientProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const form = useForm<CreateInvoiceInput>({
        mode: 'onSubmit',
        resolver: zodResolver(createInvoiceSchema),
        defaultValues: {
            bookingId: initialBookingId,
        },
    })

    function onSubmit(values: CreateInvoiceInput) {
        form.clearErrors()
        startTransition(async () => {
            try {
                if (onSubmitInvoice) {
                    await onSubmitInvoice({ bookingId: values.bookingId })
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
                    bookingId={form.watch('bookingId')}
                    onBookingIdChange={(value) =>
                        form.setValue('bookingId', value, {
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
