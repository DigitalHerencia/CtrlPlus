import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import TenantError from '../../app/(tenant)/error';
import TenantLoading from '../../app/(tenant)/loading';
import CatalogError from '../../app/(tenant)/catalog/error';
import CatalogLoading from '../../app/(tenant)/catalog/loading';
import OperationsError from '../../app/(tenant)/operations/error';
import OperationsLoading from '../../app/(tenant)/operations/loading';

function repositoryPath(...segments: string[]): string {
  return path.resolve(process.cwd(), ...segments);
}

describe('tenant route loading and error boundaries', () => {
  it('keeps required loading and error boundary files in tenant route groups', async () => {
    const requiredFiles = [
      repositoryPath('app', '(tenant)', 'loading.tsx'),
      repositoryPath('app', '(tenant)', 'error.tsx'),
      repositoryPath('app', '(tenant)', 'catalog', 'loading.tsx'),
      repositoryPath('app', '(tenant)', 'catalog', 'error.tsx'),
      repositoryPath('app', '(tenant)', 'operations', 'loading.tsx'),
      repositoryPath('app', '(tenant)', 'operations', 'error.tsx'),
    ];

    await Promise.all(requiredFiles.map(async (filePath) => expect(access(filePath)).resolves.toBeUndefined()));
  });

  it('renders loading boundaries for tenant, catalog, and operations routes', () => {
    const tenantMarkup = renderToStaticMarkup(createElement(TenantLoading));
    const catalogMarkup = renderToStaticMarkup(createElement(CatalogLoading));
    const operationsMarkup = renderToStaticMarkup(createElement(OperationsLoading));

    expect(tenantMarkup).toContain('Loading tenant workspace');
    expect(catalogMarkup).toContain('Loading catalog routes');
    expect(operationsMarkup).toContain('Loading operations routes');
  });

  it('renders retryable route error boundaries with surfaced error messages', () => {
    const reset = vi.fn();
    const error = new Error('fetch failed for tenant route');

    const tenantMarkup = renderToStaticMarkup(createElement(TenantError, { error, reset }));
    const catalogMarkup = renderToStaticMarkup(createElement(CatalogError, { error, reset }));
    const operationsMarkup = renderToStaticMarkup(createElement(OperationsError, { error, reset }));

    expect(tenantMarkup).toContain('Tenant workspace failed to load');
    expect(catalogMarkup).toContain('Catalog route failed to load');
    expect(operationsMarkup).toContain('Operations route failed to load');
    expect(tenantMarkup).toContain('fetch failed for tenant route');
    expect(catalogMarkup).toContain('fetch failed for tenant route');
    expect(operationsMarkup).toContain('fetch failed for tenant route');
    expect(tenantMarkup).toContain('Retry');
    expect(catalogMarkup).toContain('Retry');
    expect(operationsMarkup).toContain('Retry');
  });

  it('keeps slow/failing data sections wrapped in Suspense fallbacks', async () => {
    const pageFiles = [
      repositoryPath('app', '(tenant)', 'operations', 'admin', 'page.tsx'),
      repositoryPath('app', '(tenant)', 'catalog', 'wraps', 'page.tsx'),
      repositoryPath('app', '(tenant)', 'catalog', 'wraps', '[id]', 'page.tsx'),
    ];

    const pageContents = await Promise.all(pageFiles.map(async (filePath) => readFile(filePath, 'utf8')));

    expect(pageContents[0]).toContain('<Suspense fallback={<OperationsSnapshotSkeleton />}');
    expect(pageContents[1]).toContain('<Suspense fallback={<CatalogListSectionSkeleton />}');
    expect(pageContents[2]).toContain('<Suspense fallback={<CatalogDetailSectionSkeleton />}');
  });
});
