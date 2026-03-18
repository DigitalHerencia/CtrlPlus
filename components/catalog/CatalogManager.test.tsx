import { fireEvent, render, screen } from '@testing-library/react'
import { CatalogManager } from './CatalogManager'

// Mock props for CatalogManager
const mockCategories: Array<{ id: string; name: string; slug: string }> = [
    { id: 'cat1', name: 'Category 1', slug: 'category-1' },
]

const mockWraps: Array<{
    id: string
    name: string
    description: string | null
    price: number
    isHidden: boolean
    installationMinutes: number | null
    images: Array<{
        id: string
        url: string
        kind: 'hero'
        isActive: boolean
        version: number
        contentHash: string
        displayOrder: number
    }>
    categories: typeof mockCategories
    createdAt: Date
    updatedAt: Date
}> = [
    {
        id: 'wrap1',
        name: 'Test Wrap',
        description: 'A test wrap for unit testing.',
        price: 1000,
        isHidden: false,
        installationMinutes: 60,
        images: [
            {
                id: 'img1',
                url: 'https://example.com/img1.jpg',
                kind: 'hero',
                isActive: true,
                version: 1,
                contentHash: 'hash1',
                displayOrder: 0,
            },
        ],
        categories: mockCategories,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
    },
]

// Helper to render CatalogManager with minimal props
const mockCallbacks = {
    onAddImage: jest.fn(),
    onRemoveImage: jest.fn(),
    onReorderImages: jest.fn(),
    onUpdateImageMetadata: jest.fn(),
}

const renderManager = (props = {}) =>
    render(
        <CatalogManager
            wraps={mockWraps}
            categories={mockCategories}
            {...mockCallbacks}
            {...props}
        />
    )

describe('CatalogManager', () => {
    it('renders empty state when no wraps', () => {
        renderManager({ wraps: [] })
        expect(screen.getByText(/no wraps found/i)).toBeInTheDocument()
    })

    it('renders loading state', () => {
        renderManager({ loading: true })
        expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })

    it('renders error state', () => {
        renderManager({ error: 'Something went wrong' })
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })

    it('renders permission denied state', () => {
        renderManager({ permissionDenied: true })
        expect(screen.getByText(/permission denied/i)).toBeInTheDocument()
    })

    it('calls image mutation callbacks', () => {
        renderManager()
        // Simulate add image
        fireEvent.click(screen.getByRole('button', { name: /add image/i }))
        expect(mockCallbacks.onAddImage).toHaveBeenCalled()
    })

    it('renders wrap details and shadcn/ui blocks', () => {
        renderManager()
        expect(screen.getByText(/test wrap/i)).toBeInTheDocument()
        // Check for shadcn/ui card
        expect(screen.getByRole('region', { name: /wrap card/i })).toBeInTheDocument()
    })
})
