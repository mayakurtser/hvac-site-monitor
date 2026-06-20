import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadDataset, saveDataset, loadOrCreateDataset, DATASET_VERSION } from '../datasetCache';
import type { Site } from '@/types';

const STORAGE_KEY = 'hvac.mock.dataset';

const FIXTURE: Site[] = [
  {
    id: 'site-a',
    name: 'Site A',
    customer: 'Acme',
    city: 'Chicago, IL',
    status: 'online',
    units: 10,
    indoor: 8,
    outdoor: 2,
    controllers: 1,
    avgTemp: 22,
    setpoint: 22,
    alerts: 0,
    alertList: [],
    trend: [21, 22, 23],
  },
  {
    id: 'site-b',
    name: 'Site B',
    customer: 'Globex',
    city: 'Detroit, MI',
    status: 'critical',
    units: 20,
    indoor: 14,
    outdoor: 6,
    controllers: 2,
    avgTemp: null,
    setpoint: 21,
    alerts: 1,
    alertList: [
      { id: 'x1', desc: 'Compressor fault', severity: 'critical', at: 1_700_000_000_000 },
    ],
    trend: null,
  },
];

function firstAlert(sites: Site[]): { siteId: string; alertId: string; at: number } {
  for (const site of sites) {
    const alert = site.alertList[0];
    if (alert) return { siteId: site.id, alertId: alert.id, at: alert.at };
  }
  throw new Error('expected at least one site with an alert');
}

describe('datasetCache', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('round-trips a saved dataset', () => {
    saveDataset(FIXTURE);
    expect(loadDataset()).toEqual(FIXTURE);
  });

  it('returns undefined when nothing is stored', () => {
    expect(loadDataset()).toBeUndefined();
  });

  it('returns undefined when the version does not match', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: DATASET_VERSION + 1, sites: FIXTURE }),
    );
    expect(loadDataset()).toBeUndefined();
  });

  it('returns undefined when the version marker is missing', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ sites: FIXTURE }));
    expect(loadDataset()).toBeUndefined();
  });

  it('returns undefined for corrupted JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{ not json');
    expect(loadDataset()).toBeUndefined();
  });

  it('returns undefined when sites is not an array', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: DATASET_VERSION, sites: 'nope' }));
    expect(loadDataset()).toBeUndefined();
  });

  it('rejects the whole payload when a site field is invalid', () => {
    const badStatus = [{ ...FIXTURE[0], status: 'bogus' }, FIXTURE[1]];
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: DATASET_VERSION, sites: badStatus }),
    );
    expect(loadDataset()).toBeUndefined();

    const badAvgTemp = [{ ...FIXTURE[0], avgTemp: 'hot' }];
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: DATASET_VERSION, sites: badAvgTemp }),
    );
    expect(loadDataset()).toBeUndefined();
  });

  it('rejects the whole payload when a nested alert field is invalid', () => {
    const badSeverity = [
      { ...FIXTURE[1], alertList: [{ id: 'x', desc: 'd', severity: 'bogus', at: 1 }] },
    ];
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: DATASET_VERSION, sites: badSeverity }),
    );
    expect(loadDataset()).toBeUndefined();

    const badAt = [
      { ...FIXTURE[1], alertList: [{ id: 'x', desc: 'd', severity: 'critical', at: 'soon' }] },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: DATASET_VERSION, sites: badAt }));
    expect(loadDataset()).toBeUndefined();
  });

  it('generates and persists on first call, then hydrates from cache', () => {
    const generate = vi.fn(() => FIXTURE);

    const first = loadOrCreateDataset(generate);
    expect(first).toEqual(FIXTURE);
    expect(generate).toHaveBeenCalledTimes(1);

    const second = loadOrCreateDataset(generate);
    expect(second).toEqual(FIXTURE);
    expect(generate).toHaveBeenCalledTimes(1);
  });

  it('keeps the dataset and alert timestamps stable across a simulated full reload', async () => {
    localStorage.clear();
    vi.resetModules();
    const a = (await import('@/mock/data/sites')).MOCK_SITES;
    const original = firstAlert(a);

    // Simulate a full reload: re-evaluate the module without clearing storage.
    vi.resetModules();
    const b = (await import('@/mock/data/sites')).MOCK_SITES;
    const reloadedSite = b.find((site) => site.id === original.siteId);
    const reloadedAlert = reloadedSite?.alertList.find((alert) => alert.id === original.alertId);

    expect(reloadedAlert?.at).toBe(original.at);
    expect(b).toEqual(a);
  });
});
