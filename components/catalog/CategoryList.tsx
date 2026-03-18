import { Button } from '@/components/ui/button'

interface CategoryListProps {
    categories?: any[]
    isPending?: boolean
    handleDeleteCategory?: (categoryId: string) => void
}

export function CategoryList({ categories, isPending, handleDeleteCategory }: CategoryListProps) {
    const safeCategories = categories ?? []
    const safeIsPending = isPending ?? false
    const safeHandleDeleteCategory = handleDeleteCategory ?? (() => {})
    return (
        <div className="space-y-2">
            {safeCategories.length === 0 ? (
                <div className="text-sm text-neutral-400">No categories created yet.</div>
            ) : (
                safeCategories.map((category) => (
                    <div
                        key={category.id}
                        className="flex items-center justify-between gap-3 border border-neutral-700 bg-neutral-900 p-2"
                    >
                        <p className="text-sm text-neutral-100">
                            {category.name}{' '}
                            <span className="text-xs text-neutral-400">({category.slug})</span>
                        </p>
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={safeIsPending}
                            onClick={() => safeHandleDeleteCategory(category.id)}
                        >
                            Remove
                        </Button>
                    </div>
                ))
            )}
        </div>
    )
}
