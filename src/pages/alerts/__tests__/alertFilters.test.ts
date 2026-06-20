import { describe, it, expect, beforeEach } from 'vitest';
import { loadAlertFilters, saveAlertFilters, type AlertFilters } from '../alertFilters';

const FULL: AlertFilters = {
  search: 'compressor',
  severity: 'critical',
  sort: 'at',
  order: 'desc',
  page: 2,
};

function storageKey(): string {
  const key = localStorage.key(0);
  if (key === null) throw new Error('expected a persisted key');
  return key;
}

describe('alertFilters', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns undefined when nothing is stored', () => {
    expect(loadAlertFilters()).toBeUndefined();
  });

  it('round-trips a full set of filters', () => {
    saveAlertFilters(FULL);
    expect(loadAlertFilters()).toEqual(FULL);
  });

  it('returns undefined for corrupted JSON', () => {
    saveAlertFilters(FULL);
    localStorage.setItem(storageKey(), '{ not json');
    expect(loadAlertFilters()).toBeUndefined();
  });

  it('keeps only valid fields and drops invalid ones', () => {
    saveAlertFilters(FULL);
    localStorage.setItem(
      storageKey(),
      JSON.stringify({ search: 'fan', severity: 'bogus', order: 'sideways', page: 0 }),
    );
    expect(loadAlertFilters()).toEqual({ search: 'fan' });
  });
});
