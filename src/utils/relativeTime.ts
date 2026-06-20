import type { TFunction } from 'i18next';

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function formatRelativeTime(at: number, t: TFunction, now: number = Date.now()): string {
  const diff = Math.max(0, now - at);
  if (diff < MINUTE) return t('time.justNow');
  if (diff < HOUR) return t('time.minutesAgo', { count: Math.floor(diff / MINUTE) });
  if (diff < DAY) return t('time.hoursAgo', { count: Math.floor(diff / HOUR) });
  return t('time.daysAgo', { count: Math.floor(diff / DAY) });
}
