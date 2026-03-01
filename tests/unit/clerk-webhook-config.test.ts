import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

function repositoryPath(...segments: string[]): string {
  return path.resolve(process.cwd(), ...segments);
}

describe('clerk webhook configuration contract', () => {
  it('keeps runtime and documentation aligned on webhook secret + endpoint configuration', async () => {
    const [envExample, readme, runbook, techRequirements] = await Promise.all([
      readFile(repositoryPath('.env.example'), 'utf8'),
      readFile(repositoryPath('README.md'), 'utf8'),
      readFile(repositoryPath('.codex', 'docs', '50-release-operations.md'), 'utf8'),
      readFile(repositoryPath('.codex', 'docs', '20-architecture.md'), 'utf8'),
    ]);

    expect(envExample).toContain('CLERK_WEBHOOK_SIGNING_SECRET');
    expect(readme).toContain('CLERK_WEBHOOK_SIGNING_SECRET');
    expect(runbook).toContain('CLERK_WEBHOOK_SIGNING_SECRET');
    expect(runbook).toContain('/api/clerk/webhook');
    expect(techRequirements).toContain('POST /api/clerk/webhook');
    expect(runbook).toContain('user.created');
    expect(runbook).toContain('user.updated');
    expect(runbook).toContain('user.deleted');
    expect(readme).toContain('user.created');
    expect(readme).toContain('user.updated');
    expect(readme).toContain('user.deleted');
  });

  it('keeps Clerk webhook route verification tied to explicit signing-secret input', async () => {
    const routeSource = await readFile(
      repositoryPath('app', 'api', 'clerk', 'webhook-handler', 'route.ts'),
      'utf8'
    );

    expect(routeSource).toContain('CLERK_WEBHOOK_SIGNING_SECRET');
    expect(routeSource).toContain('verifyWebhook');
    expect(routeSource).toContain('signingSecret');
  });
});
