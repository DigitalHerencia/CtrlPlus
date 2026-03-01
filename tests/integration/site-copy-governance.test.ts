import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  DESIGN_000_BLOCKED_TERMS,
  DESIGN_000_ROUTE_MATRIX
} from '../fixtures/design-000-route-matrix.fixture';

async function collectRoutePageFiles(directory: string): Promise<string[]> {
  const results: string[] = [];
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      results.push(...(await collectRoutePageFiles(absolutePath)));
      continue;
    }

    if (entry.isFile() && entry.name === 'page.tsx') {
      results.push(path.relative(process.cwd(), absolutePath).replaceAll('\\', '/'));
    }
  }

  return results;
}

describe('site copy governance', () => {
  it('keeps DESIGN-000 route matrix aligned with app route pages', async () => {
    const appPageFiles = await collectRoutePageFiles(path.resolve(process.cwd(), 'app'));
    const matrixFiles = DESIGN_000_ROUTE_MATRIX.map((entry) => entry.filePath).sort();

    expect(matrixFiles).toEqual(appPageFiles.sort());
  });

  it('enforces required route-by-route copy and visual snippets', async () => {
    for (const routeExpectation of DESIGN_000_ROUTE_MATRIX) {
      const absolutePath = path.resolve(process.cwd(), routeExpectation.filePath);
      const content = await readFile(absolutePath, 'utf8');

      for (const requiredSnippet of routeExpectation.requiredSnippets) {
        expect(
          content,
          `${routeExpectation.route} (${routeExpectation.filePath}) missing snippet: ${requiredSnippet}`
        ).toContain(requiredSnippet);
      }
    }
  });

  it('avoids blocked hype terms in DESIGN-000 route files', async () => {
    for (const routeExpectation of DESIGN_000_ROUTE_MATRIX) {
      const absolutePath = path.resolve(process.cwd(), routeExpectation.filePath);
      const content = (await readFile(absolutePath, 'utf8')).toLowerCase();

      for (const blockedTerm of DESIGN_000_BLOCKED_TERMS) {
        expect(
          content.includes(blockedTerm),
          `${routeExpectation.route} (${routeExpectation.filePath}) must not include blocked term: ${blockedTerm}`
        ).toBe(false);
      }
    }
  });

  it('keeps primary auth CTAs consistent across public shell and auth routes', async () => {
    const shellContent = await readFile(
      path.resolve(process.cwd(), 'components/shared/layout/public-site-shell.tsx'),
      'utf8',
    );
    const signInContent = await readFile(
      path.resolve(process.cwd(), 'app/(auth)/sign-in/[[...sign-in]]/page.tsx'),
      'utf8'
    );
    const signUpContent = await readFile(
      path.resolve(process.cwd(), 'app/(auth)/sign-up/[[...sign-up]]/page.tsx'),
      'utf8'
    );

    expect(shellContent).toContain('Create Account');
    expect(shellContent.includes('Sign In') || shellContent.includes('Existing Customer')).toBe(true);
    expect(signInContent).toContain('Create Account');
    expect(signUpContent).toContain('Already have an account?');
  });
});
