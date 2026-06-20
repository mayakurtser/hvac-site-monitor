import type { Site } from '@/types';
import { loadOrCreateDataset } from './datasetCache';

function makeTrend(base: number, swing: number, drift: number): number[] {
  return Array.from({ length: 24 }, (_, i) => {
    const t = i / 23;
    const wave = Math.sin(t * Math.PI * 2 - 1) * swing;
    const noise = ((Math.sin(i * 12.9) * 43758.5453) % 1) * swing * 0.5;
    return +( base + wave + drift * t + noise).toFixed(1);
  });
}

// Alert timestamps are anchored once when the dataset is generated, then the whole
// dataset is cached to localStorage (see ./datasetCache) so the relative labels the UI
// derives ("12 min ago") stay stable across full page reloads — not just the session.
const NOW = Date.now();
function minutesAgo(n: number): number {
  return NOW - n * 60_000;
}
function hoursAgo(n: number): number {
  return NOW - n * 3_600_000;
}

function addTrend(site: Omit<Site, 'trend'>): Site {
  if (site.avgTemp == null) return { ...site, trend: null };
  const swing = site.status === 'warning' ? 1.3 : site.status === 'critical' ? 1.1 : 0.8;
  const drift = site.status === 'critical' ? 4.0 : site.status === 'warning' ? 1.4 : 0.2;
  return { ...site, trend: makeTrend(site.avgTemp - drift * 0.5, swing, drift) };
}

function generateSites(): Site[] {
  return [
    addTrend({
      id: 'atrium-tower', name: 'Atrium Tower', customer: 'Meridian Real Estate',
      city: 'Chicago, IL', status: 'online', units: 48, indoor: 36, outdoor: 8, controllers: 4,
      avgTemp: 22.4, setpoint: 22, alerts: 0, alertList: [],
    }),
    addTrend({
      id: 'lakeside-mall', name: 'Lakeside Mall', customer: 'Horizon Retail Group',
      city: 'Milwaukee, WI', status: 'warning', units: 112, indoor: 84, outdoor: 20, controllers: 8,
      avgTemp: 25.1, setpoint: 23, alerts: 3,
      alertList: [
        { id: 'a1', desc: 'Indoor unit IDU-18 temperature above setpoint', severity: 'warning', at: minutesAgo(12) },
        { id: 'a2', desc: 'Filter maintenance overdue — Zone 3', severity: 'info', at: hoursAgo(1) },
        { id: 'a3', desc: 'Outdoor unit ODU-4 elevated discharge pressure', severity: 'warning', at: hoursAgo(3) },
      ],
    }),
    addTrend({
      id: 'north-data-center', name: 'North Data Center', customer: 'Vertex Cloud',
      city: 'Columbus, OH', status: 'critical', units: 64, indoor: 40, outdoor: 16, controllers: 8,
      avgTemp: 29.7, setpoint: 21, alerts: 5,
      alertList: [
        { id: 'b1', desc: 'CRAC unit CR-2 compressor fault', severity: 'critical', at: minutesAgo(4) },
        { id: 'b2', desc: 'Hot aisle temperature exceeded 30°C', severity: 'critical', at: minutesAgo(9) },
        { id: 'b3', desc: 'Redundant unit CR-5 failed to start', severity: 'critical', at: minutesAgo(22) },
        { id: 'b4', desc: 'Controller CTL-3 lost connection', severity: 'warning', at: minutesAgo(40) },
        { id: 'b5', desc: 'Chilled water flow below threshold', severity: 'warning', at: hoursAgo(1) },
      ],
    }),
    addTrend({
      id: 'harbor-clinic', name: 'Harbor Medical Clinic', customer: 'Bayfront Health',
      city: 'Cleveland, OH', status: 'online', units: 28, indoor: 22, outdoor: 4, controllers: 2,
      avgTemp: 21.6, setpoint: 22, alerts: 0, alertList: [],
    }),
    addTrend({
      id: 'westfield-logistics', name: 'Westfield Logistics Hub', customer: 'Cargill Distribution',
      city: 'Indianapolis, IN', status: 'warning', units: 96, indoor: 60, outdoor: 28, controllers: 8,
      avgTemp: 24.3, setpoint: 23, alerts: 2,
      alertList: [
        { id: 'c1', desc: 'Zone 7 humidity above range (68%)', severity: 'warning', at: minutesAgo(26) },
        { id: 'c2', desc: 'Scheduled maintenance window starts in 2 hrs', severity: 'info', at: hoursAgo(1) },
      ],
    }),
    addTrend({
      id: 'summit-offices', name: 'Summit Office Park', customer: 'Granite Workspace',
      city: 'Detroit, MI', status: 'maintenance', units: 54, indoor: 42, outdoor: 8, controllers: 4,
      avgTemp: 23.0, setpoint: 22, alerts: 1,
      alertList: [
        { id: 'd1', desc: 'Unit IDU-9 in scheduled maintenance', severity: 'info', at: hoursAgo(2) },
      ],
    }),
    addTrend({
      id: 'riverside-hotel', name: 'Riverside Grand Hotel', customer: 'Crest Hospitality',
      city: 'Cincinnati, OH', status: 'online', units: 140, indoor: 116, outdoor: 16, controllers: 8,
      avgTemp: 22.9, setpoint: 23, alerts: 0, alertList: [],
    }),
    addTrend({
      id: 'fairview-school', name: 'Fairview High School', customer: 'Fairview USD',
      city: 'Grand Rapids, MI', status: 'offline', units: 38, indoor: 30, outdoor: 6, controllers: 2,
      avgTemp: null, setpoint: 21, alerts: 1,
      alertList: [
        { id: 'e1', desc: 'Site gateway offline — no telemetry received', severity: 'critical', at: minutesAgo(18) },
      ],
    }),
    addTrend({
      id: 'cedar-warehouse', name: 'Cedar Cold Storage', customer: 'Northwind Foods',
      city: 'Toledo, OH', status: 'warning', units: 72, indoor: 28, outdoor: 36, controllers: 8,
      avgTemp: 4.8, setpoint: 4, alerts: 2,
      alertList: [
        { id: 'f1', desc: 'Freezer room B above target temperature', severity: 'warning', at: minutesAgo(14) },
        { id: 'f2', desc: 'Defrost cycle ran long on ODU-11', severity: 'info', at: hoursAgo(2) },
      ],
    }),
    addTrend({
      id: 'gateway-airport', name: 'Gateway Airport Terminal C', customer: 'Metro Aviation Authority',
      city: 'Kansas City, MO', status: 'online', units: 188, indoor: 150, outdoor: 24, controllers: 14,
      avgTemp: 23.4, setpoint: 23, alerts: 0, alertList: [],
    }),
  ];
}

export const MOCK_SITES: Site[] = loadOrCreateDataset(generateSites);
