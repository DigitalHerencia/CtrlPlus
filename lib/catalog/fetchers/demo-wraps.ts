import { WrapImageKind } from '@/types/catalog/constants'
import type { WrapCategoryDTO, WrapDTO, WrapImageDTO } from '@/types/catalog/domain'

export const EXAMPLE_WRAP_ID = 'demo-lorem-ipsum-phoenix'
const EXAMPLE_WRAP_CATEGORY_ID = 'demo-showcase'
const EXAMPLE_CREATED_AT = new Date('2026-03-21T12:00:00.000Z')

const EXAMPLE_WRAP_CATEGORY: WrapCategoryDTO = {
    id: EXAMPLE_WRAP_CATEGORY_ID,
    name: 'Demo Showcase',
    slug: 'demo-showcase',
}

const EXAMPLE_WRAP_IMAGES: WrapImageDTO[] = [
    {
        id: 'demo-lorem-ipsum-hero',
        url: '/catalog-demo/lorem-ipsum-hero.png',
        kind: WrapImageKind.HERO,
        isActive: true,
        version: 1,
        contentHash: 'demo-lorem-ipsum-hero',
        displayOrder: 0,
    },
    {
        id: 'demo-lorem-ipsum-texture',
        url: '/catalog-demo/lorem-ipsum-alt.png',
        kind: WrapImageKind.VISUALIZER_TEXTURE,
        isActive: true,
        version: 1,
        contentHash: 'demo-lorem-ipsum-texture',
        displayOrder: 1,
    },
    {
        id: 'demo-lorem-ipsum-gallery-hero',
        url: '/catalog-demo/lorem-ipsum-hero.png',
        kind: WrapImageKind.GALLERY,
        isActive: true,
        version: 1,
        contentHash: 'demo-lorem-ipsum-gallery-hero',
        displayOrder: 2,
    },
    {
        id: 'demo-lorem-ipsum-gallery-alt',
        url: '/catalog-demo/lorem-ipsum-alt.png',
        kind: WrapImageKind.GALLERY,
        isActive: true,
        version: 1,
        contentHash: 'demo-lorem-ipsum-gallery-alt',
        displayOrder: 3,
    },
    {
        id: 'demo-lorem-ipsum-gallery-logo',
        url: '/catalog-demo/lorem-ipsum-logo.png',
        kind: WrapImageKind.GALLERY,
        isActive: true,
        version: 1,
        contentHash: 'demo-lorem-ipsum-gallery-logo',
        displayOrder: 4,
    },
]

const EXAMPLE_WRAP: WrapDTO = {
    id: EXAMPLE_WRAP_ID,
    name: 'Lorem Ipsum Phoenix',
    description:
        'Demo-ready showcase wrap with a clickable hero card, alternate vehicle angles, and logo artwork for product-gallery walkthroughs.',
    price: 265000,
    isHidden: false,
    installationMinutes: 300,
    aiPromptTemplate: null,
    aiNegativePrompt: null,
    images: EXAMPLE_WRAP_IMAGES,
    categories: [EXAMPLE_WRAP_CATEGORY],
    createdAt: EXAMPLE_CREATED_AT,
    updatedAt: EXAMPLE_CREATED_AT,
}

export function getExampleCatalogWraps(): WrapDTO[] {
    return [EXAMPLE_WRAP]
}

export function getExampleCatalogWrapById(wrapId: string): WrapDTO | null {
    return wrapId === EXAMPLE_WRAP_ID ? EXAMPLE_WRAP : null
}

export function getExampleWrapCategories(): WrapCategoryDTO[] {
    return [EXAMPLE_WRAP_CATEGORY]
}

export function isExampleCatalogWrapId(wrapId: string): boolean {
    return wrapId === EXAMPLE_WRAP_ID
}
