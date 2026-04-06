import 'server-only'

import {
    buildCloudinaryDeliveryUrl,
    type CloudinaryAssetVariant,
    type CloudinaryStoredAsset,
} from '@/lib/integrations/cloudinary'

interface VisualizerAssetDeliveryInput
    extends Pick<
        CloudinaryStoredAsset,
        'publicId' | 'version' | 'resourceType' | 'deliveryType' | 'format'
    > {
    legacyUrl?: string | null
}

export async function resolveVisualizerAssetDeliveryUrl(
    asset: VisualizerAssetDeliveryInput,
    variant: CloudinaryAssetVariant = 'detail'
) {
    const signedCloudinaryUrl = await buildCloudinaryDeliveryUrl(asset, variant)
    if (signedCloudinaryUrl) {
        return signedCloudinaryUrl
    }

    return asset.legacyUrl ?? null
}
