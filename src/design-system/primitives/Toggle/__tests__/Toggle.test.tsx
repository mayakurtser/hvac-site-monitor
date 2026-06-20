import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Toggle } from '../Toggle';

describe('Toggle', () => {
  it('renders a switch reflecting the checked state', () => {
    render(<Toggle checked aria-label="Notifications" onChange={() => {}} />);
    const sw = screen.getByRole('switch') as HTMLInputElement;
    expect(sw.checked).toBe(true);
  });

  it('calls onChange with the next value when toggled', () => {
    const handler = vi.fn();
    render(<Toggle checked={false} aria-label="Notifications" onChange={handler} />);
    fireEvent.click(screen.getByRole('switch'));
    expect(handler).toHaveBeenCalledWith(true);
  });

  it('is disabled when the disabled prop is set', () => {
    render(<Toggle checked={false} disabled aria-label="Notifications" onChange={() => {}} />);
    expect((screen.getByRole('switch') as HTMLInputElement).disabled).toBe(true);
  });
});
