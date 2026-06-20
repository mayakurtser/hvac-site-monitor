import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button hierarchy="primary">Click me</Button>);
    expect(screen.getByText('Click me')).toBeDefined();
  });

  it('calls onClick handler', () => {
    const handler = vi.fn();
    render(
      <Button hierarchy="primary" onClick={handler}>
        Submit
      </Button>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('renders as anchor tag when href is provided', () => {
    render(
      <Button hierarchy="primary" href="/somewhere">
        Go
      </Button>,
    );
    expect(screen.getByRole('link')).toBeDefined();
    expect(screen.getByRole('link').getAttribute('href')).toBe('/somewhere');
  });

  it('is disabled when disabled prop is set', () => {
    render(
      <Button hierarchy="primary" disabled>
        Disabled
      </Button>,
    );
    const btn = screen.getByRole('button') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it('applies secondary-gray hierarchy class', () => {
    const { container } = render(
      <Button hierarchy="secondaryGray">Cancel</Button>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toMatch(/secondaryGray/);
  });
});
