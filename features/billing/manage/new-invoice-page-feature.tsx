import { createInvoice } from '@/lib/actions/billing.actions'

import { InvoiceEditorFormClient } from './invoice-editor-form.client'

export function NewInvoicePageFeature() {
    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-neutral-100">Issue Invoice</h1>
            <InvoiceEditorFormClient submitLabel="Create Invoice" onSubmitInvoice={createInvoice} />
        </div>
    )
}
