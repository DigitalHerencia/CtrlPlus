import type { ReactNode } from 'react'

export type DocNavItem = {
    slug: string
    title: string
    description: string
}

export type DocSection = {
    id: string
    title: string
    items: DocNavItem[]
}

export type DocHeading = {
    id: string
    title: string
}

export type DocPage = {
    slug: string
    title: string
    description: string
    sectionId: string
    readTime: string
    updatedAt: string
    headings: DocHeading[]
    content: ReactNode
}
