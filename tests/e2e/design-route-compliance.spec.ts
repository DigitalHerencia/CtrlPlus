import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { expect, test } from '@playwright/test';

import {
  DESIGN_000_BLOCKED_TERMS,
  DESIGN_000_ROUTE_MATRIX
} from '../fixtures/design-000-route-matrix.fixture';

test.describe('DESIGN-000 route compliance matrix', () => {
  test('validates required route snippets and blocked terms for each route', async () => {
    for (const routeExpectation of DESIGN_000_ROUTE_MATRIX) {
      const absolutePath = path.resolve(process.cwd(), routeExpectation.filePath);
      const content = await readFile(absolutePath, 'utf8');
      const normalizedContent = content.toLowerCase();

      for (const requiredSnippet of routeExpectation.requiredSnippets) {
        expect(
          content,
          `${routeExpectation.route} (${routeExpectation.filePath}) missing snippet: ${requiredSnippet}`
        ).toContain(requiredSnippet);
      }

      for (const blockedTerm of DESIGN_000_BLOCKED_TERMS) {
        expect(
          normalizedContent.includes(blockedTerm),
          `${routeExpectation.route} (${routeExpectation.filePath}) includes blocked term: ${blockedTerm}`
        ).toBe(false);
      }
    }
  });
});
