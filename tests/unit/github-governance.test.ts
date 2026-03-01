import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import labels from '../../.codex/manifests/github/labels.json';
import manifest from '../../.codex/manifests/github/task-manifest.json';
import project from '../../.codex/manifests/github/project-v2.json';

const e2eTriggerGlobs = [
  'app/(auth)/**',
  'app/(tenant)/**',
  'app/api/stripe/**',
  'app/api/clerk/**',
  'components/shared/**',
  'features/**',
  'lib/auth/**',
  'lib/db/**',
  'lib/rate-limit/**',
  'lib/storage/**',
  'lib/tenancy/**',
  'lib/server/**',
  'schemas/**',
  'types/**',
  'prisma/**',
  'proxy.ts',
  'tests/e2e/**',
  'package.json',
  'pnpm-lock.yaml',
  'playwright.config.*',
  'next.config.*',
  '.github/workflows/**'
] as const;

function extractWorkflowE2eGlobs(workflow: string): string[] {
  const lines = workflow.split('\n');
  const globs: string[] = [];
  let inE2eBlock = false;

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine === 'e2e:') {
      inE2eBlock = true;
      continue;
    }

    if (inE2eBlock) {
      const match = trimmedLine.match(/^- '([^']+)'$/);
      if (match) {
        globs.push(match[1]);
        continue;
      }

      if (trimmedLine !== '' && !line.startsWith(' '.repeat(14))) {
        break;
      }
    }
  }

  return globs;
}

function extractCiDesignE2eGlobs(ciDesign: string): string[] {
  const lines = ciDesign.split('\n');
  const globs: string[] = [];
  let inE2eSection = false;

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('Run `test-e2e` for PRs that modify files in any of these paths')) {
      inE2eSection = true;
      continue;
    }

    if (inE2eSection) {
      const match = trimmedLine.match(/^- `([^`]+)`$/);
      if (match) {
        globs.push(match[1]);
        continue;
      }

      if (trimmedLine.startsWith('## ')) {
        break;
      }
    }
  }

  if (globs.length === 0) {
    throw new Error('Could not find e2e glob list in .codex/docs/40-quality-gates.md');
  }

  return globs;
}

describe('github governance assets', () => {
  it('keeps task labels aligned with .codex/manifests/github/labels.json', () => {
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
    const workflowDoc = readFileSync('.codex/docs/30-engineering-workflows.md', 'utf8');

    expect(workflowDoc).toContain('`scope:ci`');
  });

  it('keeps PR e2e trigger filters aligned across workflow and docs', () => {
    const workflow = readFileSync('.github/workflows/pr-quality-gates.yml', 'utf8');
    const ciDesign = readFileSync('.codex/docs/40-quality-gates.md', 'utf8');

    const workflowGlobs = extractWorkflowE2eGlobs(workflow);
    const ciDesignGlobs = extractCiDesignE2eGlobs(ciDesign);

    expect(workflowGlobs).toEqual([...e2eTriggerGlobs]);
    expect(ciDesignGlobs).toEqual([...e2eTriggerGlobs]);
  });
});


