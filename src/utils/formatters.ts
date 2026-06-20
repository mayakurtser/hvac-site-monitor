export function formatTemperature(c: number | null): string {
  if (c == null) return '—';
  return `${c.toFixed(1)}°C`;
}

export function formatRelativeTime(timeStr: string): string {
  return timeStr;
}
