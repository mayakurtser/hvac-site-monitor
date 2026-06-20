import { SITE_STATUSES, ALERT_SEVERITIES } from '@/types';
import type { Site, SiteAlert } from '@/types';
import { isRecord, readStored, writeStored } from '@/utils/storage';

// Bump whenever generateSites() seed data or the Site/SiteAlert interfaces change —
// otherwise returning visitors keep hydrating a now-stale cached dataset.
export const DATASET_VERSION = 1;

const STORAGE_KEY = 'hvac.mock.dataset';

function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'number');
}

function isSiteAlert(value: unknown): value is SiteAlert {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.desc === 'string' &&
    typeof value.severity === 'string' &&
    (ALERT_SEVERITIES as readonly string[]).includes(value.severity) &&
    typeof value.at === 'number'
  );
}

function isSite(value: unknown): value is Site {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.customer === 'string' &&
    typeof value.city === 'string' &&
    typeof value.status === 'string' &&
    (SITE_STATUSES as readonly string[]).includes(value.status) &&
    typeof value.units === 'number' &&
    typeof value.indoor === 'number' &&
    typeof value.outdoor === 'number' &&
    typeof value.controllers === 'number' &&
    typeof value.setpoint === 'number' &&
    typeof value.alerts === 'number' &&
    (value.avgTemp === null || typeof value.avgTemp === 'number') &&
    (value.trend === null || isNumberArray(value.trend)) &&
    Array.isArray(value.alertList) &&
    value.alertList.every(isSiteAlert)
  );
}

export function loadDataset(): Site[] | undefined {
  const parsed = readStored(STORAGE_KEY);
  if (!isRecord(parsed)) return undefined;
  if (parsed.version !== DATASET_VERSION) return undefined;
  if (!Array.isArray(parsed.sites)) return undefined;
  if (!parsed.sites.every(isSite)) return undefined;
  return parsed.sites as Site[];
}

export function saveDataset(sites: Site[]): void {
  writeStored(STORAGE_KEY, { version: DATASET_VERSION, sites });
}

export function loadOrCreateDataset(generate: () => Site[]): Site[] {
  const cached = loadDataset();
  if (cached) return cached;
  const fresh = generate();
  saveDataset(fresh);
  return fresh;
}
