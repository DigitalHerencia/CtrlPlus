import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        // Prefer new tests folder but keep existing globs for backwards compatibility
        // Run only tests under the new tests/vitest tree during migration
        include: ['tests/vitest/**/*.{test,spec}.{ts,tsx}'],
        exclude: [
            'e2e/**',
            'tests/playwright/**',
            'node_modules/**',
            '.next/**',
            'playwright-report/**',
            'test-results/**',
        ],
        // Keep the existing root setup file for compatibility and add the new setup path
        setupFiles: ['./vitest.setup.ts', 'tests/vitest/setup/vitest.setup.ts'],
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, '.'),
            // Test-only shim - only active in test environments, not in production builds
            'server-only': resolve(__dirname, 'tests/test-shims/server-only.js'),
        },
    },
})
