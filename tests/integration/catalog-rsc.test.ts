import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { beforeEach, describe, expect, it } from 'vitest';

import { createWrapDesign } from '../../lib/server/actions/catalog/create-wrap-design';
import { updateWrapDesign } from '../../lib/server/actions/catalog/update-wrap-design';
import {
  getPublicWrapById,
  getPublicWraps
} from '../../lib/server/fetchers/catalog/get-public-wraps';
import { catalogStore } from '../../lib/server/fetchers/catalog/store';

const ownerHeaders = {
  host: 'acme.localhost:3000',
  'x-clerk-user-id': 'user_owner',
  'x-clerk-user-email': 'owner@example.com'
} as const;

describe('catalog public rsc surface', () => {
  beforeEach(() => {
    catalogStore.reset();
  });

  it('returns only published wraps from cached public fetchers', async () => {
    const draftWrap = createWrapDesign({
      headers: ownerHeaders,
      payload: {
        tenantId: 'tenant_acme',
        name: 'Acme Draft'
      }
    });

    const publishedWrap = createWrapDesign({
      headers: ownerHeaders,
      payload: {
        tenantId: 'tenant_acme',
        name: 'Acme Published'
      }
    });

    updateWrapDesign({
      headers: ownerHeaders,
      payload: {
        tenantId: 'tenant_acme',
        id: publishedWrap.id,
        isPublished: true
      }
    });

    const wraps = await getPublicWraps('tenant_acme');
    const draftById = await getPublicWrapById('tenant_acme', draftWrap.id);
    const publishedById = await getPublicWrapById('tenant_acme', publishedWrap.id);

    expect(wraps).toHaveLength(1);
    expect(wraps[0]?.id).toBe(publishedWrap.id);
    expect(draftById).toBeNull();
    expect(publishedById?.id).toBe(publishedWrap.id);
  });

  it('keeps public server fetches under the p95 threshold', async () => {
    const publishedWrap = createWrapDesign({
      headers: ownerHeaders,
      payload: {
        tenantId: 'tenant_acme',
        name: 'Acme Fast'
      }
    });

    updateWrapDesign({
      headers: ownerHeaders,
      payload: {
        tenantId: 'tenant_acme',
        id: publishedWrap.id,
        isPublished: true
      }
    });

    const samples: number[] = [];

    for (let attempt = 0; attempt < 20; attempt += 1) {
      const start = performance.now();
      await getPublicWraps('tenant_acme');
      samples.push(performance.now() - start);
    }

    const sorted = [...samples].sort((first, second) => first - second);
    const p95Index = Math.ceil(sorted.length * 0.95) - 1;
    const p95 = sorted[p95Index] ?? Number.POSITIVE_INFINITY;

    expect(p95).toBeLessThan(200);
  });

  it('ensures app catalog routes do not import prisma directly', () => {
    const appFiles = [
      'app/(tenant)/wraps/page.tsx',
      'app/(tenant)/wraps/[id]/page.tsx'
    ].map((filePath) => readFileSync(join(process.cwd(), filePath), 'utf8').toLowerCase());

    expect(appFiles[0]).not.toContain('prisma');
    expect(appFiles[1]).not.toContain('prisma');
  });
});


