import type { Prisma } from '@prisma/client'

/**
 * Catalog transactional helpers - e.g., create wrap + images in a single tx
 */
export async function createWrapWithImagesTx(
    tx: Prisma.TransactionClient,
    wrapData: Prisma.WrapCreateInput
) {
    // Caller should pass the proper shape. This helper keeps multi-table
    // catalog writes in one transactional unit.
    return tx.wrap.create({ data: wrapData })
}
