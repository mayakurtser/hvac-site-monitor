import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MetricCard } from '../MetricCard';

describe('MetricCard', () => {
  it('renders the value and caption when not loading', () => {
    render(<MetricCard icon="globe" label="Total Sites" value={42} caption="12 customers" />);
    expect(screen.getByText('42')).toBeDefined();
    expect(screen.getByText('12 customers')).toBeDefined();
  });

  it('replaces the value and caption with skeletons while loading', () => {
    const { container } = render(
      <MetricCard icon="globe" label="Total Sites" value={42} caption="12 customers" loading />,
    );
    expect(screen.queryByText('42')).toBeNull();
    expect(screen.queryByText('12 customers')).toBeNull();
    // The label stays visible as static chrome.
    expect(screen.getByText('Total Sites')).toBeDefined();
    expect(container.querySelectorAll('[class*="skeleton"]').length).toBe(2);
  });

  it('omits the caption skeleton when no caption is provided', () => {
    const { container } = render(
      <MetricCard icon="globe" label="Total Sites" value={42} loading />,
    );
    expect(container.querySelectorAll('[class*="skeleton"]').length).toBe(1);
  });
});
