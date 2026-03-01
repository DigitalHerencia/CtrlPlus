import type { WrapCatalogCreatePayloadContract, WrapCatalogDeletePayloadContract, WrapCatalogDeleteResultContract, WrapCatalogUpdatePayloadContract, WrapCatalogWriteResultContract } from '../../types/catalog';
import { wrapCatalogCreatePayloadSchema, wrapCatalogDeletePayloadSchema, wrapCatalogUpdatePayloadSchema } from '../../schemas/catalog';
import { createMutationAuditLogger } from '../audit/log-mutation-event';
import { requireAuth } from '../auth/require-auth';
import { requirePermission } from '../auth/require-permission';
import { safeRevalidatePath, safeRevalidateTag } from '../cache/invalidation';
import { runTransactionWithRetry, type TransactionRunner } from '../db/transaction';
import { type TenantScopedPrisma, tenantScopedPrisma } from '../db/prisma';
import { getCatalogItemTag, getCatalogListTag, getCatalogTenantTag } from '../fetchers/catalog';
import { requireTenant } from '../tenancy/require-tenant';
import { validateActionInput } from './shared';

export interface CreateWrapDesignActionInput {
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly payload: WrapCatalogCreatePayloadContract;
}

export interface DeleteWrapDesignActionInput {
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly payload: WrapCatalogDeletePayloadContract;
}

export interface UpdateWrapDesignActionInput {
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly payload: WrapCatalogUpdatePayloadContract;
}

export const CATALOG_MUTATION_INVALIDATION_PATHS = ['/catalog/wraps'] as const;

export interface InvalidateCatalogMutationInput {
  readonly tenantId: string;
  readonly wrapDesignId?: string;
}

export type CatalogMutationTransactionClient = Pick<
  TenantScopedPrisma,
  'createWrapDesign' | 'updateWrapDesign' | 'deleteWrapDesign' | 'getWrapDesignByTenant'
>;

const runCatalogMutationRunner: TransactionRunner<CatalogMutationTransactionClient> = async (
  callback,
) => callback(tenantScopedPrisma);

export function invalidateCatalogMutation(input: InvalidateCatalogMutationInput): void {
  safeRevalidateTag(getCatalogTenantTag(input.tenantId));
  safeRevalidateTag(getCatalogListTag(input.tenantId));

  for (const path of CATALOG_MUTATION_INVALIDATION_PATHS) {
    safeRevalidatePath(path);
  }

  if (!input.wrapDesignId) {
    return;
  }

  safeRevalidateTag(getCatalogItemTag(input.tenantId, input.wrapDesignId));
  safeRevalidatePath(`/catalog/wraps/${input.wrapDesignId}`);
}

export async function runCatalogMutationTransaction<TResult>(
  operation: (tx: CatalogMutationTransactionClient) => TResult | Promise<TResult>,
): Promise<TResult> {
  return runTransactionWithRetry(runCatalogMutationRunner, async (tx) => Promise.resolve(operation(tx)));
}

export async function createWrapDesign(
  input: CreateWrapDesignActionInput,
): Promise<WrapCatalogWriteResultContract> {
  const user = await requireAuth({
    headers: input.headers,
  });
  const tenantContext = requireTenant({
    headers: input.headers,
  });
  const tenantId = tenantContext.tenantId;

  await requirePermission({
    headers: input.headers,
    tenantId,
    permission: 'catalog:write',
    user,
  });

  const audit = createMutationAuditLogger({
    headers: input.headers,
    tenantId,
    source: 'server-action.catalog.create-wrap-design',
    eventPrefix: 'catalog.wrap.create',
  });

  try {
    const validatedPayload = validateActionInput(wrapCatalogCreatePayloadSchema, input.payload);
    const result = await runCatalogMutationTransaction((tx) => {
      const created = tx.createWrapDesign({
        tenantId,
        name: validatedPayload.name,
        description: validatedPayload.description,
        priceCents: validatedPayload.priceCents ?? 0,
        isPublished: false,
      });

      const minimalResult: WrapCatalogWriteResultContract = {
        id: created.id,
      };
      return minimalResult;
    });

    audit.succeeded({
      tenantId,
      actorUserId: user.userId,
      wrapDesignId: result.id,
    });
    invalidateCatalogMutation({
      tenantId,
      wrapDesignId: result.id,
    });

    return result;
  } catch (error) {
    audit.rejected({
      tenantId,
      actorUserId: user.userId,
      reason: error instanceof Error ? error.message : 'unknown_error',
    });
    throw error;
  }
}

export async function deleteWrapDesign(
  input: DeleteWrapDesignActionInput,
): Promise<WrapCatalogDeleteResultContract> {
  const user = await requireAuth({
    headers: input.headers,
  });
  const tenantContext = requireTenant({
    headers: input.headers,
  });
  const tenantId = tenantContext.tenantId;

  await requirePermission({
    headers: input.headers,
    tenantId,
    permission: 'catalog:write',
    user,
  });

  const audit = createMutationAuditLogger({
    headers: input.headers,
    tenantId,
    source: 'server-action.catalog.delete-wrap-design',
    eventPrefix: 'catalog.wrap.delete',
  });

  try {
    const validatedPayload = validateActionInput(wrapCatalogDeletePayloadSchema, input.payload);
    const deleted = await runCatalogMutationTransaction((tx) => {
      const existing = tx.getWrapDesignByTenant(tenantId, validatedPayload.id);
      if (!existing) {
        return false;
      }

      return tx.deleteWrapDesign(tenantId, validatedPayload.id);
    });
    const result: WrapCatalogDeleteResultContract = {
      id: validatedPayload.id,
      deleted,
    };

    audit.log({
      level: deleted ? 'info' : 'warn',
      suffix: deleted ? 'succeeded' : 'rejected',
      data: {
        tenantId,
        actorUserId: user.userId,
        wrapDesignId: validatedPayload.id,
        deleted,
      },
    });

    if (deleted) {
      invalidateCatalogMutation({
        tenantId,
        wrapDesignId: validatedPayload.id,
      });
    }

    return result;
  } catch (error) {
    audit.rejected({
      tenantId,
      actorUserId: user.userId,
      reason: error instanceof Error ? error.message : 'unknown_error',
    });
    throw error;
  }
}

export async function updateWrapDesign(
  input: UpdateWrapDesignActionInput,
): Promise<WrapCatalogWriteResultContract | null> {
  const user = await requireAuth({
    headers: input.headers,
  });
  const tenantContext = requireTenant({
    headers: input.headers,
  });
  const tenantId = tenantContext.tenantId;

  await requirePermission({
    headers: input.headers,
    tenantId,
    permission: 'catalog:write',
    user,
  });

  const audit = createMutationAuditLogger({
    headers: input.headers,
    tenantId,
    source: 'server-action.catalog.update-wrap-design',
    eventPrefix: 'catalog.wrap.update',
  });

  try {
    const validatedPayload = validateActionInput(wrapCatalogUpdatePayloadSchema, input.payload);
    const result = await runCatalogMutationTransaction((tx) => {
      const updated = tx.updateWrapDesign({
        tenantId,
        id: validatedPayload.id,
        name: validatedPayload.name,
        description: validatedPayload.description,
        priceCents: validatedPayload.priceCents,
        isPublished: validatedPayload.isPublished,
      });

      if (!updated) {
        return null;
      }

      const minimalResult: WrapCatalogWriteResultContract = {
        id: updated.id,
      };
      return minimalResult;
    });

    if (!result) {
      audit.log({
        level: 'warn',
        suffix: 'rejected',
        data: {
          tenantId,
          actorUserId: user.userId,
          wrapDesignId: validatedPayload.id,
          reason: 'wrap_design_not_found',
        },
      });
      return null;
    }

    audit.succeeded({
      tenantId,
      actorUserId: user.userId,
      wrapDesignId: result.id,
    });
    invalidateCatalogMutation({
      tenantId,
      wrapDesignId: result.id,
    });

    return result;
  } catch (error) {
    audit.rejected({
      tenantId,
      actorUserId: user.userId,
      reason: error instanceof Error ? error.message : 'unknown_error',
    });
    throw error;
  }
}
