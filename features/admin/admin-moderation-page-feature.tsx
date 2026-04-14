import { AdminModerationActionsPanel } from '@/components/admin/admin-moderation-actions-panel'
import { AdminModerationQueue } from '@/components/admin/admin-moderation-queue'
import { WorkspacePageIntro } from '@/components/shared/tenant-elements'
import { getFlaggedItems } from '@/lib/fetchers/admin.fetchers'

import { AdminModerationActionsClient } from './admin-moderation-actions.client'

const TENANT_ID = 'single-store'

export async function AdminModerationPageFeature() {
    const flaggedItems = await getFlaggedItems(TENANT_ID)

    return (
        <div className="space-y-6">
            <WorkspacePageIntro
                label="Admin"
                title="Moderation queue"
                description="Resolve flagged items quickly to keep your storefront and visualizer experience safe, professional, and customer-ready."
            />

            <AdminModerationQueue
                items={flaggedItems}
                actionsSlot={<span className="text-xs text-neutral-500">Select a row action</span>}
            />

            <section className="space-y-2">
                {flaggedItems.map((item) => (
                    <article
                        key={`${item.id}-actions`}
                        className="flex items-center justify-between rounded border border-neutral-800 bg-neutral-950/70 px-3 py-2"
                    >
                        <p className="text-sm text-neutral-300">
                            {item.resourceType} · {item.resourceId}
                        </p>
                        <AdminModerationActionsPanel>
                            <AdminModerationActionsClient flagId={item.id} status={item.status} />
                        </AdminModerationActionsPanel>
                    </article>
                ))}
            </section>
        </div>
    )
}
