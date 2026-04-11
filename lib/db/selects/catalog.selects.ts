/**
 * @introduction Db — TODO: short one-line summary of catalog.selects.ts
 *
 * @description TODO: longer description for catalog.selects.ts. Keep it short — one or two sentences.
 * Domain: db
 * Public: TODO (yes/no)
 */
/**
 * wrapDTOFields — TODO: brief description.
 */
export const wrapDTOFields = {
    id: true,
    name: true,
    description: true,
    price: true,
    isHidden: true,
    installationMinutes: true,
    aiPromptTemplate: true,
    aiNegativePrompt: true,
    createdAt: true,
    updatedAt: true,
    images: {
        where: { deletedAt: null },
        select: {
            id: true,
            url: true,
            kind: true,
            isActive: true,
            version: true,
            contentHash: true,
            cloudinaryAssetId: true,
            cloudinaryPublicId: true,
            cloudinaryVersion: true,
            cloudinaryResourceType: true,
            cloudinaryDeliveryType: true,
            cloudinaryAssetFolder: true,
            mimeType: true,
            format: true,
            bytes: true,
            width: true,
            height: true,
            originalFileName: true,
            displayOrder: true,
        },
        orderBy: { displayOrder: 'asc' },
    },
    categoryMappings: {
        select: {
            category: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    deletedAt: true,
                },
            },
        },
    },
} as const
