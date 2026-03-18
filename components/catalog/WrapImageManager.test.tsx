import { fireEvent, render, screen } from '@testing-library/react'
import { WrapImageManager } from './WrapImageManager'

const mockImages: Array<{
    id: string
    url: string
    kind: 'hero' // Use valid WrapImageKind
    isActive: boolean
    version: number
    contentHash: string
    displayOrder: number
    metadata: object
}> = [
    {
        id: 'img1',
        url: 'https://example.com/img1.jpg',
        kind: 'hero',
        isActive: true,
        version: 1,
        contentHash: 'hash1',
        displayOrder: 0,
        metadata: {},
    },
]
const mockCallbacks = {
    onAddImage: jest.fn(),
    onRemoveImage: jest.fn(),
    onReorderImages: jest.fn(),
    onUpdateImageMetadata: jest.fn(),
}

const renderManager = (props = {}) =>
    render(<WrapImageManager wrapId="wrap1" images={mockImages} {...mockCallbacks} {...props} />)

describe('WrapImageManager', () => {
    it('renders empty state when no images', () => {
        renderManager({ images: [] })
        expect(screen.getByText(/no images found/i)).toBeInTheDocument()
    })

    it('renders loading state', () => {
        renderManager({ loading: true })
        expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })

    it('renders error state', () => {
        renderManager({ error: 'Image error' })
        expect(screen.getByText(/image error/i)).toBeInTheDocument()
    })

    it('renders permission denied state', () => {
        renderManager({ permissionDenied: true })
        expect(screen.getByText(/permission denied/i)).toBeInTheDocument()
    })

    it('calls mutation callbacks', () => {
        renderManager()
        fireEvent.click(screen.getByRole('button', { name: /add image/i }))
        expect(mockCallbacks.onAddImage).toHaveBeenCalled()
    })

    it('renders image details and shadcn/ui blocks', () => {
        renderManager()
        expect(screen.getByAltText(/img1/i)).toBeInTheDocument()
        // Check for shadcn/ui card
        expect(screen.getByRole('region', { name: /image card/i })).toBeInTheDocument()
    })
})
