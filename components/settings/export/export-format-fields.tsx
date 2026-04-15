
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface ExportFormatFieldsProps {
    format: 'json' | 'csv'
    onFormatChange: (value: 'json' | 'csv') => void
}


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
