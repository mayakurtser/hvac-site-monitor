import { describe, it, expect } from 'vitest';
import { getActiveNav } from '../navItems';

describe('getActiveNav', () => {
  it('treats the root path as sites', () => {
    expect(getActiveNav('/')).toBe('sites');
  });

  it('matches the sites list and detail pages', () => {
    expect(getActiveNav('/sites')).toBe('sites');
    expect(getActiveNav('/sites/abc-123')).toBe('sites');
  });

  it('matches the alerts list and nested alert routes', () => {
    expect(getActiveNav('/alerts')).toBe('alerts');
    expect(getActiveNav('/alerts/xyz')).toBe('alerts');
  });

  it('returns no active item for an unrelated path', () => {
    expect(getActiveNav('/whatever')).toBe('');
  });
});
