import { config } from 'dotenv'
import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'
import './server-only'
import './test-utils'

// Provide a global mock for server-only to avoid runtime errors when server-only
// modules are imported during unit tests (some helpers import server-only).
vi.mock('server-only', () => ({}))

// Mock Clerk server helpers to avoid importing server-only through the
// `@clerk/nextjs` package during unit tests.
vi.mock('@clerk/nextjs/server', () => ({ auth: async () => ({ userId: null }) }))

// Load local env for tests where appropriate
config({ path: '.env.local' })

// Prevent accidental use of CLOUDINARY in unit tests unless explicitly configured
delete process.env.CLOUDINARY_URL

export {}
