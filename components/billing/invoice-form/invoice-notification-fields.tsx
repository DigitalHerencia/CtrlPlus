import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface InvoiceNotificationFieldsProps {
    message: string
    onMessageChange: (value: string) => void
}

export function InvoiceNotificationFields({
    message,
    onMessageChange,
}: InvoiceNotificationFieldsProps) {
    return (
        <div className="grid gap-2">
            <Label htmlFor="invoice-notification">Notification Message</Label>
            <Textarea
                id="invoice-notification"
                value={message}
                onChange={(event) => onMessageChange(event.target.value)}
            />
        </div>
    )
}
