import { ALERT_SEVERITIES, type AlertSeverity, type SortOrder } from '@/types';
import { isRecord, readStored, writeStored } from '@/utils/storage';

const STORAGE_KEY = 'hvac.alerts.filters';

export interface AlertFilters {
  search: string;
  severity: AlertSeverity | 'all';
  sort: string;
  order: SortOrder;
  page: number;
}

function isSeverityFilter(value: string): value is AlertSeverity | 'all' {
  return value === 'all' || (ALERT_SEVERITIES as readonly string[]).includes(value);
}

export function loadAlertFilters(): Partial<AlertFilters> | undefined {
  const parsed = readStored(STORAGE_KEY);
  if (!isRecord(parsed)) return undefined;

  const filters: Partial<AlertFilters> = {};
  if (typeof parsed.search === 'string') filters.search = parsed.search;
  if (typeof parsed.severity === 'string' && isSeverityFilter(parsed.severity)) {
    filters.severity = parsed.severity;
  }
  if (typeof parsed.sort === 'string') filters.sort = parsed.sort;
  if (parsed.order === 'asc' || parsed.order === 'desc') filters.order = parsed.order;
  if (typeof parsed.page === 'number' && Number.isInteger(parsed.page) && parsed.page >= 1) {
    filters.page = parsed.page;
  }
  return filters;
}

export function saveAlertFilters(filters: AlertFilters): void {
  writeStored(STORAGE_KEY, filters);
}
