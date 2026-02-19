import { beforeEach, describe, expect, it } from 'vitest';

import { createWrapDesign } from '../../lib/actions/catalog/create-wrap-design';
import { deleteWrapDesign } from '../../lib/actions/catalog/delete-wrap-design';
import { updateWrapDesign } from '../../lib/actions/catalog/update-wrap-design';
import { getWrapDesign } from '../../lib/fetchers/catalog/get-wrap-design';
import { listWrapDesigns } from '../../lib/fetchers/catalog/list-wrap-designs';
import { catalogStore } from '../../lib/fetchers/catalog/store';

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
  'x-clerk-org-id': 'org_beta'
} as const;

describe('catalog wrap design CRUD', () => {
  beforeEach(() => {
    catalogStore.reset();
  });

  it('creates and lists tenant-scoped wrap designs', async () => {
    await createWrapDesign({
      headers: ownerHeadersAcme,
      payload: {
        tenantId: 'tenant_acme',
        name: 'Acme Carbon',
        priceCents: 50000
      }
    });

    await createWrapDesign({
      headers: ownerHeadersBeta,
      payload: {
        tenantId: 'tenant_beta',
        name: 'Beta White',
        priceCents: 45000
      }
    });

    const acmeDesigns = listWrapDesigns({ tenantId: 'tenant_acme' });
    const betaDesigns = listWrapDesigns({ tenantId: 'tenant_beta' });

    expect(acmeDesigns).toHaveLength(1);
    expect(acmeDesigns[0]?.name).toBe('Acme Carbon');
    expect(betaDesigns).toHaveLength(1);
    expect(betaDesigns[0]?.name).toBe('Beta White');
  });

  it('supports update and delete via actions', async () => {
    const created = await createWrapDesign({
      headers: ownerHeadersAcme,
      payload: {
        tenantId: 'tenant_acme',
        name: 'Acme Matte',
        priceCents: 52000
      }
    });

    const updated = await updateWrapDesign({
      headers: ownerHeadersAcme,
      payload: {
        tenantId: 'tenant_acme',
        id: created.id,
        isPublished: true,
        priceCents: 54000
      }
    });

    expect(updated?.isPublished).toBe(true);
    expect(updated?.priceCents).toBe(54000);

    const deleted = await deleteWrapDesign({
      headers: ownerHeadersAcme,
      tenantId: 'tenant_acme',
      id: created.id
    });

    expect(deleted).toBe(true);
    expect(getWrapDesign({ tenantId: 'tenant_acme', id: created.id })).toBeNull();
  });

  it('prevents cross-tenant reads and writes', async () => {
    const created = await createWrapDesign({
      headers: ownerHeadersAcme,
      payload: {
        tenantId: 'tenant_acme',
        name: 'Acme Satin',
        priceCents: 56000
      }
    });

    const crossTenantRead = getWrapDesign({
      tenantId: 'tenant_beta',
      id: created.id
    });
    const crossTenantUpdate = await updateWrapDesign({
      headers: ownerHeadersBeta,
      payload: {
        tenantId: 'tenant_beta',
        id: created.id,
        name: 'Tampered Name'
      }
    });
    const crossTenantDelete = await deleteWrapDesign({
      headers: ownerHeadersBeta,
      tenantId: 'tenant_beta',
      id: created.id
    });

    expect(crossTenantRead).toBeNull();
    expect(crossTenantUpdate).toBeNull();
    expect(crossTenantDelete).toBe(false);
  });
});


