import { describe, expect, it } from 'vitest';

import { computeSlots } from '../../features/scheduling/compute-slots';

describe('computeSlots', () => {
  it('returns available slots excluding overlaps with busy windows', () => {
    const slots = computeSlots({
      workingWindow: {
        startIso: '2026-02-18T08:00:00.000Z',
        endIso: '2026-02-18T11:00:00.000Z'
      },
      busyWindows: [
        {
          startIso: '2026-02-18T09:00:00.000Z',
          endIso: '2026-02-18T09:30:00.000Z'
        }
      ],
      slotMinutes: 30
    });

    expect(slots).toEqual([
      {
        startIso: '2026-02-18T08:00:00.000Z',
        endIso: '2026-02-18T08:30:00.000Z'
      },
      {
        startIso: '2026-02-18T08:30:00.000Z',
        endIso: '2026-02-18T09:00:00.000Z'
      },
      {
        startIso: '2026-02-18T09:30:00.000Z',
        endIso: '2026-02-18T10:00:00.000Z'
      },
      {
        startIso: '2026-02-18T10:00:00.000Z',
        endIso: '2026-02-18T10:30:00.000Z'
      },
      {
        startIso: '2026-02-18T10:30:00.000Z',
        endIso: '2026-02-18T11:00:00.000Z'
      }
    ]);
  });

  it('ignores busy windows outside the working range', () => {
    const slots = computeSlots({
      workingWindow: {
        startIso: '2026-02-18T08:00:00.000Z',
        endIso: '2026-02-18T09:00:00.000Z'
      },
      busyWindows: [
        {
          startIso: '2026-02-18T07:00:00.000Z',
          endIso: '2026-02-18T07:30:00.000Z'
        }
      ],
      slotMinutes: 30
    });

    expect(slots).toHaveLength(2);
  });

  it('throws for invalid scheduling windows', () => {
    expect(() =>
      computeSlots({
        workingWindow: {
          startIso: '2026-02-18T09:00:00.000Z',
          endIso: '2026-02-18T08:00:00.000Z'
        },
        busyWindows: [],
        slotMinutes: 30
      })
    ).toThrow('workingWindow.endIso must be greater than workingWindow.startIso');
  });
});

