import type { ChangeEventHandler } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface WrapImageUploaderProps {
    id: string
    label: string
    accept?: string
    onChange?: ChangeEventHandler<HTMLInputElement>
}

export function WrapImageUploader({ id, label, accept, onChange }: WrapImageUploaderProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <Input id={id} type="file" accept={accept} onChange={onChange} />
        </div>
    )
}
