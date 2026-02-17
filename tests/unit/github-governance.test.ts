import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import labels from '../../.github/labels.json';
import manifest from '../../task-manifest.json';
import project from '../../.github/project-v2.json';

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

  it('keeps performance instrumentation template labels in taxonomy', () => {
    const template = readFileSync(
      '.github/ISSUE_TEMPLATE/performance-instrumentation.yml',
      'utf8'
    );

    expect(template).toContain('- type:infra');
    expect(template).toContain('- domain:ci');
    expect(template).toContain('- scope:ci');
    expect(template).toContain('- p1');
  });
});
