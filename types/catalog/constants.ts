export const WrapStatus = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    DRAFT: 'DRAFT',
} as const

export type WrapStatus = (typeof WrapStatus)[keyof typeof WrapStatus]

export const WrapCategory = {
    FULL_WRAP: 'FULL_WRAP',
    PARTIAL_WRAP: 'PARTIAL_WRAP',
    ACCENT: 'ACCENT',
    PAINT_PROTECTION_FILM: 'PAINT_PROTECTION_FILM',
} as const

export type WrapCategory = (typeof WrapCategory)[keyof typeof WrapCategory]

export const WrapImageKind = {
    HERO: 'hero',
    VISUALIZER_TEXTURE: 'visualizer_texture',
    VISUALIZER_MASK_HINT: 'visualizer_mask_hint',
    GALLERY: 'gallery',
} as const

export type WrapImageKind = (typeof WrapImageKind)[keyof typeof WrapImageKind]

export const wrapImageKindValues = [
    WrapImageKind.HERO,
    WrapImageKind.VISUALIZER_TEXTURE,
    WrapImageKind.VISUALIZER_MASK_HINT,
    WrapImageKind.GALLERY,
] as const

export const PUBLISH_REQUIRED_WRAP_IMAGE_KINDS = [
    WrapImageKind.HERO,
    WrapImageKind.VISUALIZER_TEXTURE,
] as const

export type PublishRequiredWrapImageKind = (typeof PUBLISH_REQUIRED_WRAP_IMAGE_KINDS)[number]
