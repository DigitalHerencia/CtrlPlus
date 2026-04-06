/**
 * DB helpers for Playwright tests (placeholder).
 * Implement seed/reset helpers that your E2E flows require.
 */
export async function resetTestDb(): Promise<void> {
    // Placeholder: call API endpoints or run prisma to reset/seed test data.
    return
}

export default async function globalSetup(): Promise<void> {
    await resetTestDb()
}
