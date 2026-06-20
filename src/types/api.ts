import type { Site, SiteStatus, AlertSeverity, AlertRow } from './site';

export type SortOrder = 'asc' | 'desc';

export interface Page<T> {
  rows: T[];
  total: number;
}

export interface SitesQuery {
  page: number;
  pageSize: number;
  sort: string;
  order: SortOrder;
  search: string;
  status: SiteStatus | 'all';
}

export interface FleetSummary {
  total: number;
  customers: number;
  online: number;
  healthPercent: number;
  attention: number;
  alerts: number;
  criticalAlerts: number;
  byStatus: Record<SiteStatus, number>;
}

export interface SitesResult extends Page<Site> {
  summary: FleetSummary;
}

export interface AlertsQuery {
  page: number;
  pageSize: number;
  sort: string;
  order: SortOrder;
  search: string;
  severity: AlertSeverity | 'all';
}

export interface AlertSummary {
  critical: number;
  warning: number;
  info: number;
}

export interface AlertsResult extends Page<AlertRow> {
  summary: AlertSummary;
}
