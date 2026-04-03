import Link from 'next/link'

import { WorkspacePageContextCard, WorkspacePageIntro } from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'
import { InvoiceEditorFormClient } from './invoice-editor-form.client'

export function NewInvoicePageFeature() {
    return (
        <div className="space-y-6">
            <WorkspacePageIntro
                label="Billing"
                title="Issue Invoice"
                description="Create a polished invoice that clearly communicates value, timing, and payment expectations."
            />
            <WorkspacePageContextCard title="Manager Navigation" description="Return to invoice operations">
                <Button asChild variant="outline">
                    <Link href="/billing/manage">Back to Manager</Link>
                </Button>
            </WorkspacePageContextCard>
            <InvoiceEditorFormClient submitLabel="Create Invoice" />
        </div>
    )
}
