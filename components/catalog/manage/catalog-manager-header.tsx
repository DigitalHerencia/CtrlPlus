import type { ReactNode } from 'react'

import { CatalogPageHeader } from '@/components/catalog/catalog-page-header'

interface CatalogManagerHeaderProps {
    total: number
    actions?: ReactNode
}

export function CatalogManagerHeader({ total, actions }: CatalogManagerHeaderProps) {
    return (
        <CatalogPageHeader
            label="Catalog Manager"
            title="Catalog CMS"
            description="Manage wrap products, visual assets, and visualizer readiness."
            actions={actions}
            detail={
                <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">
                        Managed Wraps
                    </p>
                    <p className="text-3xl font-black text-neutral-100">{total}</p>
                </div>
            }
        />
    )
}
