import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { beforeEach, describe, expect, it } from 'vitest';

import { createWrapDesign } from '../../lib/actions/catalog';
import { updateWrapDesign } from '../../lib/actions/catalog';
import {
  getPublicWrapById,
  getPublicWraps,
} from '../../lib/fetchers/catalog';
import { catalogStore } from '../../lib/fetchers/catalog';

const ownerHeaders = {
  host: 'acme.localhost:3000',
  'x-clerk-user-id': 'user_owner',
  'x-clerk-user-email': 'owner@example.com',
  'x-clerk-org-id': 'org_acme'
} as const;

describe('catalog public rsc surface', () => {
  beforeEach(() => {
    catalogStore.reset();
  });

  it('returns only published wraps from cached public fetchers', async () => {
    const draftWrap = await createWrapDesign({
      headers: ownerHeaders,
      payload: {
        name: 'Acme Draft'
      }
    });

    const publishedWrap = await createWrapDesign({
      headers: ownerHeaders,
      payload: {
        name: 'Acme Published'
      }
    });

    await updateWrapDesign({
      headers: ownerHeaders,
      payload: {
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
    const publishedWrap = await createWrapDesign({
      headers: ownerHeaders,
      payload: {
        name: 'Acme Fast'
      }
    });

    await updateWrapDesign({
      headers: ownerHeaders,
      payload: {
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
      'app/(tenant)/catalog/wraps/page.tsx',
      'app/(tenant)/catalog/wraps/[id]/page.tsx',
      'app/(tenant)/catalog/wraps/new/page.tsx',
      'app/(tenant)/catalog/wraps/[id]/edit/page.tsx'
    ].map((filePath) => readFileSync(join(process.cwd(), filePath), 'utf8').toLowerCase());

    expect(appFiles[0]).not.toContain('prisma');
    expect(appFiles[1]).not.toContain('prisma');
    expect(appFiles[2]).not.toContain('prisma');
    expect(appFiles[3]).not.toContain('prisma');
  });
});




