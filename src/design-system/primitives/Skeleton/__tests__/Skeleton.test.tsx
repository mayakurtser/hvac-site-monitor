import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Skeleton } from '../Skeleton';

describe('Skeleton', () => {
  it('renders a skeleton element', () => {
    const { container } = render(<Skeleton />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toMatch(/skeleton/);
  });

  it('is hidden from assistive technology', () => {
    const { container } = render(<Skeleton />);
    const el = container.firstChild as HTMLElement;
    expect(el.getAttribute('aria-hidden')).toBe('true');
  });

  it('merges a custom className', () => {
    const { container } = render(<Skeleton className="custom" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toMatch(/skeleton/);
    expect(el.className).toMatch(/custom/);
  });
});
