import type { Prisma } from '@prisma/client'

/**
 * Visualizer transactional helpers (scaffold)
 * Keep visualizer-specific DB writes here. This scaffold intentionally
 * avoids assuming exact prisma model types so it remains safe across schema
 * variations.
 */
export async function createPreviewTx(
    _tx: Prisma.TransactionClient,
    _previewData: unknown
): Promise<unknown> {
    // Implement domain-specific preview persistence here when schema is known
    return Promise.resolve(null)
}
