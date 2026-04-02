import { Label } from '@/components/ui/label'

interface CatalogSortSelectProps {
    id: string
    label: string
    value: string
    options: Array<{ label: string; value: string }>
    onChange: (value: string) => void
}

export function CatalogSortSelect({ id, label, value, options, onChange }: CatalogSortSelectProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <select
                id={id}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="h-10 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 text-sm text-neutral-100"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
}
