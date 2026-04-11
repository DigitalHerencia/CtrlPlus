'use client'
/**
 * Features — TODO: brief module description.
 * Domain: features
 * Public: TODO (yes/no)
 */

import { Button } from '@/components/ui/button'

interface InvoiceManagerBulkActionsClientProps {
    selectedCount: number
    onClearSelection: () => void
}

/**
 * InvoiceManagerBulkActionsClient — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function InvoiceManagerBulkActionsClient({
    selectedCount,
    onClearSelection,
}: InvoiceManagerBulkActionsClientProps) {
    if (selectedCount === 0) {
        return null
    }

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-400">{selectedCount} selected</span>
            <Button type="button" size="sm" variant="outline" onClick={onClearSelection}>
                Clear
            </Button>
        </div>
    )
}
