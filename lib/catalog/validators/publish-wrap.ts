import { PUBLISH_REQUIRED_WRAP_IMAGE_KINDS, type PublishRequiredWrapImageKind } from '../types'

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
