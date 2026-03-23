import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['**/*.{test,spec}.{ts,tsx}'],
        exclude: [
            'e2e/**',
            'node_modules/**',
            '.next/**',
            'playwright-report/**',
            'test-results/**',
        ],
        setupFiles: ['./vitest.setup.ts'],
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, '.'),
            'server-only': resolve(__dirname, 'test/mocks/server-only.ts'),
        },
    },
})
