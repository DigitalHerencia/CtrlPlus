/**
 * @introduction Components — TODO: short one-line summary of wrap-detail-specs.tsx
 *
 * @description TODO: longer description for wrap-detail-specs.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { Card, CardContent } from '@/components/ui/card'
import type { CatalogDetailDTO } from '@/types/catalog.types'

interface WrapDetailSpecsProps {
    wrap: CatalogDetailDTO
    canManageCatalog: boolean
}

/**
 * WrapDetailSpecs — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function WrapDetailSpecs({ wrap, canManageCatalog }: WrapDetailSpecsProps) {
    if (!canManageCatalog) {
        return null
    }

    if (
        wrap.readiness.missingRequiredAssetRoles.length === 0 &&
        wrap.readiness.issues.length === 0
    ) {
        return null
    }

    return (
        <Card className="border-neutral-800 bg-neutral-950/80 text-neutral-100">
            <CardContent className="space-y-3 pt-6">
                {wrap.readiness.missingRequiredAssetRoles.length > 0 ? (
                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-100">
                        Missing required roles:{' '}
                        {wrap.readiness.missingRequiredAssetRoles.join(', ')}
                    </div>
                ) : null}
                {wrap.readiness.issues.length > 0 ? (
                    <div className="rounded-lg border border-neutral-800 bg-neutral-900/80 p-3 text-sm text-neutral-200">
                        <ul className="space-y-2">
                            {wrap.readiness.issues.map((issue) => (
                                <li key={issue.code}>{issue.message}</li>
                            ))}
                        </ul>
                    </div>
                ) : null}
            </CardContent>
        </Card>
    )
}
