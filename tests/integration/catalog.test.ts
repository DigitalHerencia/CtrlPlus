import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createWrapDesign } from '../../lib/actions/catalog';
import { deleteWrapDesign } from '../../lib/actions/catalog';
import { updateWrapDesign } from '../../lib/actions/catalog';
import { ActionInputValidationError } from '../../lib/actions/shared';
import { PermissionError } from '../../lib/auth/require-permission';
import * as cacheInvalidation from '../../lib/cache/invalidation';
import { tenantScopedPrisma } from '../../lib/db/prisma';
import { getWrapDesign, listWrapDesigns } from '../../lib/fetchers/catalog';
import { catalogStore } from '../../lib/fetchers/catalog';
import { TenantAccessError } from '../../lib/tenancy/require-tenant';

const ownerHeadersAcme = {
  host: 'acme.localhost:3000',
  'x-clerk-user-id': 'user_owner',
  'x-clerk-user-email': 'owner@example.com',
  'x-clerk-org-id': 'org_acme'
} as const;

const ownerHeadersBeta = {
  host: 'beta.localhost:3000',
  'x-clerk-user-id': 'user_owner',
  'x-clerk-user-email': 'owner@example.com',
  'x-clerk-org-id': 'org_beta',
} as const;

describe('catalog wrap design CRUD', () => {
  beforeEach(() => {
    catalogStore.reset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates and lists tenant-scoped wrap designs', async () => {
    await createWrapDesign({
      headers: ownerHeadersAcme,
      payload: {
        name: 'Acme Carbon',
        description: 'Carbon matte black',
        priceCents: 50000,
      },
    });

    await createWrapDesign({
      headers: ownerHeadersBeta,
      payload: {
        name: 'Beta White',
        description: 'Gloss white',
        priceCents: 45000,
      },
    });

    await createWrapDesign({
      headers: ownerHeadersAcme,
      payload: {
        name: 'Acme Satin',
        description: 'Satin black',
        priceCents: 65000,
      },
    });

    const acmeDesigns = await listWrapDesigns({
      headers: ownerHeadersAcme,
      query: {
        tenantId: 'tenant_acme',
        search: {
          query: 'black',
        },
        filter: {
          minPriceCents: 40000,
          maxPriceCents: 60000,
        },
        sort: {
          field: 'priceCents',
          direction: 'asc',
        },
        pagination: {
          page: 1,
          pageSize: 10,
        },
      },
    });
    const betaDesigns = await listWrapDesigns({
      headers: ownerHeadersBeta,
      query: {
        tenantId: 'tenant_beta',
        pagination: {
          page: 1,
          pageSize: 10,
        },
      },
    });

    expect(acmeDesigns.total).toBe(1);
    expect(acmeDesigns.page).toBe(1);
    expect(acmeDesigns.pageSize).toBe(10);
    expect(acmeDesigns.pageCount).toBe(1);
    expect(acmeDesigns.hasNextPage).toBe(false);
    expect(acmeDesigns.items[0]?.name).toBe('Acme Carbon');
    expect(betaDesigns.total).toBe(1);
    expect(betaDesigns.items[0]?.name).toBe('Beta White');
  });

  it('supports deterministic sort and pagination metadata', async () => {
    await createWrapDesign({
      headers: ownerHeadersAcme,
      payload: {
        name: 'Acme Entry',
        priceCents: 30000,
      },
    });
    await createWrapDesign({
      headers: ownerHeadersAcme,
      payload: {
        name: 'Acme Mid',
        priceCents: 50000,
      },
    });
    await createWrapDesign({
      headers: ownerHeadersAcme,
      payload: {
        name: 'Acme Premium',
        priceCents: 70000,
      },
    });

    const pageTwo = await listWrapDesigns({
      headers: ownerHeadersAcme,
      query: {
        tenantId: 'tenant_acme',
        sort: {
          field: 'priceCents',
          direction: 'desc',
        },
        pagination: {
          page: 2,
          pageSize: 1,
        },
      },
    });

    expect(pageTwo.total).toBe(3);
    expect(pageTwo.page).toBe(2);
    expect(pageTwo.pageSize).toBe(1);
    expect(pageTwo.pageCount).toBe(3);
    expect(pageTwo.hasNextPage).toBe(true);
    expect(pageTwo.items[0]?.name).toBe('Acme Mid');
  });

  it('supports update and delete via actions', async () => {
    const created = await createWrapDesign({
      headers: ownerHeadersAcme,
      payload: {
        name: 'Acme Matte',
        priceCents: 52000,
      },
    });

    const updated = await updateWrapDesign({
      headers: ownerHeadersAcme,
      payload: {
        id: created.id,
        isPublished: true,
        priceCents: 54000,
      },
    });
    expect(updated?.id).toBe(created.id);

    await expect(
      getWrapDesign({
        headers: ownerHeadersAcme,
        query: {
          tenantId: 'tenant_acme',
          id: created.id,
        },
      }),
    ).resolves.toMatchObject({
      id: created.id,
      isPublished: true,
      priceCents: 54000,
    });

    const deleted = await deleteWrapDesign({
      headers: ownerHeadersAcme,
      payload: {
        id: created.id,
      },
    });
    expect(deleted).toEqual({
      id: created.id,
      deleted: true,
    });
    await expect(
      getWrapDesign({
        headers: ownerHeadersAcme,
        query: {
          tenantId: 'tenant_acme',
          id: created.id,
        },
      }),
    ).resolves.toBeNull();
  });

  it('prevents cross-tenant reads and writes', async () => {
    const created = await createWrapDesign({
      headers: ownerHeadersAcme,
      payload: {
        name: 'Acme Satin',
        priceCents: 56000,
      },
    });

    const crossTenantRead = getWrapDesign({
      headers: ownerHeadersBeta,
      query: {
        tenantId: 'tenant_beta',
        id: created.id,
      },
    });
    const crossTenantUpdate = await updateWrapDesign({
      headers: ownerHeadersBeta,
      payload: {
        id: created.id,
        name: 'Tampered Name',
      },
    });
    const crossTenantDelete = await deleteWrapDesign({
      headers: ownerHeadersBeta,
      payload: {
        id: created.id,
      },
    });

    await expect(crossTenantRead).resolves.toBeNull();
    expect(crossTenantUpdate).toBeNull();
    expect(crossTenantDelete).toEqual({
      id: created.id,
      deleted: false,
    });
  });

  it('rejects read access when tenant scope does not match host tenant', async () => {
    await expect(
      listWrapDesigns({
        headers: ownerHeadersAcme,
        query: {
          tenantId: 'tenant_beta',
          pagination: {
            page: 1,
            pageSize: 10,
          },
        },
      }),
    ).rejects.toThrowError(TenantAccessError);
  });

  it('rejects sensitive reads for users without tenant membership', async () => {
    await expect(
      listWrapDesigns({
        headers: {
          host: 'acme.localhost:3000',
          'x-clerk-user-id': 'user_unknown',
          'x-clerk-user-email': 'unknown@example.com',
          'x-clerk-org-id': 'org_acme',
        },
        query: {
          tenantId: 'tenant_acme',
          pagination: {
            page: 1,
            pageSize: 10,
          },
        },
      }),
    ).rejects.toThrowError(PermissionError);
  });

  it('checks permission before zod validation in write actions', async () => {
    await expect(
      createWrapDesign({
        headers: {
          host: 'acme.localhost:3000',
          'x-clerk-user-id': 'user_viewer',
          'x-clerk-user-email': 'viewer@example.com',
          'x-clerk-org-id': 'org_acme',
        },
        payload: {
          name: '',
        },
      }),
    ).rejects.toThrowError(PermissionError);

    await expect(
      createWrapDesign({
        headers: ownerHeadersAcme,
        payload: {
          name: '',
        },
      }),
    ).rejects.toThrowError(ActionInputValidationError);
  });

  it('retries transient transaction conflicts for catalog mutations', async () => {
    const originalCreateWrapDesign = tenantScopedPrisma.createWrapDesign.bind(tenantScopedPrisma);
    const createWrapDesignSpy = vi
      .spyOn(tenantScopedPrisma, 'createWrapDesign')
      .mockImplementationOnce(() => {
        throw Object.assign(new Error('Serialization conflict'), {
          code: 'P2034',
        });
      })
      .mockImplementation((input) => originalCreateWrapDesign(input));

    const created = await createWrapDesign({
      headers: ownerHeadersAcme,
      payload: {
        name: 'Retry Mutation',
      },
    });

    const fetched = await getWrapDesign({
      headers: ownerHeadersAcme,
      query: {
        tenantId: 'tenant_acme',
        id: created.id,
      },
    });

    expect(createWrapDesignSpy).toHaveBeenCalledTimes(2);
    expect(fetched?.id).toBe(created.id);
  });

  it('invalidates catalog tags and paths after successful mutations', async () => {
    const revalidateTagSpy = vi.spyOn(cacheInvalidation, 'safeRevalidateTag');
    const revalidatePathSpy = vi.spyOn(cacheInvalidation, 'safeRevalidatePath');

    const created = await createWrapDesign({
      headers: ownerHeadersAcme,
      payload: {
        name: 'Acme Invalidated',
      },
    });

    await updateWrapDesign({
      headers: ownerHeadersAcme,
      payload: {
        id: created.id,
        isPublished: true,
      },
    });

    await deleteWrapDesign({
      headers: ownerHeadersAcme,
      payload: {
        id: created.id,
      },
    });

    expect(revalidateTagSpy).toHaveBeenCalledWith('catalog:tenant_acme');
    expect(revalidateTagSpy).toHaveBeenCalledWith('catalog:tenant_acme:list');
    expect(revalidateTagSpy).toHaveBeenCalledWith(`catalog:tenant_acme:item:${created.id}`);
    expect(revalidatePathSpy).toHaveBeenCalledWith('/catalog/wraps');
    expect(revalidatePathSpy).toHaveBeenCalledWith(`/catalog/wraps/${created.id}`);
  });
});




