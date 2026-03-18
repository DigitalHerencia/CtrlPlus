'use client'

import { Button } from '@/components/ui/button'
import type { WrapCategoryDTO, WrapDTO } from '@/lib/catalog/types'
import Link from 'next/link'
import { CatalogManagerHeader } from './CatalogManagerHeader'
import { CatalogManagerStatus } from './CatalogManagerStatus'
import { CategoryForm } from './CategoryForm'
import { CategoryList } from './CategoryList'
import { WrapList } from './WrapList'

interface CatalogManagerProps {
    wraps: WrapDTO[]
    categories: WrapCategoryDTO[]
    error?: string
    status?: string
    isLoading?: boolean
    permissionDenied?: boolean
    isPending?: boolean
    wrapControl?: unknown
    wrapErrors?: unknown
    handleWrapUpdate?: (wrapId: string, event: React.FormEvent) => void
    handleWrapDelete?: (wrapId: string) => void
    categoryControl?: unknown
    categoryErrors?: unknown
    handleCategorySubmit?: (fn: (data: unknown) => void) => (event: React.FormEvent) => void
    onCreateCategory?: (data: unknown) => void
    handleDeleteCategory?: (categoryId: string) => void
    categorySelections?: Record<string, Set<string>>
    toggleWrapCategory?: (wrapId: string, categoryId: string) => void
    saveWrapCategories?: (wrapId: string) => void
    handleAddImage?: (wrapId: string, file: File, kind: string, isActive: boolean) => void
    handleRemoveImage?: (wrapId: string, imageId: string) => void
    handleReorderImages?: (wrapId: string, orderedIds: string[]) => void
    handleUpdateImageMetadata?: (
        wrapId: string,
        imageId: string,
        kind: string,
        isActive: boolean
    ) => void
}
export function CatalogManager({
    wraps,
    categories,
    error,
    status,
    isLoading,
    permissionDenied,
    isPending,
    wrapControl,
    wrapErrors,
    handleWrapUpdate,
    handleWrapDelete,
    categoryControl,
    categoryErrors,
    handleCategorySubmit,
    onCreateCategory,
    handleDeleteCategory,
    categorySelections,
    toggleWrapCategory,
    saveWrapCategories,
    handleAddImage,
    handleRemoveImage,
    handleReorderImages,
    handleUpdateImageMetadata,
}: CatalogManagerProps) {
    // Provide default values for required props
    const safeHandleCategorySubmit = handleCategorySubmit ?? (() => () => {})
    const safeOnCreateCategory = onCreateCategory ?? (() => {})
    const safeHandleDeleteCategory = handleDeleteCategory ?? (() => {})
    const safeHandleWrapUpdate = handleWrapUpdate ?? (() => {})
    const safeHandleWrapDelete = handleWrapDelete ?? (() => {})
    const safeCategorySelections = categorySelections ?? {}
    const safeToggleWrapCategory = toggleWrapCategory ?? (() => {})
    const safeSaveWrapCategories = saveWrapCategories ?? (() => {})
    const safeHandleAddImage = handleAddImage ?? (() => {})
    const safeHandleRemoveImage = handleRemoveImage ?? (() => {})
    const safeHandleReorderImages = handleReorderImages ?? (() => {})
    const safeHandleUpdateImageMetadata = handleUpdateImageMetadata ?? (() => {})
    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <span className="mr-3 h-12 w-12 animate-spin rounded-full border-4 border-neutral-700 border-t-blue-500"></span>
                <span className="text-lg text-neutral-300">Loading catalog...</span>
            </div>
        )
    }
    if (permissionDenied) {
        return (
            <div className="flex h-96 items-center justify-center">
                <span className="text-lg text-red-300">Permission Denied</span>
            </div>
        )
    }
    return (
        <div className="space-y-6">
            <CatalogManagerHeader title="Catalog Manager" />
            <Button asChild variant="outline" size="sm">
                <Link href="/catalog">Back to Catalog</Link>
            </Button>
            <CatalogManagerStatus error={error} status={status} />
            <CategoryForm
                categoryControl={categoryControl}
                categoryErrors={categoryErrors}
                handleCategorySubmit={safeHandleCategorySubmit}
                onCreateCategory={safeOnCreateCategory}
                isPending={!!isPending}
            />
            <CategoryList
                categories={categories}
                isPending={!!isPending}
                handleDeleteCategory={safeHandleDeleteCategory}
            />
            <WrapForm></WrapForm>
            <WrapList
                wraps={wraps}
                categories={categories}
                categorySelections={safeCategorySelections}
                toggleWrapCategory={safeToggleWrapCategory}
                saveWrapCategories={safeSaveWrapCategories}
                handleWrapUpdate={safeHandleWrapUpdate}
                handleWrapDelete={safeHandleWrapDelete}
                handleAddImage={safeHandleAddImage}
                handleRemoveImage={safeHandleRemoveImage}
                handleReorderImages={safeHandleReorderImages}
                handleUpdateImageMetadata={safeHandleUpdateImageMetadata}
                isPending={!!isPending}
            />
        </div>
    )
}
