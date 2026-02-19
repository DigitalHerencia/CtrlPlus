import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import labels from '../../.github/labels.json';
import manifest from '../../.github/task-manifest.json';
import project from '../../.github/project-v2.json';

const e2eTriggerGlobs = [
  'app/(auth)/**',
  'app/(tenant)/wraps/**',
  'app/api/stripe/**',
  'features/authz/**',
  'features/catalog/**',
  'features/scheduling/**',
  'features/visualizer/**',
  'lib/actions/catalog/**',
  'lib/actions/create-booking.ts',
  'lib/actions/create-checkout-session.ts',
  'lib/actions/create-invoice.ts',
  'lib/actions/create-template-preview.ts',
  'lib/actions/create-upload-preview.ts',
  'lib/auth/**',
  'lib/fetchers/booking-store.ts',
  'lib/fetchers/catalog/**',
  'lib/fetchers/get-availability.ts',
  'lib/fetchers/get-invoice.ts',
  'lib/rate-limit/fixed-window-limiter.ts',
  'lib/rate-limit/upload-rate-limit.ts',
  'lib/storage/upload-store.ts',
  'lib/tenancy/**',
  'prisma/**',
  'proxy.ts',
  'tests/e2e/**',
  'package.json',
  'pnpm-lock.yaml',
  'playwright.config.*',
  'next.config.*',
  '.github/workflows/**'
] as const;

const staleE2eTriggerGlobs = [
  'app/(tenant)/schedule/**',
  'app/(tenant)/checkout/**',
  'app/(tenant)/visualizer/**',
  'features/billing/**'
] as const;

describe('github governance assets', () => {
  it('keeps task labels aligned with .github/labels.json', () => {
    const knownLabels = new Set(labels.labels.map((label) => label.name));
    const unknownLabels: string[] = [];

    for (const milestone of manifest.milestones) {
      for (const task of milestone.tasks) {
        for (const label of task.labels) {
          if (!knownLabels.has(label)) {
            unknownLabels.push(`${task.id}:${label}`);
          }
        }
      }
    }

    expect(unknownLabels).toEqual([]);
  });

  it('defines required project fields for task metadata', () => {
    const fieldNames = new Set(project.fields.map((field) => field.name));

    expect(fieldNames.has('Domain')).toBe(true);
    expect(fieldNames.has('Risk Level')).toBe(true);
    expect(fieldNames.has('Requires Migration')).toBe(true);
    expect(fieldNames.has('Requires E2E')).toBe(true);
  });

  it('keeps only active issue templates in repository', () => {
    expect(existsSync('.github/ISSUE_TEMPLATE/bug.yml')).toBe(true);
    expect(existsSync('.github/ISSUE_TEMPLATE/feature.yml')).toBe(true);
    expect(existsSync('.github/ISSUE_TEMPLATE/infra.yml')).toBe(true);
    expect(existsSync('.github/ISSUE_TEMPLATE/performance-instrumentation.yml')).toBe(
      false
    );
  });

  it('keeps docs label taxonomy aligned with scope labels', () => {
    const workflowDoc = readFileSync('docs/github-workflow.md', 'utf8');

    expect(workflowDoc).toContain('`scope:ci`');
  });

  it('keeps PR e2e trigger filters aligned across workflow and docs', () => {
    const workflow = readFileSync('.github/workflows/pr-quality-gates.yml', 'utf8');
    const ciDesign = readFileSync('docs/ci-design.md', 'utf8');

    for (const glob of e2eTriggerGlobs) {
      expect(workflow).toContain(`- '${glob}'`);
      expect(ciDesign).toContain(`- \`${glob}\``);
    }

    for (const staleGlob of staleE2eTriggerGlobs) {
      expect(workflow).not.toContain(staleGlob);
      expect(ciDesign).not.toContain(staleGlob);
    }
  });
});
