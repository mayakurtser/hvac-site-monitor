import { describe, it, expect } from 'vitest';
import { fetchSites } from '../siteService';
import { MOCK_SITES } from '../../data/sites';

const base = {
  page: 1,
  pageSize: 5,
  sort: 'status',
  order: 'asc' as const,
  search: '',
  status: 'all' as const,
};

describe('fetchSites', () => {
  it('sorts by status with critical first across the whole fleet', async () => {
    const { rows } = await fetchSites({ ...base, pageSize: MOCK_SITES.length });
    expect(rows[0].status).toBe('critical');
    const firstOnline = rows.findIndex((r) => r.status === 'online');
    const lastCritical = rows.map((r) => r.status).lastIndexOf('critical');
    expect(lastCritical).toBeLessThan(firstOnline);
  });

  it('paginates: total is the full filtered count, rows only one page', async () => {
    const { rows, total } = await fetchSites({ ...base, page: 1, pageSize: 3 });
    expect(total).toBe(MOCK_SITES.length);
    expect(rows).toHaveLength(3);
  });

  it('filters by status before paginating', async () => {
    const { rows, total } = await fetchSites({ ...base, status: 'critical', pageSize: 50 });
    expect(rows.every((r) => r.status === 'critical')).toBe(true);
    expect(total).toBe(MOCK_SITES.filter((s) => s.status === 'critical').length);
  });

  it('returns a fleet-wide summary independent of the page and filter', async () => {
    const { summary } = await fetchSites({ ...base, status: 'critical', pageSize: 1 });
    expect(summary.total).toBe(MOCK_SITES.length);
    expect(summary.byStatus.critical).toBe(
      MOCK_SITES.filter((s) => s.status === 'critical').length,
    );
  });
});
