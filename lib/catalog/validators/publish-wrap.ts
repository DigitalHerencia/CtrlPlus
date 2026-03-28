import {
    PUBLISH_REQUIRED_WRAP_IMAGE_KINDS,
    type CatalogAssetReadinessDTO,
    type PublishRequiredWrapImageKind,
} from '@/types/catalog'

export interface WrapPublishAssetRoleSnapshot {
    kind: string
    isActive: boolean
}

export function getMissingRequiredAssetRolesForPublish(
    images: WrapPublishAssetRoleSnapshot[]
): PublishRequiredWrapImageKind[] {
    const activeRoles = new Set(images.filter((image) => image.isActive).map((image) => image.kind))

    return PUBLISH_REQUIRED_WRAP_IMAGE_KINDS.filter((kind) => !activeRoles.has(kind))
}

export function assertWrapCanBePublished(images: WrapPublishAssetRoleSnapshot[]): void {
    const missingKinds = getMissingRequiredAssetRolesForPublish(images)

    if (missingKinds.length === 0) {
        return
    }

    throw new Error(`Cannot publish wrap. Missing active asset roles: ${missingKinds.join(', ')}`)
}

export function assertWrapIsPublishReady(readiness: CatalogAssetReadinessDTO): void {
    if (readiness.canPublish) {
        return
    }

    const blockingMessages = readiness.issues
        .filter((issue) => issue.blocking)
        .map((issue) => issue.message)

    throw new Error(
        `Cannot publish wrap. ${blockingMessages.length > 0 ? blockingMessages.join(' ') : 'Wrap is not publish-ready.'}`
    )
}
