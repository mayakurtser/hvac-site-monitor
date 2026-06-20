import { describe, it, expect, beforeEach } from 'vitest';
import { loadFilters, saveFilters, type PersistedFilters } from '../sitesPersistence';

const FULL: PersistedFilters = {
  searchQuery: 'boston',
  statusFilter: 'warning',
  sort: 'name',
  order: 'desc',
  page: 3,
};

function storageKey(): string {
  const key = localStorage.key(0);
  if (key === null) throw new Error('expected a persisted key');
  return key;
}

describe('sitesPersistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns undefined when nothing is stored', () => {
    expect(loadFilters()).toBeUndefined();
  });

  it('round-trips a full set of filters', () => {
    saveFilters(FULL);
    expect(loadFilters()).toEqual(FULL);
  });

  it('returns undefined for corrupted JSON', () => {
    saveFilters(FULL);
    localStorage.setItem(storageKey(), '{ not json');
    expect(loadFilters()).toBeUndefined();
  });

  it('keeps only valid fields and drops invalid ones', () => {
    saveFilters(FULL);
    localStorage.setItem(
      storageKey(),
      JSON.stringify({ searchQuery: 'austin', statusFilter: 'bogus', order: 'sideways', page: 0 }),
    );
    expect(loadFilters()).toEqual({ searchQuery: 'austin' });
  });
});
