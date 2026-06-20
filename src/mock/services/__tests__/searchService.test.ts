import { describe, it, expect } from 'vitest';
import { searchAll } from '../searchService';

describe('searchAll', () => {
  it('returns nothing for a blank query', async () => {
    expect(await searchAll('   ')).toEqual([]);
  });

  it('matches sites by name', async () => {
    const sites = await searchAll('lakeside');
    expect(sites.some((s) => s.name === 'Lakeside Mall')).toBe(true);
  });

  it('matches sites by customer', async () => {
    const sites = await searchAll('horizon');
    expect(sites.some((s) => s.name === 'Lakeside Mall')).toBe(true);
  });

  it('is case-insensitive', async () => {
    const sites = await searchAll('LAKESIDE');
    expect(sites.some((s) => s.name === 'Lakeside Mall')).toBe(true);
  });
});
