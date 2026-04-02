'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'

export function BookingsManagerBulkActionsClient() {
    const [isRunning, setIsRunning] = useState(false)

    return (
        <div className="flex items-center gap-2">
            <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isRunning}
                onClick={() => {
                    setIsRunning(true)
                    queueMicrotask(() => setIsRunning(false))
                }}
            >
                {isRunning ? 'Applying…' : 'Bulk Review'}
            </Button>
        </div>
    )
}
