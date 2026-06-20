import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from '../Badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge color="gray">Online</Badge>);
    expect(screen.getByText('Online')).toBeDefined();
  });

  it('applies color class', () => {
    const { container } = render(<Badge color="success">Active</Badge>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toMatch(/success/);
  });

  it('renders dot when dot prop is true', () => {
    const { container } = render(
      <Badge color="error" dot>
        Critical
      </Badge>,
    );
    const dots = container.querySelectorAll('[class*="dot"]');
    expect(dots.length).toBeGreaterThan(0);
  });

  it('applies sm size class', () => {
    const { container } = render(
      <Badge color="brand" size="sm">
        Tag
      </Badge>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toMatch(/sm/);
  });

  it('applies sm size class by default', () => {
    const { container } = render(<Badge color="gray">Tag</Badge>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toMatch(/sm/);
  });
});
