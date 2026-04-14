'use client'
/**
 * Features — TODO: brief module description.
 * Domain: features
 * Public: TODO (yes/no)
 */

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { zodResolver } from '@/components/ui/forms'
import type { ReadonlyURLSearchParams } from 'next/navigation'
import { useForm, useWatch } from 'react-hook-form'

import { invoiceFilterFormSchema } from '@/schemas/billing.schemas'
import type { InvoiceFilterFormValues } from '@/types/billing.types'

const defaultValues: InvoiceFilterFormValues = {
    query: '',
    invoiceId: '',
    sortBy: 'createdAt',
}

function getFormValues(searchParams: ReadonlyURLSearchParams): InvoiceFilterFormValues {
    return {
        query: searchParams.get('query') ?? '',
        invoiceId: searchParams.get('invoiceId') ?? '',
        sortBy: (searchParams.get('sortBy') as InvoiceFilterFormValues['sortBy']) ?? 'createdAt',
    }
}

function buildQueryString(values: InvoiceFilterFormValues, searchParams: ReadonlyURLSearchParams) {
    const params = new URLSearchParams(searchParams.toString())

    params.delete('page')
    params.delete('pageSize')

    if (values.query) {
        params.set('query', values.query)
    } else {
        params.delete('query')
    }

    if (values.invoiceId) {
        params.set('invoiceId', values.invoiceId)
    } else {
        params.delete('invoiceId')
    }

    if (values.sortBy !== 'createdAt') {
        params.set('sortBy', values.sortBy)
    } else {
        params.delete('sortBy')
    }

    return params.toString()
}

/**
 * InvoiceSearchFilterClient — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function InvoiceSearchFilterClient() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const searchParamsString = searchParams.toString()

    const form = useForm<InvoiceFilterFormValues>({
        resolver: zodResolver(invoiceFilterFormSchema),
        defaultValues: getFormValues(searchParams),
        mode: 'onChange',
    })

    const watchedValues = useWatch({ control: form.control })
    const deferredValues = useDeferredValue(watchedValues)

    useEffect(() => {
        form.reset(getFormValues(searchParams))
    }, [form, searchParams, searchParamsString])

    useEffect(() => {
        if (!form.formState.isDirty) {
            return
        }

        if (debounceRef.current) {
            clearTimeout(debounceRef.current)
        }

        debounceRef.current = setTimeout(() => {
            const parsed = invoiceFilterFormSchema.safeParse(deferredValues)
            if (!parsed.success) {
                return
            }

            const queryString = buildQueryString(parsed.data, searchParams)
            if (queryString === searchParamsString) {
                return
            }

            startTransition(() => {
                if (queryString) {
                    router.push(`${pathname}?${queryString}`)
                } else {
                    router.push(pathname)
                }
            })
        }, 250)

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current)
            }
        }
    }, [deferredValues, form.formState.isDirty, pathname, router, searchParams, searchParamsString])

    const handleReset = useCallback(() => {
        form.reset(defaultValues)
        startTransition(() => {
            router.push(pathname)
        })
    }, [form, pathname, router])

    const hasActiveFilters = useMemo(() => {
        const current = watchedValues ?? defaultValues

        return Boolean(current.query || current.invoiceId || current.sortBy !== 'createdAt')
    }, [watchedValues])

    const inputClassName =
        'h-11 border border-neutral-700 bg-neutral-950/80 px-3 text-sm text-neutral-100 placeholder:text-neutral-500'
    const selectClassName =
        'h-11 border border-neutral-700 bg-neutral-950/80 px-3 text-sm text-neutral-100'

    return (
        <form onSubmit={(event) => event.preventDefault()} className="space-y-4">
            <FieldGroup className="grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_repeat(2,minmax(0,0.9fr))] lg:items-start">
                <Field>
                    <FieldLabel htmlFor="invoice-search" className="text-neutral-300">
                        Search
                    </FieldLabel>
                    <input
                        id="invoice-search"
                        type="search"
                        placeholder="Search invoices by id"
                        className={inputClassName}
                        disabled={isPending}
                        {...form.register('query')}
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="invoice-id" className="text-neutral-300">
                        Invoice ID
                    </FieldLabel>
                    <input
                        id="invoice-id"
                        type="search"
                        placeholder="Filter by invoice ID"
                        className={inputClassName}
                        disabled={isPending}
                        {...form.register('invoiceId')}
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="invoice-sort-by" className="text-neutral-300">
                        Sort By
                    </FieldLabel>
                    <select
                        id="invoice-sort-by"
                        className={selectClassName}
                        disabled={isPending}
                        {...form.register('sortBy')}
                    >
                        <option value="createdAt">Date Added</option>
                        <option value="name">Name</option>
                        <option value="price">Price</option>
                    </select>
                </Field>
            </FieldGroup>

            <div className="flex flex-col gap-3 border-t border-neutral-700 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                    {isPending
                        ? 'Refreshing invoice results'
                        : 'Filters sync with the URL and server search.'}
                </div>

                {hasActiveFilters && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        disabled={isPending}
                    >
                        Clear Filters
                    </Button>
                )}
            </div>
        </form>
    )
}
