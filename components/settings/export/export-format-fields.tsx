/**
 * @introduction Components — TODO: short one-line summary of export-format-fields.tsx
 *
 * @description TODO: longer description for export-format-fields.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface ExportFormatFieldsProps {
    format: 'json' | 'csv'
    onFormatChange: (value: 'json' | 'csv') => void
}

/**
 * ExportFormatFields — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function ExportFormatFields({ format, onFormatChange }: ExportFormatFieldsProps) {
    return (
        <div className="space-y-2">
            <Label>Export Format</Label>
            <div className="flex items-center gap-2">
                <Input
                    id="format-json"
                    type="radio"
                    name="export-format"
                    checked={format === 'json'}
                    onChange={() => onFormatChange('json')}
                    className="h-4 w-4"
                />
                <Label htmlFor="format-json">JSON</Label>
            </div>
            <div className="flex items-center gap-2">
                <Input
                    id="format-csv"
                    type="radio"
                    name="export-format"
                    checked={format === 'csv'}
                    onChange={() => onFormatChange('csv')}
                    className="h-4 w-4"
                />
                <Label htmlFor="format-csv">CSV</Label>
            </div>
        </div>
    )
}
