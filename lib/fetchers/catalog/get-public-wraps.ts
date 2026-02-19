import { unstable_cache } from 'next/cache';

import type { WrapDesign } from '../../../features/catalog/types';
import { getWrapDesign } from './get-wrap-design';
import { listWrapDesigns } from './list-wrap-designs';

function listPublicWrapsUncached(tenantId: string): readonly WrapDesign[] {
  return listWrapDesigns({ tenantId }).filter((design) => design.isPublished);
}

function getPublicWrapByIdUncached(tenantId: string, id: string): WrapDesign | null {
  const design = getWrapDesign({ tenantId, id });
  if (!design || !design.isPublished) {
    return null;
  }

  return design;
}

function canUseNextCacheRuntime(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  return !error.message.includes('incrementalCache missing');
}

export async function getPublicWraps(tenantId: string): Promise<readonly WrapDesign[]> {
  try {
    const cachedFn = unstable_cache(() => Promise.resolve(listPublicWrapsUncached(tenantId)), [
      'catalog-public-wraps',
      tenantId
    ], {
      revalidate: 60
    });

    return await cachedFn();
  } catch (error) {
    if (canUseNextCacheRuntime(error)) {
      throw error;
    }

    return listPublicWrapsUncached(tenantId);
  }
}

export async function getPublicWrapById(
  tenantId: string,
  id: string
): Promise<WrapDesign | null> {
  try {
    const cachedFn = unstable_cache(
      () => Promise.resolve(getPublicWrapByIdUncached(tenantId, id)),
      ['catalog-public-wrap', tenantId, id],
      {
        revalidate: 60
      }
    );

    return await cachedFn();
  } catch (error) {
    if (canUseNextCacheRuntime(error)) {
      throw error;
    }

    return getPublicWrapByIdUncached(tenantId, id);
  }
}
