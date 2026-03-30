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
