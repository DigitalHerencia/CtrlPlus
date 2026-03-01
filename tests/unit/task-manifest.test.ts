import { describe, expect, it } from 'vitest';
import manifest from '../../.codex/manifests/github/task-manifest.json';

describe('task-manifest governance contract', () => {
  it('defines milestone order and matching milestone entries', () => {
    const order = manifest.milestone_order;
    const milestoneIds = manifest.milestones.map((milestone) => milestone.id);

    expect(order.length).toBeGreaterThan(0);
    expect(new Set(order).size).toBe(order.length);
    expect(milestoneIds).toEqual(order);
  });

  it('ensures each task has labels and a task id', () => {
    for (const milestone of manifest.milestones) {
      for (const task of milestone.tasks) {
        expect(task.id).toMatch(/^[A-Z]+-\d+$/);
        expect(task.labels.length).toBeGreaterThan(0);
      }
    }
  });
});
