import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

async function collectFiles(rootDirectory: string, extensions: readonly string[]): Promise<string[]> {
  const entries = await readdir(rootDirectory, { withFileTypes: true });
  const results: string[] = [];

  for (const entry of entries) {
    const absolutePath = path.join(rootDirectory, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await collectFiles(absolutePath, extensions)));
      continue;
    }

    if (entry.isFile() && extensions.some((extension) => entry.name.endsWith(extension))) {
      results.push(absolutePath);
    }
  }

  return results;
}

describe('architecture boundaries', () => {
  it('keeps Prisma imports out of app route files', async () => {
    const appFiles = await collectFiles(path.resolve(process.cwd(), 'app'), ['.ts', '.tsx']);

    for (const absolutePath of appFiles) {
      const content = (await readFile(absolutePath, 'utf8')).toLowerCase();

      expect(content.includes('@prisma/client'), `${absolutePath} imports @prisma/client`).toBe(false);
      expect(content.includes('lib/db/prisma'), `${absolutePath} imports lib/db/prisma`).toBe(false);
      expect(content.includes('/db/prisma'), `${absolutePath} imports db/prisma`).toBe(false);
    }
  });

  it('keeps fetcher modules read-only against tenantScopedPrisma mutation methods', async () => {
    const fetcherFiles = await collectFiles(path.resolve(process.cwd(), 'lib', 'server', 'fetchers'), ['.ts']);
    const mutationCallPattern = /tenantScopedPrisma\.(create|update|delete|mark|upsert|deactivate)\w*\(/;

    for (const absolutePath of fetcherFiles) {
      const content = await readFile(absolutePath, 'utf8');

      expect(mutationCallPattern.test(content), `${absolutePath} calls a tenantScopedPrisma mutation method`).toBe(
        false,
      );
    }
  });
});
