import Link from 'next/link'
import { WorkspaceEmptyState } from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'
import { type WrapDTO } from '@/lib/catalog/types'
import { WrapCard } from './WrapCard'

interface WrapGridProps {
    wraps: WrapDTO[]
    canManageCatalog?: boolean
}

export function WrapGrid({ wraps, canManageCatalog = false }: WrapGridProps) {
    if (wraps.length === 0) {
        return (
            <WorkspaceEmptyState
                title="No wraps found"
                description={
                    canManageCatalog
                        ? 'Your catalog is empty. Add your first wrap to power catalog and visualizer flows.'
                        : 'Try adjusting your search or filter criteria to find the wrap package you need.'
                }
                action={
                    canManageCatalog ? (
                        <Button asChild>
                            <Link href="/catalog/manage">Open Catalog Manager</Link>
                        </Button>
                    ) : undefined
                }
            />
        )
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wraps.map((wrap) => (
                <WrapCard
                    key={wrap.id}
                    wrap={{
                        id: wrap.id,
                        name: wrap.name,
                        description: wrap.description,
                        price: wrap.price,
                        installationMinutes: wrap.installationMinutes,
                        images: wrap.images,
                    }}
                />
            ))}
        </div>
    )
}
