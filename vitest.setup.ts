import { config } from 'dotenv'
import '@testing-library/jest-dom/vitest'

config({ path: '.env.local' })

delete process.env.CLOUDINARY_URL
