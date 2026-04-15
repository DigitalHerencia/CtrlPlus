'use client'

import { useState, useTransition } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm, type SubmitHandler } from 'react-hook-form'
import type { z } from 'zod'

import { NewWrapPageView } from '@/components/catalog/manage/new-wrap-page-view'
import { createWrap } from '@/lib/actions/catalog.actions'
import { createWrapSchema } from '@/schemas/catalog.schemas'

type CreateWrapFormInput = z.input<typeof createWrapSchema>
type CreateWrapFormData = z.output<typeof createWrapSchema>

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
    } = useForm<CreateWrapFormInput, unknown, CreateWrapFormData>({
        resolver: zodResolver(createWrapSchema),
    })

    const onSubmit: SubmitHandler<CreateWrapFormData> = (data) => {
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
        <NewWrapPageView
            onSubmit={handleSubmit(onSubmit)}
            register={register}
            errors={errors}
            isPending={isPending}
            submitError={submitError}
        />
    )
}
