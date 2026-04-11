'use client'
/**
 * Features — TODO: brief module description.
 * Domain: features
 * Public: TODO (yes/no)
 */

import { useState, useTransition } from 'react'

import { DataExportPanel } from '@/components/settings/export/data-export-panel'
import { ExportFormatFields } from '@/components/settings/export/export-format-fields'
import { ExportHistoryTable } from '@/components/settings/export/export-history-table'
import { Button } from '@/components/ui/button'
import { type ExportHistoryRowDTO } from '@/types/settings.types'

interface ExportDataActionsClientProps {
    tenantId: string
    history: ExportHistoryRowDTO[]
    onExport: (input: { tenantId: string; format: 'json' | 'csv' }) => Promise<unknown>
}

/**
 * ExportDataActionsClient — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function ExportDataActionsClient({
    tenantId,
    history,
    onExport,
}: ExportDataActionsClientProps) {
    const [format, setFormat] = useState<'json' | 'csv'>('json')
    const [isPending, startTransition] = useTransition()
    const [message, setMessage] = useState<string | null>(null)

    function handleExport() {
        setMessage(null)
        startTransition(async () => {
            try {
                await onExport({ tenantId, format })
                setMessage('Export request queued.')
            } catch (error) {
                setMessage(
                    error instanceof Error ? error.message : 'Unable to queue export request.'
                )
            }
        })
    }

    return (
        <DataExportPanel>
            <ExportFormatFields format={format} onFormatChange={setFormat} />
            <div className="flex justify-end">
                <Button type="button" onClick={handleExport} disabled={isPending}>
                    {isPending ? 'Queuing…' : 'Request Export'}
                </Button>
            </div>
            {message ? <p className="text-sm text-neutral-300">{message}</p> : null}
            <ExportHistoryTable rows={history} />
        </DataExportPanel>
    )
}
