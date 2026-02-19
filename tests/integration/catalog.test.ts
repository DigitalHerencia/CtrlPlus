import { beforeEach, describe, expect, it } from 'vitest';

import { createWrapDesign } from '../../lib/server/actions/catalog/create-wrap-design';
import { deleteWrapDesign } from '../../lib/server/actions/catalog/delete-wrap-design';
import { updateWrapDesign } from '../../lib/server/actions/catalog/update-wrap-design';
import { getWrapDesign } from '../../lib/server/fetchers/catalog/get-wrap-design';
import { listWrapDesigns } from '../../lib/server/fetchers/catalog/list-wrap-designs';
import { catalogStore } from '../../lib/server/fetchers/catalog/store';

const ownerHeadersAcme = {
  host: 'acme.localhost:3000',
  'x-clerk-user-id': 'user_owner',
  'x-clerk-user-email': 'owner@example.com'
} as const;

const ownerHeadersBeta = {
  host: 'beta.localhost:3000',
  'x-clerk-user-id': 'user_owner',
  'x-clerk-user-email': 'owner@example.com'
} as const;

describe('catalog wrap design CRUD', () => {
  beforeEach(() => {
    catalogStore.reset();
  });

  it('creates and lists tenant-scoped wrap designs', () => {
    createWrapDesign({
      headers: ownerHeadersAcme,
      payload: {
        tenantId: 'tenant_acme',
        name: 'Acme Carbon',
        priceCents: 50000
      }
    });

    createWrapDesign({
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

  it('supports update and delete via actions', () => {
    const created = createWrapDesign({
      headers: ownerHeadersAcme,
      payload: {
        tenantId: 'tenant_acme',
        name: 'Acme Matte',
        priceCents: 52000
      }
    });

    const updated = updateWrapDesign({
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

    const deleted = deleteWrapDesign({
      headers: ownerHeadersAcme,
      tenantId: 'tenant_acme',
      id: created.id
    });

    expect(deleted).toBe(true);
    expect(getWrapDesign({ tenantId: 'tenant_acme', id: created.id })).toBeNull();
  });

  it('prevents cross-tenant reads and writes', () => {
    const created = createWrapDesign({
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
    const crossTenantUpdate = updateWrapDesign({
      headers: ownerHeadersBeta,
      payload: {
        tenantId: 'tenant_beta',
        id: created.id,
        name: 'Tampered Name'
      }
    });
    const crossTenantDelete = deleteWrapDesign({
      headers: ownerHeadersBeta,
      tenantId: 'tenant_beta',
      id: created.id
    });

    expect(crossTenantRead).toBeNull();
    expect(crossTenantUpdate).toBeNull();
    expect(crossTenantDelete).toBe(false);
  });
});


