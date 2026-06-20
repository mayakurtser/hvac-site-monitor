import { describe, it, expect } from 'vitest';
import { fetchAlerts } from '../alertService';
import { MOCK_SITES } from '../../data/sites';

const allAlerts = MOCK_SITES.flatMap((s) => s.alertList);

const base = {
  page: 1,
  pageSize: 5,
  sort: 'severity',
  order: 'asc' as const,
  search: '',
  severity: 'all' as const,
};

const RANK = { critical: 0, warning: 1, info: 2 } as const;

describe('fetchAlerts', () => {
  it('sorts by severity with critical first across all sites', async () => {
    const { rows } = await fetchAlerts({ ...base, pageSize: allAlerts.length });
    expect(rows[0].severity).toBe('critical');
    const ranks = rows.map((r) => RANK[r.severity]);
    expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
  });

  it('paginates with the full filtered total', async () => {
    const { rows, total } = await fetchAlerts({ ...base, page: 1, pageSize: 4 });
    expect(total).toBe(allAlerts.length);
    expect(rows.length).toBeLessThanOrEqual(4);
  });

  it('reports severity counts as a fleet-wide summary regardless of filter', async () => {
    const { summary } = await fetchAlerts({ ...base, severity: 'critical', pageSize: 1 });
    expect(summary.critical).toBe(allAlerts.filter((a) => a.severity === 'critical').length);
    expect(summary.warning).toBe(allAlerts.filter((a) => a.severity === 'warning').length);
    expect(summary.info).toBe(allAlerts.filter((a) => a.severity === 'info').length);
  });

  it('sorts by site name', async () => {
    const { rows } = await fetchAlerts({ ...base, sort: 'siteName', pageSize: 50 });
    const names = rows.map((r) => r.siteName);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  it('sorts by timestamp, oldest first when ascending', async () => {
    const { rows } = await fetchAlerts({ ...base, sort: 'at', pageSize: 50 });
    const times = rows.map((r) => r.at);
    expect(times).toEqual([...times].sort((a, b) => a - b));
  });
});
