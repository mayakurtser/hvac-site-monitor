export const SITE_STATUSES = ['online', 'warning', 'critical', 'maintenance', 'offline'] as const;
export type SiteStatus = (typeof SITE_STATUSES)[number];

export const ALERT_SEVERITIES = ['critical', 'warning', 'info'] as const;
export type AlertSeverity = (typeof ALERT_SEVERITIES)[number];

export interface SiteAlert {
  id: string;
  desc: string;
  severity: AlertSeverity;
  at: number;
}

export interface AlertRow extends SiteAlert {
  siteName: string;
  customer: string;
  siteId: string;
}

export interface Site {
  id: string;
  name: string;
  customer: string;
  city: string;
  status: SiteStatus;
  units: number;
  indoor: number;
  outdoor: number;
  controllers: number;
  avgTemp: number | null;
  setpoint: number;
  alerts: number;
  alertList: SiteAlert[];
  trend: number[] | null;
}
