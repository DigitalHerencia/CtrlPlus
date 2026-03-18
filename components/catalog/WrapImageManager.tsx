/* eslint-disable react-hooks/incompatible-library */
'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
    WrapImageKind,
    type WrapImageDTO,
    type WrapImageKind as WrapImageKindValue,
} from '@/lib/catalog/types'
import { applyZodErrors } from '@/lib/forms/apply-zod-errors'
import { useEffect, useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface WrapImageManagerProps {
    wrapId: string
    images: WrapImageDTO[]
    onAddImage: (file: File, kind: WrapImageKindValue, isActive: boolean) => void
    onRemoveImage: (imageId: string) => void
    onReorderImages: (orderedIds: string[]) => void
    onUpdateImageMetadata: (imageId: string, kind: WrapImageKindValue, isActive: boolean) => void
}

const editableKinds = [
    WrapImageKind.HERO,
    WrapImageKind.VISUALIZER_TEXTURE,
    WrapImageKind.VISUALIZER_MASK_HINT,
    WrapImageKind.GALLERY,
]
const ACCEPTED_WRAP_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_WRAP_IMAGE_BYTES = 5 * 1024 * 1024

const wrapImageUploadFormSchema = z.object({
    kind: z.enum(editableKinds),
    isActive: z.boolean(),
    file: z
        .instanceof(File, { message: 'Choose an image to upload.' })
        .refine(
            (file) => ACCEPTED_WRAP_IMAGE_TYPES.includes(file.type),
            'Use a JPEG, PNG, or WEBP image.'
        )
        .refine(
            (file) => file.size > 0 && file.size <= MAX_WRAP_IMAGE_BYTES,
            'Image must be smaller than 5 MB.'
        ),
})

const wrapImageMetadataSchema = z.object({
    kind: z.enum(editableKinds),
    isActive: z.boolean(),
})

type WrapImageUploadValues = {
    kind: WrapImageKindValue
    isActive: boolean
    file: File | null
}

type WrapImageMetadataValues = z.input<typeof wrapImageMetadataSchema>

function labelKind(kind: WrapImageKindValue): string {
    switch (kind) {
        case WrapImageKind.HERO:
            return 'Hero'
        case WrapImageKind.VISUALIZER_TEXTURE:
            return 'Visualizer texture'
        case WrapImageKind.VISUALIZER_MASK_HINT:
            return 'Mask hint'
        case WrapImageKind.GALLERY:
            return 'Gallery'
    }
}

function sortImages(images: WrapImageDTO[]): WrapImageDTO[] {
    return [...images].sort((a, b) => a.displayOrder - b.displayOrder)
}

interface WrapImageRowProps {
    image: WrapImageDTO
    index: number
    totalImages: number
    isPending: boolean
    onMove: (index: number, direction: -1 | 1) => void
    onRemove: (imageId: string) => void
    onSave: (image: WrapImageDTO, values: WrapImageMetadataValues) => void
}

function WrapImageRow({
    image,
    index,
    totalImages,
    isPending,
    onMove,
    onRemove,
    onSave,
}: WrapImageRowProps) {
    const form = useForm<WrapImageMetadataValues>({
        defaultValues: {
            kind: image.kind,
            isActive: image.isActive,
        },
        mode: 'onChange',
    })

    useEffect(() => {
        form.reset({
            kind: image.kind,
            isActive: image.isActive,
        })
    }, [form, image.id, image.isActive, image.kind])

    // Safe: watch() is used for rendering only, not memoized or passed to memoized hooks/components.
    const kind = form.watch('kind')
    const isActive = form.watch('isActive')
    const hasChanges = kind !== image.kind || isActive !== image.isActive

    const submitRow = form.handleSubmit((values) => {
        const parsed = wrapImageMetadataSchema.safeParse(values)
        if (!parsed.success) {
            applyZodErrors(parsed.error, form.setError, form.clearErrors)
            return
        }

        form.clearErrors()
        onSave(image, parsed.data)
    })

    return (
        <Card className="border-neutral-800 bg-neutral-950/70 text-neutral-100">
            <CardContent className="grid gap-4 p-4 lg:grid-cols-[auto_1fr_auto]">
                <div className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image.url} alt="Wrap asset" className="h-28 w-36 object-cover" />
                </div>

                <form onSubmit={submitRow} className="space-y-4">
                    <FieldGroup className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
                        <Field>
                            <FieldLabel htmlFor={`${image.id}-kind`}>Asset role</FieldLabel>
                            <select
                                id={`${image.id}-kind`}
                                disabled={isPending}
                                className="h-10 rounded-md border border-neutral-700 bg-neutral-950 px-3 text-sm text-neutral-100 outline-none transition focus-visible:border-neutral-400"
                                {...form.register('kind')}
                            >
                                {editableKinds.map((kindOption) => (
                                    <option key={kindOption} value={kindOption}>
                                        {labelKind(kindOption)}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field className="justify-end">
                            <FieldLabel htmlFor={`${image.id}-active`}>Active</FieldLabel>
                            <label className="flex h-10 items-center gap-2 rounded-md border border-neutral-700 bg-neutral-950 px-3 text-sm text-neutral-100">
                                <input
                                    id={`${image.id}-active`}
                                    type="checkbox"
                                    disabled={isPending}
                                    {...form.register('isActive')}
                                />
                                Visible to workflows
                            </label>
                        </Field>
                    </FieldGroup>

                    <FieldDescription>
                        Version {image.version} · currently {labelKind(image.kind)} ·{' '}
                        {image.isActive ? 'active' : 'inactive'}
                    </FieldDescription>
                    <FieldError>{form.formState.errors.root?.server?.message}</FieldError>

                    <div className="flex flex-wrap gap-2">
                        <Button type="submit" size="sm" disabled={isPending || !hasChanges}>
                            Save changes
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={isPending || index === 0}
                            onClick={() => onMove(index, -1)}
                        >
                            Move up
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={isPending || index === totalImages - 1}
                            onClick={() => onMove(index, 1)}
                        >
                            Move down
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={isPending}
                            onClick={() => onRemove(image.id)}
                        >
                            Remove
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export function WrapImageManager({
    images,
    onAddImage,
    onRemoveImage,
    onReorderImages,
    onUpdateImageMetadata,
}: WrapImageManagerProps) {
    const orderedImages = useMemo(() => sortImages(images), [images])
    const uploadForm = useForm<WrapImageUploadValues>({
        defaultValues: {
            kind: WrapImageKind.GALLERY,
            isActive: true,
            file: null,
        },
        mode: 'onChange',
    })
    const fileInputRef = useRef<HTMLInputElement>(null)
    const selectedFile = uploadForm.watch('file')

    function submitUpload(values: WrapImageUploadValues) {
        const parsed = wrapImageUploadFormSchema.safeParse(values)
        if (!parsed.success) {
            applyZodErrors(parsed.error, uploadForm.setError, uploadForm.clearErrors)
            return
        }
        uploadForm.clearErrors()
        onAddImage(parsed.data.file, parsed.data.kind, parsed.data.isActive)
        uploadForm.reset({
            kind: parsed.data.kind,
            isActive: parsed.data.isActive,
            file: null,
        })
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    function handleMove(index: number, direction: -1 | 1) {
        const target = index + direction
        if (target < 0 || target >= orderedImages.length) {
            return
        }
        const reordered = [...orderedImages]
        const [moved] = reordered.splice(index, 1)
        reordered.splice(target, 0, moved)
        const orderedIds = reordered.map((image) => image.id)
        onReorderImages(orderedIds)
    }

    function handleRemove(imageId: string) {
        onRemoveImage(imageId)
    }

    function handleSave(image: WrapImageDTO, values: WrapImageMetadataValues) {
        if (values.kind === image.kind && values.isActive === image.isActive) {
            return
        }
        onUpdateImageMetadata(image.id, values.kind, values.isActive)
    }

    // Loading and permission-denied states (simulate with props/context in real app)
    const loading = false
    const permissionDenied = false

    if (loading) {
        return (
            <div className="flex h-48 items-center justify-center">
                <span className="mr-3 h-8 w-8 animate-spin rounded-full border-4 border-neutral-700 border-t-blue-500"></span>
                <span className="text-base text-neutral-300">Loading wrap assets...</span>
            </div>
        )
    }

    if (permissionDenied) {
        return (
            <div className="flex h-48 items-center justify-center">
                <Card className="border-red-700 bg-neutral-950/90 text-red-300">
                    <CardContent className="p-4 text-center">
                        <h2 className="mb-2 text-lg font-bold">Permission Denied</h2>
                        <p>
                            You do not have access to manage wrap assets. Please contact your
                            platform admin.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <Card className="border-neutral-800 bg-neutral-950/80 text-neutral-100">
                <CardHeader>
                    <CardTitle className="text-lg">Add a wrap asset</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={uploadForm.handleSubmit(submitUpload)}>
                        <FieldGroup className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.75fr)_auto] lg:items-end">
                            <Field
                                data-invalid={uploadForm.formState.errors.file ? true : undefined}
                            >
                                <FieldLabel htmlFor="wrap-image-upload">Image file</FieldLabel>
                                <Input
                                    id="wrap-image-upload"
                                    ref={fileInputRef}
                                    type="file"
                                    accept={ACCEPTED_WRAP_IMAGE_TYPES.join(',')}
                                    className="border-neutral-700 bg-neutral-950 text-neutral-100 file:mr-3 file:rounded-md file:border-0 file:bg-neutral-100 file:px-3 file:py-2 file:text-neutral-950"
                                    onChange={(event) => {
                                        const file = event.target.files?.[0] ?? null
                                        uploadForm.setValue('file', file, {
                                            shouldDirty: true,
                                            shouldTouch: true,
                                            shouldValidate: true,
                                        })
                                        uploadForm.clearErrors('root')
                                    }}
                                />
                                <FieldDescription>
                                    Use high-resolution assets for hero and visualizer texture
                                    roles.
                                </FieldDescription>
                                <FieldError errors={[uploadForm.formState.errors.file]} />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="wrap-image-kind">Asset role</FieldLabel>
                                <select
                                    id="wrap-image-kind"
                                    className="h-11 rounded-md border border-neutral-700 bg-neutral-950 px-3 text-sm text-neutral-100 outline-none transition focus-visible:border-neutral-400"
                                    {...uploadForm.register('kind')}
                                >
                                    {editableKinds.map((kind) => (
                                        <option key={kind} value={kind}>
                                            {labelKind(kind)}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                        </FieldGroup>
                        <Button
                            type="submit"
                            size="sm"
                            disabled={uploadForm.formState.isSubmitting || !selectedFile}
                        >
                            Upload Image
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="space-y-3">
                {orderedImages.length === 0 ? (
                    <Card className="border-neutral-800 bg-neutral-950/70 text-neutral-400">
                        <CardContent className="p-6 text-sm">
                            No images uploaded for this wrap yet.
                        </CardContent>
                    </Card>
                ) : (
                    orderedImages.map((image, index) => (
                        <WrapImageRow
                            key={image.id}
                            image={image}
                            index={index}
                            totalImages={orderedImages.length}
                            isPending={false}
                            onMove={handleMove}
                            onRemove={handleRemove}
                            onSave={handleSave}
                        />
                    ))
                )}
            </div>
        </div>
    )
}
