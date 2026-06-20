import type { AlertRow, AlertSeverity, AlertsQuery, AlertsResult, AlertSummary } from '@/types';
import { MOCK_SITES } from '../data/sites';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const SEVERITY_RANK: Record<AlertSeverity, number> = {
  critical: 0,
  warning: 1,
  info: 2,
};

function flattenAlerts(): AlertRow[] {
  return MOCK_SITES.flatMap((site) =>
    site.alertList.map((a) => ({
      ...a,
      siteName: site.name,
      customer: site.customer,
      siteId: site.id,
    })),
  );
}

type AlertComparator = (a: AlertRow, b: AlertRow) => number;

const ALERT_COMPARATORS: Record<string, AlertComparator> = {
  severity: (a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity],
  siteName: (a, b) => a.siteName.localeCompare(b.siteName),
  at: (a, b) => a.at - b.at,
};

export async function fetchAlerts(query: AlertsQuery): Promise<AlertsResult> {
  await delay(400);

  const source = flattenAlerts();
  const summary: AlertSummary = {
    critical: source.filter((a) => a.severity === 'critical').length,
    warning: source.filter((a) => a.severity === 'warning').length,
    info: source.filter((a) => a.severity === 'info').length,
  };

  const term = query.search.trim().toLowerCase();
  let rows = source.filter((a) => {
    const matchQ =
      !term || a.desc.toLowerCase().includes(term) || a.siteName.toLowerCase().includes(term);
    const matchS = query.severity === 'all' || a.severity === query.severity;
    return matchQ && matchS;
  });

  const comparator = ALERT_COMPARATORS[query.sort];
  if (comparator) {
    const dir = query.order === 'desc' ? -1 : 1;
    rows = [...rows].sort((a, b) => dir * comparator(a, b));
  }

  const total = rows.length;
  const start = (query.page - 1) * query.pageSize;
  rows = rows.slice(start, start + query.pageSize);

  return { rows, total, summary };
}
