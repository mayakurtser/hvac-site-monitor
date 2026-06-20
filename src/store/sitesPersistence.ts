import { SITE_STATUSES, type SiteStatus, type SortOrder } from '@/types';
import { isRecord, readStored, writeStored } from '@/utils/storage';

const STORAGE_KEY = 'hvac.sites.filters';

export interface PersistedFilters {
  searchQuery: string;
  statusFilter: SiteStatus | 'all';
  sort: string;
  order: SortOrder;
  page: number;
}

function isStatusFilter(value: string): value is SiteStatus | 'all' {
  return value === 'all' || (SITE_STATUSES as readonly string[]).includes(value);
}

export function loadFilters(): Partial<PersistedFilters> | undefined {
  const parsed = readStored(STORAGE_KEY);
  if (!isRecord(parsed)) return undefined;

  const filters: Partial<PersistedFilters> = {};
  if (typeof parsed.searchQuery === 'string') filters.searchQuery = parsed.searchQuery;
  if (typeof parsed.statusFilter === 'string' && isStatusFilter(parsed.statusFilter)) {
    filters.statusFilter = parsed.statusFilter;
  }
  if (typeof parsed.sort === 'string') filters.sort = parsed.sort;
  if (parsed.order === 'asc' || parsed.order === 'desc') filters.order = parsed.order;
  if (typeof parsed.page === 'number' && Number.isInteger(parsed.page) && parsed.page >= 1) {
    filters.page = parsed.page;
  }
  return filters;
}

export function saveFilters(filters: PersistedFilters): void {
  writeStored(STORAGE_KEY, filters);
}
