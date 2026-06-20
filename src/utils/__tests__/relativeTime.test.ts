import { describe, it, expect } from 'vitest';
import { i18n } from '@/i18n';
import { formatRelativeTime } from '../relativeTime';

const NOW = 1_700_000_000_000;
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

describe('formatRelativeTime', () => {
  it('shows "just now" under a minute', () => {
    expect(formatRelativeTime(NOW - 30_000, i18n.t, NOW)).toBe('just now');
  });

  it('renders minutes through i18n', () => {
    expect(formatRelativeTime(NOW - 12 * MIN, i18n.t, NOW)).toBe('12 min ago');
  });

  it('renders hours through i18n', () => {
    expect(formatRelativeTime(NOW - 3 * HOUR, i18n.t, NOW)).toBe('3 hr ago');
  });

  it('pluralises days', () => {
    expect(formatRelativeTime(NOW - DAY, i18n.t, NOW)).toBe('1 day ago');
    expect(formatRelativeTime(NOW - 2 * DAY, i18n.t, NOW)).toBe('2 days ago');
  });
});
