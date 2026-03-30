import type { Prisma } from '@prisma/client'

/**
 * Reusable auth-related transactional helpers
 * Keep Prisma-specific logic here so actions can call these units inside tx blocks
 */
export async function createUserTx(
    tx: Prisma.TransactionClient,
    data: Prisma.UserCreateInput
) {
    return tx.user.create({ data })
}

export async function updateUserTx(
    tx: Prisma.TransactionClient,
    id: string,
    data: Prisma.UserUpdateInput
) {
    return tx.user.update({ where: { id }, data })
}
