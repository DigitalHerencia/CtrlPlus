import type { Prisma } from '@prisma/client'

/**
 * Admin transactional helpers (placeholder)
 * Keep DB model-specific logic here. Implement concrete transactional
 * operations as the domain needs them. This file intentionally avoids
 * referencing concrete models to remain a safe scaffold.
 */
export async function runAdminUnitOfWork(
    _tx: Prisma.TransactionClient,
    _work: () => Promise<void>
): Promise<void> {
    // Example usage:
    // await _tx.$transaction(async (tx) => {
    //   await tx.someModel.update(...)
    //   await tx.otherModel.create(...)
    // })

    // The scaffold does nothing by default - actions will implement real
    // transactional logic here when needed.
    await _work()
}
