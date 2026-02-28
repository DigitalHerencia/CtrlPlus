import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const targetFiles = [
  join(
    process.cwd(),
    'node_modules/.pnpm/playwright@1.58.2/node_modules/playwright/lib/mcp/browser/browserContextFactory.js'
  ),
  join(
    process.cwd(),
    'node_modules/.pnpm/playwright@1.58.2/node_modules/playwright/lib/mcp/extension/cdpRelay.js'
  )
];

const from = 'playwright-core/lib/registry/index';
const to = 'playwright-core/lib/server/registry/index';

for (const filePath of targetFiles) {
  try {
    const current = readFileSync(filePath, 'utf8');
    if (!current.includes(from)) continue;
    writeFileSync(filePath, current.replaceAll(from, to), 'utf8');
  } catch {
    // Ignore if layout/version differs; script is best-effort for 1.58.2.
  }
}
