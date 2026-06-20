import type { Site, SiteStatus, SitesQuery, SitesResult, FleetSummary } from '@/types';
import { MOCK_SITES } from '../data/sites';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const STATUS_RANK: Record<SiteStatus, number> = {
  critical:    0,
  offline:     1,
  warning:     2,
  maintenance: 3,
  online:      4,
};

type SiteComparator = (a: Site, b: Site) => number;

const SITE_COMPARATORS: Record<string, SiteComparator> = {
  name:     (a, b) => a.name.localeCompare(b.name),
  customer: (a, b) => a.customer.localeCompare(b.customer),
  status:   (a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status],
  units:    (a, b) => a.units - b.units,
  avgTemp:  (a, b) => (a.avgTemp ?? Infinity) - (b.avgTemp ?? Infinity),
  alerts:   (a, b) => a.alerts - b.alerts,
};

function buildSummary(): FleetSummary {
  const byStatus: Record<SiteStatus, number> = {
    online: 0, warning: 0, critical: 0, maintenance: 0, offline: 0,
  };
  for (const s of MOCK_SITES) byStatus[s.status] += 1;

  return {
    total: MOCK_SITES.length,
    customers: new Set(MOCK_SITES.map((s) => s.customer)).size,
    online: byStatus.online,
    healthPercent: MOCK_SITES.length > 0 ? Math.round((byStatus.online / MOCK_SITES.length) * 100) : 0,
    attention: byStatus.warning + byStatus.critical + byStatus.offline,
    alerts: MOCK_SITES.reduce((n, s) => n + s.alerts, 0),
    criticalAlerts: MOCK_SITES.reduce(
      (n, s) => n + s.alertList.filter((a) => a.severity === 'critical').length,
      0,
    ),
    byStatus,
  };
}

export async function fetchSites(query: SitesQuery): Promise<SitesResult> {
  await delay(400);

  const term = query.search.trim().toLowerCase();
  let rows = MOCK_SITES.filter((s) => {
    const matchQ = !term || s.name.toLowerCase().includes(term) || s.customer.toLowerCase().includes(term);
    const matchS = query.status === 'all' || s.status === query.status;
    return matchQ && matchS;
  });

  const comparator = SITE_COMPARATORS[query.sort];
  if (comparator) {
    const dir = query.order === 'desc' ? -1 : 1;
    rows = [...rows].sort((a, b) => dir * comparator(a, b));
  }

  const total = rows.length;
  const start = (query.page - 1) * query.pageSize;
  rows = rows.slice(start, start + query.pageSize);

  return { rows, total, summary: buildSummary() };
}

export async function fetchSiteById(id: string): Promise<Site | undefined> {
  await delay(200);
  return MOCK_SITES.find((s) => s.id === id);
}
