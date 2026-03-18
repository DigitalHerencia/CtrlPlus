import React from 'react'
import { Controller } from 'react-hook-form'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'

interface CategoryFormProps {
    categoryControl?: unknown
    categoryErrors?: unknown
    handleCategorySubmit?: (fn: (data: unknown) => void) => (event: React.FormEvent) => void
    onCreateCategory?: (data: unknown) => void
    isPending?: boolean
}

export function CategoryForm({
    categoryControl,
    categoryErrors,
    handleCategorySubmit,
    onCreateCategory,
    isPending,
}: CategoryFormProps) {
    const safeHandleCategorySubmit = handleCategorySubmit ?? (() => () => {})
    const safeOnCreateCategory = onCreateCategory ?? (() => {})
    const safeCategoryControl = categoryControl ?? {}
    const safeCategoryErrors = categoryErrors ?? {}
    const safeIsPending = isPending ?? false
    return (
        <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
            <CardHeader>
                <CardTitle>Create Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <form
                    className="grid gap-3 md:grid-cols-[1fr_1fr_auto]"
                    onSubmit={safeHandleCategorySubmit(safeOnCreateCategory)}
                >
                    <Controller
                        name="name"
                        control={safeCategoryControl}
                        render={({ field }) => (
                            <Input
                                {...field}
                                className="border border-neutral-700 bg-neutral-100 px-2 py-1 text-neutral-900 placeholder:text-neutral-900"
                                placeholder="Category name"
                            />
                        )}
                    />
                    {safeCategoryErrors.name && (
                        <span className="text-xs text-red-500">
                            {safeCategoryErrors.name.message}
                        </span>
                    )}
                    <Controller
                        name="slug"
                        control={safeCategoryControl}
                        render={({ field }) => (
                            <Input
                                {...field}
                                className="border border-neutral-700 bg-neutral-100 px-2 py-1 text-neutral-900 placeholder:text-neutral-900"
                                placeholder="category-slug"
                            />
                        )}
                    />
                    {safeCategoryErrors.slug && (
                        <span className="text-xs text-red-500">
                            {safeCategoryErrors.slug.message}
                        </span>
                    )}
                    <Button type="submit" disabled={safeIsPending}>
                        Add Category
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
